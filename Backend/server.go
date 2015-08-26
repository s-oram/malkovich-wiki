//go:generate goversioninfo -icon=Malkovich.ico

package main

import (
	"MicroNote/controllers/commands"
	"MicroNote/controllers/docs"
	"MicroNote/controllers/files"
	"MicroNote/system/malkovich"
	"MicroNote/system/nigella"
	"MicroNote/system/nigella/middleware/cachecontrol"
	"MicroNote/system/nigella/middleware/corsheaders"
	"MicroNote/system/nigella/middleware/requestlogger"
	"MicroNote/system/webserver"
	log "github.com/Sirupsen/logrus"
	"github.com/braintree/manners"
	"github.com/johntdyer/slackrus"
	mux "github.com/julienschmidt/httprouter"
	"github.com/kardianos/osext"
	flag "github.com/ogier/pflag"
	"net"
	"os/exec"
	"path/filepath"
	"strconv"
	"sync"
	//"github.com/spf13/viper"
	math_rand "math/rand"
	"net/http"
	"path"
	"time"
)

func main() {
	var err error

	log.Info(`Build 1.`)

	//============= Parse Command Line Flags ===================
	var UseStandaloneServer *bool = flag.Bool("server", false, `Launch as a standalone server.`)
	var IsDevEnv *bool = flag.Bool("dev", false, `Run in development mode.`)
	flag.Parse()
	//======================

	UserDataDir, err := malkovich.GetUserDataDirectory()
	log.Info(UserDataDir)

	var exeRoot string

	log.Info("start server...")

	UseSlackHook := false
	UseRequestLogger := true

	//log.SetLevel(log.PanicLevel)
	setupLogging(UseSlackHook)

	//=============  General Initialization ===================
	math_rand.Seed(time.Now().UTC().UnixNano())

	exeRoot, err = osext.ExecutableFolder()
	if err != nil {
		log.Fatalf("ERROR: %s", err.Error())
	} else {
		go log.Info("EXE Root: " + exeRoot)
	}

	UserDocRoot, err := malkovich.GetUserDocsDirectory()
	if err != nil {
		log.Fatalf("ERROR: User data directory not found. (%s)", err.Error())
		return
	}

	//=============  Router Initialization ===================
	router := mux.New()

	log.Infof("UserDocRoot = %s", UserDocRoot)

	commandsController := commands.New()
	commandsController.DocRoot = UserDocRoot
	router.POST("/api/v1/commands/pagefiles/:DocName/*filepath", commandsController.OpenFile)

	docServer := docs.New()
	docServer.DocRoot = UserDocRoot

	router.GET("/api/v1/frontpagedoc", docServer.GetFrontPageDocList)
	router.PUT("/api/v1/frontpagedoc/:name", docServer.CreateNewFrontPageDoc)
	router.GET("/api/v1/docs", docServer.GetDocList)
	router.GET("/api/v1/docs/:name/html", docServer.GetDocAsHtml)
	router.GET("/api/v1/docs/:name/md", docServer.GetDocAsMarkDown)
	router.PUT("/api/v1/docs/:name", docServer.UpdateDoc)
	router.DELETE("/api/v1/docs/:name", docServer.DeleteDoc)

	filesController := files.New()
	filesController.DirRoot = UserDocRoot
	FileRoutes := map[string]string{
		"ListFilesForDoc":  "/api/v1/files/list/:DocName",
		"UploadFile":       "/api/v1/files/uploadfile",
		"DeleteFile":       "/api/v1/files/delete/:DocName/*filepath",
		"ViewFile":         "/api/v1/files/view/:DocName/*filepath",
		"Command_OpenFile": "/api/v1/files/open/:DocName/*filepath",
		"Command_ShowFile": "/api/v1/files/show/:DocName/*filepath",
	}

	router.GET(FileRoutes["ListFilesForDoc"], filesController.ListForDoc)
	router.POST(FileRoutes["UploadFile"], filesController.UploadFile)
	router.DELETE(FileRoutes["DeleteFile"], filesController.DeleteFile)
	router.GET(FileRoutes["ViewFile"], filesController.ViewFile)
	router.POST(FileRoutes["Command_ShowFile"], filesController.ShowFile)

	//=== General file handling ===
	var wwwRoot string
	if *IsDevEnv {
		wwwRoot = exeRoot + path.Join("..", "Frontend", "public")
		wwwRoot = filepath.Clean(wwwRoot)
		// TODO:MED It would be good to check if the path exists here.
	} else {
		wwwRoot = path.Join(exeRoot, "www", "public")
		// TODO:MED It would be good to check if the path exists here.
	}
	wfs := webserver.New()
	wfs.DocRoot = wwwRoot
	router.NotFound = wfs.HandleNotFound

	chain := setupMiddleWareHandler(UseRequestLogger, router)

	if *UseStandaloneServer == true {
		runAsStandaloneServer(chain)
	} else {
		runServerWithGui(chain)
	}

}

func setupLogging(UseSlackHook bool) {
	if UseSlackHook {
		log.AddHook(&slackrus.SlackrusHook{
			HookURL:        "https://hooks.slack.com/services/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",
			AcceptedLevels: slackrus.LevelThreshold(log.DebugLevel),
			Channel:        "#go-log",
			IconEmoji:      ":ghost:",
			Username:       "logbot",
		})
	}
}

func setupMiddleWareHandler(UseRequestLogger bool, router *mux.Router) *nigella.Nigella {
	chain := nigella.New()

	if UseRequestLogger {
		chain.Use(requestlogger.New())
	}

	chain.Use(corsheaders.New())
	chain.Use(cachecontrol.New())

	chain.Then(router)

	return chain
}

func runAsStandaloneServer(chain *nigella.Nigella) {
	log.Info("Running Server")
	http.ListenAndServe(":3003", chain)

}

func runServerWithGui(chain *nigella.Nigella) {
	var wg sync.WaitGroup

	listener, err := net.Listen("tcp", `127.0.0.1:0`)
	if err != nil {
		log.Fatalf("ERROR: %s", err.Error())
		return
	}
	port := listener.Addr().(*net.TCPAddr).Port
	portAsString := strconv.Itoa(port)

	log.Infof("Server Listing on http://localhost:%s ", portAsString)

	ServerFunc := func() {
		defer wg.Done()
		log.Info("Running Server")
		manners.Serve(listener, chain)
	}

	//===== start the GUI ===========
	GuiFunc := func() {
		defer wg.Done()

		time.Sleep(1 * time.Second)

		var exeRoot string
		var err error

		exeRoot, err = osext.ExecutableFolder()
		if err != nil {
			log.Fatalf("ERROR: %s", err.Error())
		} else {
			log.Info("EXE Root: " + exeRoot)
		}

		ClientFilePath := filepath.Join(exeRoot, `client`, `Malkovich Client.exe`)

		ClientCmd := exec.Command(ClientFilePath, portAsString)
		err = ClientCmd.Run()
		if err != nil {
			log.Fatal(err)
		}

		manners.Close()
	}

	wg.Add(1)
	wg.Add(1)
	go ServerFunc()
	go GuiFunc()
	wg.Wait()

	log.Info("Everything has finished.")
}

package files

import (
	"bytes"
	"fmt"
	log "github.com/Sirupsen/logrus"
	mux "github.com/julienschmidt/httprouter"
	"io"
	"net/http"
	"os"
	"os/exec"
	"path"
	"path/filepath"
	"runtime"
	"strings"
	"time"
	"vamlib/fs_utils"
	"vamlib/rest_utils"
)

type FilesController struct {
	DirRoot string
}

func New() *FilesController {
	return &FilesController{}
}

func (this *FilesController) ShowFile(rw http.ResponseWriter, req *http.Request, params mux.Params) {
	ResultData := struct {
		IsSuccess bool
		ErrorType string
		ErrorMsg  string
	}{false, "Unknown", ""}
	defer func() {
		if ResultData.IsSuccess == false {
			log.Error("File Delete Error: " + ResultData.ErrorType)
			log.Error(ResultData.ErrorMsg)
		}
		rest_utils.WriteResultData(rw, &ResultData)
	}()

	DocName := params.ByName("DocName")
	if DocName == "" {
		panic("DocName can not be empty.")
	}

	DocFileRoot := this.GetDocFilesRoot(DocName)
	fp := path.Join(DocFileRoot, params.ByName("filepath"))
	fp = filepath.ToSlash(fp)
	fp = path.Clean(fp)
	fp = filepath.FromSlash(fp)
	log.Info(fp)

	// TODO:HIGH should check if the file exists on disc and
	// return an error if the file doesn't exist.

	if runtime.GOOS == "windows" {
		// NOTE: HACK: The command commented out below is to
		// show the referenced file using Windows Explorer.
		// For some reason, the code when run returns a 'status 1`
		// error and causes the application to exit. I'm not sure
		// why and can't figure it out. This answer below advises
		// on how to debug exec.Command() calls but the error message
		// is empty. It's likely I'm doing something wrong but can't
		// see what.
		//
		// How to debug exit code 1.
		// http://stackoverflow.com/q/18159704/395461
		//
		// Instead of fixing the problem, I've added a hacky work around.
		// the `cmd /k` forces the command to be run in a new console window.
		// It seems to work so will do for now.
		//
		//cmd := exec.Command(`explorer`, `/select,`, fp)
		cmd := exec.Command(`cmd`, `/k`, `explorer`, `/select,`, fp)
		var out bytes.Buffer
		var stderr bytes.Buffer
		cmd.Stdout = &out
		cmd.Stderr = &stderr
		err := cmd.Run()
		if err != nil {
			log.Fatal(`Error showing file. ` + err.Error() + ` ` + stderr.String())
			ResultData.IsSuccess = false
			ResultData.ErrorType = "CannotShowFile"
			ResultData.ErrorMsg = err.Error() + ` ` + stderr.String()
			return
		}
	}

	// If we make it this far the file has been uploaded successfully.
	ResultData.IsSuccess = true
	ResultData.ErrorType = ""
	ResultData.ErrorMsg = ""
}

func (this *FilesController) ViewFile(rw http.ResponseWriter, req *http.Request, params mux.Params) {

	DocName := params.ByName("DocName")
	if DocName == "" {
		panic("DocName can not be empty.")
	}

	DocFileRoot := this.GetDocFilesRoot(DocName)
	fp := path.Join(DocFileRoot, params.ByName("filepath"))
	fp = filepath.ToSlash(fp)
	fp = path.Clean(fp)
	fp = filepath.FromSlash(fp)

	// TODO:HIGH we should optionally have a whitelist or blacklist of
	// files that can and can''t be served.
	http.ServeFile(rw, req, fp)
}

func (this *FilesController) DeleteFile(rw http.ResponseWriter, req *http.Request, params mux.Params) {
	ResultData := struct {
		IsSuccess bool
		ErrorType string
		ErrorMsg  string
	}{false, "Unknown", ""}
	defer func() {
		if ResultData.IsSuccess == false {
			log.Error("File Delete Error: " + ResultData.ErrorType)
			log.Error(ResultData.ErrorMsg)
		}
		rest_utils.WriteResultData(rw, &ResultData)
	}()

	DocName := params.ByName("DocName")
	if DocName == "" {
		ResultData.ErrorType = "DocNotFound"
		ResultData.ErrorMsg = "DocName value is empty. Cannot not save file without reference to owner document."
		return
	}

	DocFileRoot := this.GetDocFilesRoot(DocName)
	FullFilePath := path.Join(DocFileRoot, params.ByName("filepath"))
	FullFilePath = filepath.ToSlash(FullFilePath)
	log.Info("FilePath " + FullFilePath)

	err := os.Remove(FullFilePath)
	if err != nil {
		ResultData.ErrorType = "DeleteError"
		ResultData.ErrorMsg = err.Error()
		return
	}

	// If we make it this far...
	ResultData.IsSuccess = true
}

func (this *FilesController) UploadFile(rw http.ResponseWriter, req *http.Request, params mux.Params) {
	// Upload file handler in Golang.
	// https://www.socketloop.com/tutorials/golang-upload-file

	time.Sleep(1 * time.Millisecond)

	ResultData := struct {
		IsSuccess bool
		ErrorType string
		ErrorMsg  string
	}{false, "Unknown", ""}
	defer func() {
		if ResultData.IsSuccess == false {
			log.Error("Upload Error: " + ResultData.ErrorType)
			log.Error(ResultData.ErrorMsg)
		}
		rest_utils.WriteResultData(rw, &ResultData)
	}()

	// the FormFile function takes in the POST input id file
	file, header, err := req.FormFile("myFile")
	if err != nil {
		ResultData.ErrorType = "UploadError"
		ResultData.ErrorMsg = err.Error()
		return
	}
	defer file.Close()

	DocName := req.FormValue("DocName")
	if DocName == "" {
		ResultData.ErrorType = "UploadError"
		ResultData.ErrorMsg = "DocName value is empty. Cannot not save file without reference to owner document."
		return
	}

	DocFileRoot := this.GetDocFilesRoot(DocName)
	os.MkdirAll(DocFileRoot, 0666) //TODO:HIGH what should the permission value be here.

	fn := filepath.Join(DocFileRoot, header.Filename)
	log.Info("Out FN: " + fn)

	out, err := os.Create(fn)
	if err != nil {
		ResultData.ErrorType = "UploadError"
		ResultData.ErrorMsg = err.Error()
		return
	}
	defer out.Close()

	// write the content from POST to the file
	_, err = io.Copy(out, file)
	if err != nil {
		ResultData.ErrorType = "UploadError"
		ResultData.ErrorMsg = err.Error()
		return
	}

	// If we make it this far the file has been uploaded successfully.
	ResultData.IsSuccess = true
	ResultData.ErrorType = ""
	ResultData.ErrorMsg = ""
}

func (this *FilesController) ListForDoc(rw http.ResponseWriter, req *http.Request, params mux.Params) {
	var fileData []string
	fileData = make([]string, 0)

	DocName := params.ByName("DocName")
	DocFileRoot := this.GetDocFilesRoot(DocName)

	walkfn := func(path string, info os.FileInfo, err error) error {
		var text string
		var nodetype string
		var root string
		var name string
		var ext string
		var wikilink string
		path = strings.Replace(path, DocFileRoot, "", -1)
		path = filepath.ToSlash(path)
		if info.IsDir() {
			nodetype = "dir"
			root = filepath.Dir(path)
			root = filepath.ToSlash(root)
			name = filepath.Base(path)
			text = fmt.Sprintf("{\"type\":\"%s\", \"root\":\"%s\", \"name\":\"%s\"}", nodetype, root, name)
		} else {
			nodetype = "file"
			root = filepath.Dir(path)
			root = filepath.ToSlash(root)
			name = filepath.Base(path)
			ext = filepath.Ext(path)

			if root == "/" {
				wikilink = name
				wikilink = fmt.Sprintf("[[%s]]", wikilink)
			} else {
				wikilink = filepath.Join(root, name)
				wikilink = filepath.ToSlash(wikilink)
				wikilink = fmt.Sprintf("[[%s]]", wikilink)
			}
			text = fmt.Sprintf("{\"type\":\"%s\", \"root\":\"%s\", \"name\":\"%s\",  \"ext\":\"%s\", \"wikilink\":\"%s\"}", nodetype, root, name, ext, wikilink)
		}

		fileData = append(fileData, text)
		return nil
	}

	if fs_utils.Exists(DocFileRoot) == true {
		// TODO:MED should probably catch errors here instead
		// of checking if the directory exists prior.
		// (It would be the go way!)
		filepath.Walk(DocFileRoot, walkfn)
	}

	rw.Write([]byte("{\"nodes\":["))

	c1 := 0
	for {
		if c1 < len(fileData)-1 {
			rw.Write([]byte(fileData[c1]))
			rw.Write([]byte(","))
		} else if c1 == len(fileData)-1 {
			rw.Write([]byte(fileData[c1]))
		} else {
			break
		}
		c1 = c1 + 1
	}

	rw.Write([]byte("]}"))
}

func (this *FilesController) GetDocFilesRoot(DocName string) string {
	// TODO:HIGH this method needs to be refactored to the "Malkovich" package.
	return filepath.Join(this.DirRoot, "pages", DocName, "files")
}

package commands

import (
	"MicroNote/system/malkovich"
	//"fmt"
	log "github.com/Sirupsen/logrus"
	mux "github.com/julienschmidt/httprouter"
	"net/http"
	"os/exec"
	"path/filepath"
	"vamlib/fs_utils"
	"vamlib/rest_utils"
)

type CommandsController struct {
	DocRoot string
}

func New() *CommandsController {
	return &CommandsController{}
}

func (this CommandsController) OpenFile(rw http.ResponseWriter, req *http.Request, params mux.Params) {
	ResultData := struct {
		IsSuccess bool
		ErrorType string
		ErrorMsg  string
	}{false, "Unknown", "Unknown Error"}
	defer rest_utils.WriteResultData(rw, &ResultData)

	DocName := params.ByName("DocName")
	if DocName == "" {
		panic("DocName can not be empty.")
	}
	TargetFilePath := params.ByName("filepath")
	if TargetFilePath == "" {
		panic("TargetFilePath can not be empty.")
	}

	rootDir, err := malkovich.GetWikiPageDirectory(DocName)
	if err != nil {
		ResultData.IsSuccess = false
		ResultData.ErrorType = "CannotGetWikiDirectory"
		ResultData.ErrorMsg = err.Error()
		return
	}
	fp := filepath.Join(rootDir, `files`, TargetFilePath)

	log.Infof("OpenFile %s", fp)

	if fs_utils.Exists(fp) != true {
		ResultData.IsSuccess = false
		ResultData.ErrorType = "FileDoesNotExist"
		ResultData.ErrorMsg = err.Error()
		return
	}

	cmd := exec.Command("rundll32.exe", "url.dll,FileProtocolHandler", fp)
	err = cmd.Run()
	if err != nil {
		ResultData.IsSuccess = false
		ResultData.ErrorType = "CannotOpenFile"
		ResultData.ErrorMsg = err.Error()
		return
	}

	//== return the correct AJAX result. ==
	ResultData.IsSuccess = true
	ResultData.ErrorType = ""
	ResultData.ErrorMsg = ""
}

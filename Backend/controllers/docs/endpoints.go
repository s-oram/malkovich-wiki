package docs

// NOTES: Return status codes in Golang.
// http://learntogoogleit.com/post/63098708081/returning-status-codes-in-golang

// Setting HTTP headers
// http://stackoverflow.com/questions/12830095/setting-http-headers-in-golang

import (
	"encoding/json"
	//"fmt"
	log "github.com/Sirupsen/logrus"
	mux "github.com/julienschmidt/httprouter"
	"io/ioutil"
	"net/http"
	"os"
	"vamlib/fp_utils"
	"vamlib/fs_utils"
	"vamlib/rest_utils"
)

type DocsController struct {
	DocRoot string
}

func New() *DocsController {
	return &DocsController{}
}

func (this DocsController) GetFrontPageDocList(rw http.ResponseWriter, req *http.Request, params mux.Params) {
	log.Infof("GetFrontPages DocRoot = %s", this.DocRoot)

	PageList, err := getAllFrontPages(this.DocRoot)
	if err != nil {
		log.Info("Error " + err.Error())
		return
	}

	Data, err := getPageInfoAsJsonData(this.DocRoot, PageList)
	if err != nil {
		log.Info("Error " + err.Error())
		return
	}

	rw.Write([]byte(Data))
}

func (this DocsController) GetDocList(rw http.ResponseWriter, req *http.Request, params mux.Params) {
	// Get listing of all documents.

	PageList, err := getAllPages(this.DocRoot)
	if err != nil {
		log.Info("Error " + err.Error())
		return
	}

	Data, err := getPageInfoAsJsonData(this.DocRoot, PageList)
	if err != nil {
		log.Info("Error " + err.Error())
		return
	}

	rw.Write([]byte(Data))
}

func (this DocsController) GetDocAsHtml(rw http.ResponseWriter, req *http.Request, params mux.Params) {
	var fp string
	var err error

	DocName := fp_utils.TrimExt(params.ByName("name"))
	fp = getDocTextFilePath(this.DocRoot, DocName)

	if fs_utils.Exists(fp) != true {
		rw.WriteHeader(http.StatusNoContent)
		return
	}

	html, err := readPageAsHtml(DocName, fp)
	if err != nil {
		// TODO:MED instead of returning status 500 here,
		// perhaps should return status OK (200) with
		// an error message.
		rw.WriteHeader(500)
		log.Errorf("ERROR %s", err.Error())
		return
	}

	_, err = rw.Write(html)
	if err != nil {
		http.NotFound(rw, req)
		log.Errorf("ERROR %s", err.Error())
		return
	}
}

func (this DocsController) GetDocAsMarkDown(rw http.ResponseWriter, req *http.Request, params mux.Params) {
	var fp string

	DocName := fp_utils.TrimExt(params.ByName("name"))
	fp = getDocTextFilePath(this.DocRoot, DocName)

	//log.Infof(fp)

	data, err := ioutil.ReadFile(fp)
	if err != nil {
		// TODO:MED I'm just assuming the page file isn't here.
		// It might be better to detect the error type here
		// if possible.
		rw.WriteHeader(http.StatusNoContent)
		return
	}

	// WARNING: We don't escape any of the user input data here.
	// I guess this should be OK if the raw data isn't displayed
	// as HTML anywhere.
	unsafe := data

	_, err = rw.Write(unsafe)
	if err != nil {
		log.Errorf("ERROR %s", err.Error())
		return
	}
}

func (this DocsController) CreateNewFrontPageDoc(rw http.ResponseWriter, req *http.Request, params mux.Params) {
	var err error

	ResultData := struct {
		IsSuccess bool
		ErrorType string
		ErrorMsg  string
	}{false, "Unknown", "Unknown Error"}
	defer rest_utils.WriteResultData(rw, &ResultData)

	DocName := params.ByName("name")

	// create an empty directory for the new page.
	PageFilePath := getDocTextFilePath(this.DocRoot, DocName)
	err = createNewPage(PageFilePath)
	if err != nil {
		ResultData.IsSuccess = false
		ResultData.ErrorType = "CannotCreateNewPage"
		ResultData.ErrorMsg = err.Error()
		return
	}

	// open the page data base.
	PageDir := getDocDirectory(this.DocRoot, DocName)
	PageDB, err := openPageDatabase(DocName, PageDir)
	defer closePageDatabase(PageDB)
	if err != nil {
		ResultData.IsSuccess = false
		ResultData.ErrorType = "CannotOpenPageDatabase"
		ResultData.ErrorMsg = err.Error()
		return
	}

	// set front page attribute.
	err = writePageAttribute(PageDB, "IsOnFrontPage", "true")
	if err != nil {
		ResultData.IsSuccess = false
		ResultData.ErrorType = "DatabaseError"
		ResultData.ErrorMsg = err.Error()
		return
	}

	// TODO:HIGH should update the page summary here too.

	//== return the correct AJAX result. ==
	ResultData.IsSuccess = true
	ResultData.ErrorType = ""
	ResultData.ErrorMsg = ""
}

func (this DocsController) UpdateDoc(rw http.ResponseWriter, req *http.Request, params mux.Params) {
	var err error

	RequestData := struct {
		DocText string
	}{}

	ResultData := struct {
		IsSuccess bool
		ErrorType string
		ErrorMsg  string
	}{false, "Unknown", "Unknown Error"}
	defer rest_utils.WriteResultData(rw, &ResultData)

	//=== Update the page content ====
	// TODO:MED replace with rest_utils readrequestdata.
	decoder := json.NewDecoder(req.Body)
	err = decoder.Decode(&RequestData)
	if err != nil {
		ResultData.IsSuccess = false
		ResultData.ErrorType = "CannotReadRequestBody"
		ResultData.ErrorMsg = err.Error()
		return
	}

	DocName := params.ByName("name")
	PageFilePath := getDocTextFilePath(this.DocRoot, DocName)
	err = updatePageContent(DocName, PageFilePath, RequestData.DocText)
	if err != nil {
		ResultData.IsSuccess = false
		ResultData.ErrorType = "CannotUpdatePage"
		ResultData.ErrorMsg = err.Error()
		return
	}

	this.UpdateDocPreview(DocName)

	//== return the correct AJAX result. ==
	ResultData.IsSuccess = true
	ResultData.ErrorType = ""
	ResultData.ErrorMsg = ""
}

func (this DocsController) UpdateDocPreview(DocName string) {
	DocFilePath := getDocTextFilePath(this.DocRoot, DocName)
	PreviewFilePath := getDocPreviewFilePath(this.DocRoot, DocName)
	err := UpdatePageSummary(DocName, DocFilePath, PreviewFilePath)
	if err != nil {
		log.Errorf("ERROR: %s", err.Error())
	}
}

func (this DocsController) GetDocSummary(rw http.ResponseWriter, req *http.Request, params mux.Params) {
	// TODO:HIGH this removing the extension here shouldn't be required
	// but we'll leave it for now.
	DocName := fp_utils.TrimExt(params.ByName("name"))
	fp := getDocPreviewFilePath(this.DocRoot, DocName)

	if fs_utils.Exists(fp) != true {
		rw.WriteHeader(http.StatusNoContent)
		return
	}

	data, err := readPageSummary(fp)
	if err != nil {
		// TODO:MED instead of returning status 500 here,
		// perhaps should return status OK (200) with
		// an error message.
		rw.WriteHeader(500)
		log.Errorf("ERROR %s", err.Error())
		return
	}

	// WARNING: We don't escape any of the user input data here.
	// I guess this should be OK if the raw data isn't displayed
	// as HTML anywhere.
	unsafe := data

	_, err = rw.Write(unsafe)
	if err != nil {
		log.Errorf("ERROR %s", err.Error())
		return
	}

}

func (this DocsController) DeleteDoc(rw http.ResponseWriter, req *http.Request, params mux.Params) {
	ResultData := struct {
		IsSuccess bool
		ErrorType string
		ErrorMsg  string
	}{false, "Unknown", "Unknown Error"}
	defer rest_utils.WriteResultData(rw, &ResultData)

	DocName := params.ByName("name")
	DocDir := getDocDirectory(this.DocRoot, DocName)
	log.Info("delete: " + DocDir)
	err := os.RemoveAll(DocDir)
	//TODO:HIGH ensure the file is contained under the DocRoot.
	if err != nil {
		ResultData.IsSuccess = false
		ResultData.ErrorType = "DeleteFail"
		ResultData.ErrorMsg = err.Error()
	} else {
		ResultData.IsSuccess = true
		ResultData.ErrorType = ""
		ResultData.ErrorMsg = ""
	}
}

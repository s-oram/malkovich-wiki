package docs

import (
	"MicroNote/system/kaufmann"
	"MicroNote/system/malkovich"
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	gq "github.com/PuerkitoBio/goquery"
	log "github.com/Sirupsen/logrus"
	"github.com/boltdb/bolt"
	"github.com/microcosm-cc/bluemonday"
	"github.com/russross/blackfriday"
	"io/ioutil"
	"os"
	"path/filepath"
	"strconv"
	//"strconv"
	"strings"
	"vamlib/fs_utils"
	"vamlib/rand"
)

const frontEndViewDocUrl string = "/doc/view/"

type PageSummaryData struct {
	PageTitle      string
	FirstImage     string
	FirstParagraph string
}

// GetDocLink() returns the URL required to view a document.
func GetDocLink(DocName string) string {
	//TODO:MED is this function being used?
	DocFileName := strings.Replace(DocName, " ", "_", -1)
	hrefAttr := fmt.Sprintf(`%s?name=%s`, frontEndViewDocUrl, DocFileName)
	return hrefAttr
}

func readPageAsHtml(docName, PageFilePath string) ([]byte, error) {
	data, err := ioutil.ReadFile(PageFilePath)
	if err != nil {
		return nil, err
	}

	unsafe := blackfriday.MarkdownCommon(data)
	// TODO: It could be possible sanitize content before and after
	// rendering the wiki-text tags. The post wiki-text sanitising would
	// be slightly looser and allow html class attributes.
	unsafe = kaufmann.RenderWikiText(docName, unsafe)

	p := bluemonday.UGCPolicy()
	p.AllowAttrs("class").Matching(bluemonday.SpaceSeparatedTokens).Globally()
	// NOTE: At the moment we are allowing anything to be placed in a data attribute.
	// We could add a regex to limit the value to valid and safe(!) characters.
	// But we will have to write a regex. I can't see any thing suitable in
	// the bluemonday code.
	// Related: http://stackoverflow.com/q/25897910/395461
	p.AllowAttrs("data-pageid").Globally()
	p.AllowAttrs("data-filename").Globally()
	html := p.SanitizeBytes(unsafe)

	return html, nil
}

func readPageSummary(summaryFilePath string) ([]byte, error) {
	data, err := ioutil.ReadFile(summaryFilePath)
	if err != nil {
		return nil, err
	} else {
		return data, nil
	}

}

func UpdatePageSummary(docName, PageFilePath, PreviewFilePath string) error {
	var pageSummaryData PageSummaryData

	html, err := readPageAsHtml(docName, PageFilePath)
	if err != nil {
		return err
	}
	htmlreader := bytes.NewReader(html)

	//htmlString := string(html)
	//log.Info("HtmlString " + htmlString)

	doc, err := gq.NewDocumentFromReader(htmlreader)
	if err != nil {
		return err
	}

	var SelectedNodes *gq.Selection

	//======= work out the document heading ========
	DocTitle := ""

	if DocTitle == "" {
		SelectedNodes = doc.Find("h1, h2, h3, h4").First()
		if len(SelectedNodes.Nodes) == 1 {
			DocTitle = strings.TrimSpace(SelectedNodes.Text())
		}
	}
	if DocTitle == "" {
		DocTitle = docName
	}
	//DocTitle = base64.StdEncoding.EncodeToString([]byte(DocTitle))
	DocTitle = malkovich.FolderNameToDocName(DocTitle)
	pageSummaryData.PageTitle = DocTitle

	//======== look for an image =========
	DocImage := ""
	SelectedNodes = doc.Find("img").First()
	if len(SelectedNodes.Nodes) == 1 {
		for _, nodeAttr := range SelectedNodes.Nodes[0].Attr {
			if nodeAttr.Key == "src" {
				DocImage = nodeAttr.Val
				break
			}
		}
	}
	//DocImage = base64.StdEncoding.EncodeToString([]byte(DocImage))
	pageSummaryData.FirstImage = DocImage

	//======== look for the first paragraph =========
	FirstParagraph := ""
	SelectedNodes = doc.Find("p").First()
	if len(SelectedNodes.Nodes) == 1 {
		FirstParagraph = strings.TrimSpace(SelectedNodes.Text())
	}
	//TODO:HIGH Maybe limit to a set number of charactors here.
	//FirstParagraph = base64.StdEncoding.EncodeToString([]byte(FirstParagraph))
	pageSummaryData.FirstParagraph = FirstParagraph

	jsonData, err := json.Marshal(pageSummaryData)
	if err != nil {
		return err
	}

	// TODO:MED what would the best file permissions be here?
	err = ioutil.WriteFile(PreviewFilePath, jsonData, os.FileMode(0644))
	if err != nil {
		panic(err.Error())
	}

	return nil
}

func createNewPage(PageFilePath string) error {
	RootDir := filepath.Dir(PageFilePath)
	log.Info("RootDir = " + RootDir)
	err := os.MkdirAll(RootDir, 0666)
	if err != nil {
		return errors.New("Cannot create directory. " + err.Error())
	} else {
		return nil
	}
}

func updatePageContent(DocName, PageFilePath, DocText string) error {
	var tx string
	var OriginalFileName string
	var err error
	var TempFN string
	var TempCopyFN string
	var RootDir string
	var IsUndoRequired bool

	// TODO:MED
	// This function is pretty long because it is taking effort
	// to avoid deleting any user data. The file is written
	// to a temp file first, then the file is renamed to the
	// target filename.
	// The safe file update code should be pulled out to a new function.

	// TODO:HIGH, we could also add a file lock function here to
	// ensure the target file isn't modified while we're modifing it.
	// The same thing as Open Office does.

	// TODO:MED all leading and trailing white space from
	// the file should be removed.

	//========================================
	IsUndoRequired = true
	defer func() {
		if IsUndoRequired {
			os.Remove(TempFN)
			os.Remove(TempCopyFN)
		}
	}()
	//========================================

	OriginalFileName = PageFilePath
	RootDir = filepath.Dir(OriginalFileName)
	err = os.MkdirAll(RootDir, 0666)
	if err != nil {
		return errors.New("Cannot create directory. " + err.Error())
	}

	// TODO:MED creating temporary file names. Should
	// probably look at creating them right away.
	// or add a document lock.
	for {
		tx = rand.AlphaNumeric(32) + ".temp"
		tx = filepath.Join(RootDir, tx)
		if fs_utils.Exists(tx) == false {
			TempFN = tx
			break
		}
	}

	for {
		tx = filepath.Base(OriginalFileName) + "." + rand.AlphaNumeric(32) + ".temp"
		tx = filepath.Join(RootDir, tx)
		if fs_utils.Exists(tx) == false {
			TempCopyFN = tx
			break
		}
	}

	err = ioutil.WriteFile(TempFN, []byte(DocText), os.FileMode(0644))
	if err != nil {
		return errors.New("Cannot write file. " + err.Error())
	}

	if fs_utils.Exists(OriginalFileName) == true {
		err = os.Rename(OriginalFileName, TempCopyFN)
		if err != nil {
			return errors.New("Cannot rename file. " + err.Error())
		}
	}

	IsUndoRequired = false

	err = os.Rename(TempFN, OriginalFileName)
	if err != nil {
		return errors.New("Cannot rename file. " + err.Error())
	}

	err = os.Rename(TempFN, OriginalFileName)

	// remove the temp files.
	os.Remove(TempFN)
	os.Remove(TempCopyFN)

	// if we make it this far, nothing has gone wrong. Yay.
	return nil
}

// IMPORTANT: remember to close the database after usuage.
func openPageDatabase(pageName, pageDirectory string) (*bolt.DB, error) {
	CreateDefaultBuckets := func(PageDB *bolt.DB) error {
		UpdateFuncErr := PageDB.Update(func(tx *bolt.Tx) error {
			_, err := tx.CreateBucketIfNotExists([]byte("PageAttributes"))
			if err != nil {
				return err
			}
			return nil
		})
		return UpdateFuncErr
	}

	pageNameMod := malkovich.DocNameToFolderName(pageName)
	fn := filepath.Join(pageDirectory, pageNameMod) + ".db"
	db, err := bolt.Open(fn, 0600, nil)
	if err != nil {
		db.Close()
		return nil, err
	} else {
		err = CreateDefaultBuckets(db)
		if err != nil {
			db.Close()
			return nil, err
		} else {
			return db, nil
		}
	}
}

func closePageDatabase(db *bolt.DB) {
	if db != nil {
		db.Close()
		db = nil
	}
}

func writePageAttribute(PageDB *bolt.DB, AttrName, AttrValue string) error {
	UpdateFuncErr := PageDB.Update(func(tx *bolt.Tx) error {
		bucket := tx.Bucket([]byte("PageAttributes"))
		return bucket.Put([]byte(AttrName), []byte(AttrValue))
	})
	return UpdateFuncErr
}

func readPageAttribute(PageDB *bolt.DB, AttrName string) (exists bool, value string) {
	PageDB.View(func(tx *bolt.Tx) error {
		bucket := tx.Bucket([]byte("PageAttributes"))
		bv := bucket.Get([]byte(AttrName))
		if bv != nil {
			exists = true
			value = string(bv)
		} else {
			exists = false
			value = ``
		}
		return nil
	})
	return exists, value
}

func getAllPages(DocRoot string) (PageList []string, ErrorResult error) {
	PageList = make([]string, 0)

	PagesDir := filepath.Join(DocRoot, "pages")

	files, err := ioutil.ReadDir(PagesDir)
	if err != nil {
		return nil, err
	}

	for _, f := range files {
		if f.IsDir() {
			PageList = append(PageList, f.Name())
		}
	}
	return PageList, nil
}

func getAllFrontPages(DocRoot string) (PageList []string, ErrorResult error) {
	PageList = make([]string, 0)

	PagesDir := filepath.Join(DocRoot, "pages")

	files, err := ioutil.ReadDir(PagesDir)
	if err != nil {
		return nil, err
	}

	for _, f := range files {
		if f.IsDir() {
			DocName := malkovich.FolderNameToDocName(f.Name())
			pageDirectory := getDocDirectory(DocRoot, DocName)
			PageDB, err := openPageDatabase(DocName, pageDirectory)
			if err == nil {
				exists, value := readPageAttribute(PageDB, `IsOnFrontPage`)
				valueAsBool, _ := strconv.ParseBool(value)
				if (exists == true) && (valueAsBool == true) {
					PageList = append(PageList, f.Name())
				}
			}
			closePageDatabase(PageDB)
		}
	}
	return PageList, nil
}

func getPageInfoAsJsonData(DocRoot string, PageList []string) (Data string, ErrorResult error) {
	var pageSummaryData PageSummaryData
	var TextBuffer string
	var DocName string

	pageInfo := struct {
		PageName       string `json:"pagename"`
		PageLocation   string `json:"href"`
		FirstHeading   string `json:"firstHeading"`
		FirstImage     string `json:"firstImage"`
		FirstParagraph string `json:"firstParagraph"`
	}{}

	TextBuffer = `{"pages":[`
	for _, fileName := range PageList {
		DocName = malkovich.FolderNameToDocName(fileName)
		pageInfo.PageName = DocName
		pageInfo.PageLocation = GetDocLink(fileName)
		pageInfo.FirstHeading = ""
		pageInfo.FirstImage = ""
		pageInfo.FirstParagraph = ""

		DocName := fileName
		summaryFilePath := getDocPreviewFilePath(DocRoot, DocName)
		jsonData, err := readPageSummary(summaryFilePath)
		if err != nil {
			log.Info("ERROR1: " + err.Error())
		}
		if err == nil {
			err = json.Unmarshal(jsonData, &pageSummaryData)
			if err != nil {
				log.Info("ERROR2: " + err.Error())
			}
			if err == nil {
				pageInfo.FirstHeading = pageSummaryData.PageTitle
				pageInfo.FirstImage = pageSummaryData.FirstImage
				pageInfo.FirstParagraph = pageSummaryData.FirstParagraph
			}
		}

		jsonData, err = json.Marshal(pageInfo)
		if err != nil {
			panic(err.Error())
		}
		TextBuffer = TextBuffer + string(jsonData) + `,`
	}
	TextBuffer = strings.TrimSuffix(TextBuffer, ",")
	TextBuffer = TextBuffer + `]}`

	return TextBuffer, nil
}

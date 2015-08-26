package kaufmann

import (
	"bytes"
	"fmt"
	log "github.com/Sirupsen/logrus"
	"html/template"
	"net/url"
	"strings"
)

//const rootApiDomain string = "http://localhost:3002"
const rootApiDomain string = ""
const rootClassName string = "MicroNoteApi"

//const frontEndViewDocUrl string = "/doc/view/"

// urlEncode() encodes a string like Javascript's encodeURIComponent()
// Source: http://stackoverflow.com/a/28407928/395461
func urlEncode(str string) (string, error) {
	u, err := url.Parse(str)
	if err != nil {
		return "", err
	}
	return u.String(), nil
}

func ktext_InternalLink(DocName string) string {
	elementClassName := rootClassName + " MicroNoteApi-InternalDocLink"
	DocFileName := DocName
	DocFileName = strings.Replace(DocFileName, " ", "_", -1)
	classAttr := fmt.Sprintf(`class="%s"`, elementClassName)
	hrefAttr := fmt.Sprintf(`href="/#doc/%s/view"`, DocFileName)
	fmtstr := `<a %s %s>%s</a>`
	Link := fmt.Sprintf(fmtstr, classAttr, hrefAttr, DocName)
	return Link
}

func ktext_InternalNamedLink(DocName, DisplayText string) string {
	elementClassName := rootClassName + " MicroNoteApi-InternalDocLink"
	DocFileName := DocName
	DocFileName = strings.Replace(DocFileName, " ", "_", -1)
	classAttr := fmt.Sprintf(`class="%s"`, elementClassName)
	hrefAttr := fmt.Sprintf(`href="/#doc/%s/view"`, DocFileName)
	fmtstr := `<a %s %s>%s</a>`
	Link := fmt.Sprintf(fmtstr, classAttr, hrefAttr, DisplayText)
	return Link
}

func ktext_ImageLink(DocName, ImageFileName string) string {
	var err error
	elementClassName := rootClassName

	srcfmtstr := rootApiDomain + `/api/v1/files/view/%s/%s`
	ImageSource := fmt.Sprintf(srcfmtstr, DocName, ImageFileName)
	ImageSource, err = urlEncode(ImageSource)
	if err != nil {
		panic(err.Error())
	}

	imgfmtstr := `<img class="%s" src="%s">`
	ImageTag := fmt.Sprintf(imgfmtstr, elementClassName, ImageSource)

	return ImageTag
}

func ktext_FileLink(DocName, FileName string) string {
	var err error

	srcfmtstr := rootApiDomain + `/api/v1/files/view/%s/%s`
	FileLocation := fmt.Sprintf(srcfmtstr, DocName, FileName)
	FileLocation, err = urlEncode(FileLocation)
	if err != nil {
		panic(err.Error())
	}

	Data := struct {
		ElementClassName string
		FileLocation     string
		FileName         string
		PageID           string
	}{}
	Data.ElementClassName = rootClassName + ` MicroNoteApi-FileDownloadLink`
	Data.FileLocation = FileLocation
	Data.PageID = DocName
	Data.FileName = FileName

	//const src = `<a class="{{.ElementClassName}}" href="{{.FileLocation}}" data-pageid="{{.DocName}}" data-filename="{{.FileName}}" >{{.FileName}}</a>`
	const src = `<a class="{{.ElementClassName}}" href="{{.FileLocation}}"  data-pageid="{{.PageID}}" data-filename="{{.FileName}}" >{{.FileName}}</a>`
	t, err := template.New("FileLink").Parse(src)

	var HtmlTag bytes.Buffer
	err = t.Execute(&HtmlTag, Data)
	if err != nil {
		log.Error(err.Error())
		return "ERROR"
	}
	log.Info(HtmlTag.String())
	return HtmlTag.String()

}

package webview

import (
	"fmt"
	mux "github.com/julienschmidt/httprouter"
	"net/http"
)

type WebView struct {
	TemplateDir string
	ContentDir  string
}

func New() *WebView {
	return &WebView{}
}

func (this WebView) Handle(rw http.ResponseWriter, req *http.Request, params mux.Params) {
	if len(params) > 0 {
		Text := params[0]
		fmt.Fprint(rw, Text)
	} else {
		fmt.Fprint(rw, "Hello2")
	}

}

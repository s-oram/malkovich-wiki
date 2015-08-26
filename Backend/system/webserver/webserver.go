package webserver

import (
	//log "github.com/Sirupsen/logrus"
	mux "github.com/julienschmidt/httprouter"
	"net/http"
	"path"
	"path/filepath"
	"vamlib/fs_utils"
)

type WebServer struct {
	DocRoot string
}

func New() *WebServer {
	ws := WebServer{}
	return &ws
}

func (this WebServer) Handle(rw http.ResponseWriter, req *http.Request, params mux.Params) {
	//TODO:HIGH Need to ensure requested file is a child of the directory root.

	var fp string
	fp = path.Join(this.DocRoot, params.ByName("filepath"))
	fp = filepath.ToSlash(fp)
	fp = path.Clean(fp)
	fp = filepath.FromSlash(fp)

	if fs_utils.IsDir(fp) {
		fp = filepath.Join(fp, "index.html")
	}

	if fs_utils.Exists(fp) {
		// TODO:HIGH we should optionally have a whitelist or blacklist of
		// files that can and can''t be served.
		http.ServeFile(rw, req, fp)
	} else {
		// TODO:HIGH need to return a 404 error here.
	}
}

func (this WebServer) HandleNotFound(rw http.ResponseWriter, req *http.Request) {
	var fp string
	fp = path.Join(this.DocRoot, req.URL.Path)
	fp = filepath.ToSlash(fp)
	fp = path.Clean(fp)
	fp = filepath.FromSlash(fp)

	if fs_utils.IsDir(fp) {
		fp = filepath.Join(fp, "index.html")
	}

	if fs_utils.Exists(fp) {
		// TODO:HIGH we should optionally have a whitelist or blacklist of
		// files that can and can''t be served.
		http.ServeFile(rw, req, fp)
	} else {
		// TODO:HIGH need to return a 404 error here.

	}
}

package requestlogger

import (
	log "github.com/Sirupsen/logrus"
	"net/http"
	//"time"
)

type RequestLoggerMiddleWare struct {
}

func New() *RequestLoggerMiddleWare {
	return &RequestLoggerMiddleWare{}
}

func (this RequestLoggerMiddleWare) Execute(next http.Handler) http.Handler {
	addHeaders := func(rw http.ResponseWriter, req *http.Request) {
		go log.Infof("%s %s", req.URL.RequestURI(), req.Method)
		//start := time.Now()
		next.ServeHTTP(rw, req)
		//elapsed := time.Since(start)
		//go log.Infof("%s %s %s", elapsed, req.URL.RequestURI(), req.Method)

	}
	return http.HandlerFunc(addHeaders)
}

func (this RequestLoggerMiddleWare) preProcess(rw http.ResponseWriter, req *http.Request) bool {
	log.Infof("%s %s", req.URL.RequestURI(), req.Method)
	return true
}

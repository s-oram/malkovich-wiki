package cachecontrol

import (
	//log "github.com/Sirupsen/logrus"
	"net/http"
	"path/filepath"
)

type CacheControlMiddleWare struct {
}

func New() *CacheControlMiddleWare {
	return &CacheControlMiddleWare{}
}

func (this CacheControlMiddleWare) Execute(next http.Handler) http.Handler {
	// http://www.sanarias.com/blog/215TestingHTTPcachinginGo
	// http://www.mobify.com/blog/beginners-guide-to-http-cache-headers/

	wrapper := func(rw http.ResponseWriter, req *http.Request) {
		// TODO:MED this is the beginning of a middleware
		// to set the cache headers. Need to figure out a
		// a scheme.
		//
		// Maybe the middleware could be provided with a
		// list of regex expressions to decide
		// which cache rules to apply. Request paths
		// matching the regular expression would have that
		// cache rule applied.

		fn := req.URL.RequestURI()
		ext := filepath.Ext(fn)
		//log.Info(ext)
		if ext == ".js" {
			rw.Header().Set("Cache-Control", "max-age=30")
		}

		next.ServeHTTP(rw, req)
		// Process stuff after the next handler here...
	}
	return http.HandlerFunc(wrapper)
}

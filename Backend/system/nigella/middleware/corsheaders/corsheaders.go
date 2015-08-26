package corsheaders

import (
	"net/http"
)

// Middleware...
// http://www.alexedwards.net/blog/making-and-using-middleware
//
// A recap of request handling.
// http://www.alexedwards.net/blog/a-recap-of-request-handling

// Middleware structure...
// https://gist.github.com/elithrar/21cb76b8e29398722532

// Middleware to CORS headers.

type CorsHeadersMiddleWare struct {
}

func New() *CorsHeadersMiddleWare {
	return &CorsHeadersMiddleWare{}
}

func (this CorsHeadersMiddleWare) Execute(next http.Handler) http.Handler {
	addHeaders := func(rw http.ResponseWriter, req *http.Request) {
		// Process stuff before the next handler here...
		CallNext := this.preProcess(rw, req)
		if CallNext {
			next.ServeHTTP(rw, req)
			// Process stuff after the next handler here...
		}
	}
	return http.HandlerFunc(addHeaders)
}

func (this CorsHeadersMiddleWare) preProcess(rw http.ResponseWriter, req *http.Request) bool {
	// Notes on CORS requests
	// http://stackoverflow.com/a/24818638

	// allow cross domain AJAX requests
	if origin := req.Header.Get("Origin"); origin != "" {
		rw.Header().Set("Access-Control-Allow-Origin", origin)
		rw.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		rw.Header().Set("Access-Control-Allow-Headers",
			"Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
	}

	// Stop here if its Preflighted OPTIONS request
	if req.Method == "OPTIONS" {
		return false
	} else {
		return true
	}
}

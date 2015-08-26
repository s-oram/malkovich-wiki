package nigella

import (
	"net/http"
)

// Execute handler with context.
// https://github.com/gocraft/web

// TODO:HIGH
// Look at the interpose middleware framework. see if a "Nigella" middleware
// can be dynamically wrapped around this standard middleware type.
// https://github.com/carbocation/interpose/blob/master/interpose.go

// Another middleware framework.
// https://github.com/justinas/alice

type MiddleWare interface {
	Execute(http.Handler) http.Handler
}

type Nigella struct {
	middleWares     []MiddleWare
	middleWareFuncs []func(http.Handler) http.Handler
	first           http.Handler
}

func New() *Nigella {
	n := Nigella{}
	return &n
}

func (this *Nigella) Use(middleWares ...MiddleWare) *Nigella {
	for _, mw := range middleWares {
		this.middleWares = append(this.middleWares, mw)
		this.middleWareFuncs = append(this.middleWareFuncs, mw.Execute)
	}
	return this
}

func (this *Nigella) UseFunc(mwf func(http.Handler) http.Handler) *Nigella {
	this.middleWareFuncs = append(this.middleWareFuncs, mwf)
	return this
}

func (this *Nigella) Then(handler http.Handler) *Nigella {
	h := handler
	for c1 := len(this.middleWareFuncs) - 1; c1 >= 0; c1-- {
		h = this.middleWareFuncs[c1](h)
	}
	this.first = h
	return this
}

func (this *Nigella) ServeHTTP(rw http.ResponseWriter, req *http.Request) {
	this.first.ServeHTTP(rw, req)
}

package kaufmann

// WikiText doc for wikimedia. Will use this as a guide.
// http://en.wikipedia.org/wiki/Help:Wiki_markup#Links_and_URLs

// Building parsers in Go.
// http://blog.gopheracademy.com/advent-2014/parsers-lexers/

// Golang Regex Syntax
// https://golang.org/pkg/regexp/syntax/

// Golang Regex Tester
// https://regex-golang.appspot.com/assets/html/index.html

import (
	"bufio"
	"bytes"
	//log "github.com/Sirupsen/logrus"
)

func RenderWikiText(docName string, input []byte) []byte {
	var line string
	var outBuffer bytes.Buffer

	inBuffer := bytes.NewBuffer(input)
	scanner := bufio.NewScanner(inBuffer)

	for scanner.Scan() {
		line = scanner.Text()
		line = processLine(docName, line)
		//log.Info(line)
		outBuffer.WriteString(line)
	}

	return outBuffer.Bytes()
}

func processLine(docName, text string) string {
	rtext := text
	rtext = RenderImageLinks(docName, rtext)
	rtext = RenderFileLinks(docName, rtext)
	rtext = RenderInternalLinks(rtext)
	rtext = RenderInternalNamedLinks(rtext)

	/*
		if rtext != text {
			log.Info(rtext)
		}
	*/

	return rtext
}

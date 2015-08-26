package kaufmann

import (
	//log "github.com/Sirupsen/logrus"
	"path/filepath"
	"regexp"
	"strings"
)

// This regex tester may come in handy.
// https://regex-golang.appspot.com/

func isSupportedImageFile(text string) bool {
	ext := filepath.Ext(text)
	if strings.EqualFold(ext, ".jpg") {
		return true
	}
	if strings.EqualFold(ext, ".png") {
		return true
	}
	if strings.EqualFold(ext, ".gif") {
		return true
	}
	return false
}

func RenderImageLinks(docName, text string) string {
	// Image links are formated like [[James Brown.jpg]]
	replaceFunc := func(text string) string {
		mtext := text
		mtext = strings.Replace(mtext, "[[", "", 1)
		mtext = strings.Replace(mtext, "]]", "", 1)
		mtext = strings.TrimSpace(mtext)
		if isSupportedImageFile(mtext) {
			mtext = ktext_ImageLink(docName, mtext)
			return mtext
		} else {
			return text
		}
	}

	// The regex string to detect image links  \[{2}[^<>:"/\\\|\?\*\]\[]+\.[^<>:"/\\\|\?\*\]\[]+\]{2}
	// The escaped string is \\[{2}[^<>:\"/\\\\\\|\\?\\*\\]\\[]+\\.[^<>:\"/\\\\\\|\\?\\*\\]\\[]+\\]{2}

	// match the [[ at the beginning of the sequence.
	part1 := `\[{2}`
	// match all valid windows filename characters. Don't match [ and ] charactors as they are wiki tag delimiters.
	part2 := `[^<>:"/\\\|\?\*\]\[]+`
	// match a . charactor.
	part3 := `\.`
	// match all valid windows filename characters. Don't match [ and ] charactors as they are wiki tag delimiters.
	part4 := `[^<>:"/\\\|\?\*\]\[]+`
	// match the ]] at the end of the sequence.
	part5 := `\]{2}`

	expr := part1 + part2 + part3 + part4 + part5

	rex := regexp.MustCompile(expr)
	text = rex.ReplaceAllStringFunc(text, replaceFunc)
	return text
}

func RenderFileLinks(docName, text string) string {
	// File links are formated like [[file:James Brown.jpg]]
	// or [[James Brown.jpg]]
	replaceFunc := func(text string) string {
		mtext := text
		mtext = strings.Replace(mtext, "[[file:", "", 1)
		mtext = strings.Replace(mtext, "[[", "", 1)
		mtext = strings.Replace(mtext, "]]", "", 1)
		mtext = strings.TrimSpace(mtext)
		mtext = ktext_FileLink(docName, mtext)
		return mtext
	}

	// match "[[file:" or "[[" at the beginning of the sequence.
	part1 := `(\[{2}file:|\[{2})`
	// match all valid windows filename characters. Don't match [ and ] charactors as they are wiki tag delimiters.
	part2 := `[^<>:"/\\\|\?\*\]\[]+`
	// match a . charactor.
	part3 := `\.`
	// match all valid windows filename characters. Don't match [ and ] charactors as they are wiki tag delimiters.
	part4 := `[^<>:"/\\\|\?\*\]\[]+`
	// match the ]] at the end of the sequence.
	part5 := `\]{2}`

	expr := part1 + part2 + part3 + part4 + part5

	rex := regexp.MustCompile(expr)
	text = rex.ReplaceAllStringFunc(text, replaceFunc)
	return text
}

func RenderInternalLinks(text string) string {
	// Process text like:
	//     blah blah [[My Other Document]] blah blah.

	replaceFunc := func(text string) string {
		mtext := text
		mtext = strings.Replace(mtext, "[[", "", 1)
		mtext = strings.Replace(mtext, "]]", "", 1)
		mtext = strings.TrimSpace(mtext)
		if len(mtext) > 0 {
			return ktext_InternalLink(mtext)
		} else {
			return text
		}
	}

	// regex to match internal wiki links like this: [[Artical Name]]

	// match the [[ at the beginning of the sequence.
	part1 := `\[{2}`
	// match as many as possible 'word' and 'space' charactors.
	part2 := `[ \w]+`
	// match the ]] at the end of the sequence.
	part3 := `\]{2}`

	expr := part1 + part2 + part3

	rex := regexp.MustCompile(expr)
	text = rex.ReplaceAllStringFunc(text, replaceFunc)
	return text
}

func RenderInternalNamedLinks(text string) string {
	// Process text like:
	//     blah blah [[My Other Document]] blah blah.

	replaceFunc := func(text string) string {
		mtext := text
		mtext = strings.Replace(mtext, "[[", "", 1)
		mtext = strings.Replace(mtext, "]]", "", 1)
		textparts := strings.Split(mtext, "|")
		textparts[0] = strings.TrimSpace(textparts[0])
		textparts[1] = strings.TrimSpace(textparts[1])
		if (len(textparts[0]) > 0) && (len(textparts[1]) > 0) {
			return ktext_InternalNamedLink(textparts[0], textparts[1])
		} else {
			return text
		}
	}

	// regex to match internal wiki links like this: [[Artical Name]]

	// match the [[ at the beginning of the sequence.
	part1 := `\[{2}`
	// match as many as possible 'word' and 'space' charactors.
	part2 := `[ \w]+`
	// match a pipe chactor |
	part3 := `\|`
	// match as many as possible 'word' and 'space' charactors.
	part4 := `[ \w]+`
	// match the ]] at the end of the sequence.
	part5 := `\]{2}`

	expr := part1 + part2 + part3 + part4 + part5

	rex := regexp.MustCompile(expr)
	text = rex.ReplaceAllStringFunc(text, replaceFunc)
	return text
}

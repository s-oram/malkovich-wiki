package kaufmann

type Token int

const (
	// Special tokens
	ILLEGAL Token = iota
	EOL           //End-of-line
	EOF           //End-of-file
	WS            //whitespace

	// Element delimiters
	WebLinkOpen   // [ - Link to other websites.
	WebLinkClose  // ]
	WikiLinkOpen  // [[ - Internal links to other wiki documents.
	WikiLinkClose // ]]
	Pipe          // |
)

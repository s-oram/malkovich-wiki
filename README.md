# Malkovich

Malkovich is a personal note keeping application for Windows. 

* Notes are written in Markdown and automatically converted to HTML for display. 
* Notes can link to other notes for basic wiki-like functionality. (Links are created with double square brackets. `[[Example]]`)
* Malkovich runs in the browser as a single page web application. 
* Malkovich is responsive when reading and editing notes as all data is stored locally, not in the cloud. 
* Notes remain available when your internet connection fails. 

![Malkovich Screenshot](/readme/screenshot.png?raw=true)
*Malkovich with a page open for reading and editing side by side.*


## Motivation 

I'd been using a MediaWiki instance installed on a private server for several years to keep personal notes. (I think the wiki format is ideal for certain things.) However MediaWiki isn't ideal for personal use. It's complicated to install, difficult to maintain and backup. I couldn't store private information because I didn't trust the overall security of my server. There's too many vulnerabilities and I'm not a web security expert. I tried out a couple alternatives to MediaWiki but nothing stuck.

Eventually I decided to create Malkovich as my needs are pretty modest and it seemed a good opportunity to learn more about Go, HTML and Javascript . 

## Under the Hood 

Malkovich consists of two main parts.

1. A backend HTTP server written in Go.
2. A GUI written in HTML and Javascript that is displayed in a browser. 

The original plan was to bundle it all up into a standalone application with Electron or similar. However once bundled performance took a big hit and there were a few other small niggles. 

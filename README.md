# Malkovich

Malkovich is a personal note keeping application for Windows. 

* Notes are written in Markdown and automatically converted to HTML for display. 
* Notes can link to other notes for basic wiki-like functionality. (Links are created with double square brackets. `[[Example]]`)
* Malkovich is like a web application except it is installed locally and all data is kept on your machine. A small console application runs a server in the background. The Malkovich GUI is shown in your browser. 
* Malkovich is super snappy when reading and editing notes because all data is stored locally, not in the cloud. 
* Malkovich notes remain available when your internet connection fails. 

## Motivation 

I'd been using a MediaWiki instance installed on a private server for several years to keep personal notes. (I think the wiki format is ideal for certain things.) However MediaWiki isn't ideal for personal use. It's complicated to install, difficult to maintain and backup. I couldn't store private information because I didn't trust the overall security of my server. There's too many vulnerabilities and I'm not a web security expert. I tried out a couple alternatives to MediaWiki but nothing stuck.

Eventually I decided to create Malkovich as my needs are pretty modest and it seemed a good opportunity to learn more about Go, HTML and javascript . 

## Under the Hood 

Malkovich consists of two main parts.

1. A backend HTTP server written in Go.
2. A GUI written in HTML and javascript that is displayed in a browser. 

The original plan was to bundle it all up into a standalone application with Electron or similar. However once bundled performance took a big hit and there were a few other small niggles. 

## Project Status

Malkovich is a small side project. It's something I find useful and provides learning opportunities. There is no immediate plan to distribute it to a wider audience. 

I'm currently rewriting the frontend in Vue.js. Originally the frontend was developed with Riot.js. 



# Malkovich (Discontinued)

Malkovich is a personal note keeping application for Windows. 

* Notes are written in Markdown. 
* Notes can link to other notes for wiki style navigation. (Links use double square brackets. `[[Example]]`)
* Malkovich runs in the browser as a single page web application.
* All data is stored locally, not in the cloud. This means Malkovich is _very_ responsive. There are no loading spinners when navigating. 
* Notes remain available when your internet connection fails. 

![Malkovich Screenshot](/readme/screenshot.png?raw=true)
*Malkovich with a page open for reading and editing side by side.*


## Motivation 

I'd been using a MediaWiki instance installed on a private server for several years to keep notes. However I wasn't fully comfortable with the setup. I'm not a linux system admin and I wasn't enjoying the overhead of maintaining a server on the public internet. 

Eventually I decided to create Malkovich as my needs are modest and it provided a opportunity to learn Go. 

## Under the Hood 

Malkovich consists of two main parts:

1. A backend HTTP server written in Go.
2. A GUI written in HTML and Javascript that is displayed in a browser. 

## Discontinued 

Development on this project has stopped. [Obsidian](https://obsidian.md) does everything this app does and looks a whole better.  

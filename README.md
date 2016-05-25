# About Malkovich

Malkovich is a personal wiki that runs on Windows. It's built to be self contained for simple installation.

The wiki pages are written in markdown with some syntax additions to support wiki functionality. All context is stored in markdown formatted text files. 

## Motivation 

I've been using a MediaWiki instance installed on a private server for several years. I find the wiki format to be great for storing small bits of information in a structured manner. However, MediaWiki is not ideal for a personal wiki. Installation is complicated and requires running PHP and MySQL. Backup is difficult as well. 

## Under the Hood 

Malkovich consists of two main parts.

1. A backend HTTP server written in Go.
2. A single page HTML & JS application that acts as a GUI. 

Originally Malkovich was presented as a standalone Windows Application. Electron was being used to wrap the HTML and JS into an executable however performance was slow. Now Malkovich runs as a server and the browser (Chrome, Firefox etc) is used to view the Malkovich wiki. 

## Other Notes

Malkovich is my first application built using HTML, JS and Go. As such the code and file organisation isn't ideal. The front end code in particular is something I would like to improve in future iterations. 

Where possible repetivitive development tasks have been automated with BAT and NodeJS scripts. The scripts were largely repurposed from other projects, hence being split between BAT and NodeJS. If this was more than a side project I would like to standardise on using one scripting language. 


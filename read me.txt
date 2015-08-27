# About Malkovich

Malkovich is a personal wiki that runs on your PC. It's built to be simple to use. It doesn't require installation of a server or a database. 

Notes are written using Markdown with some syntax additions to support wiki functionality. 

All note data is stored in markdown formatted text files. You can freely edit your notes with regular text editors. 

## Motivation 

I've been using a MediaWiki instance installed on a private server for several years. I find the wiki format to be great for storing small bits of information in a structured manner. However, MediaWiki is overly complicated for a personal wiki. Installation is complicated and requires running PHP and MySQL. Backup is difficult as well. By contrast Malkovich is installed using a single installer just like a typical PC application. 

## Development Summary

Malkovich consists of two main parts.

1. A backend HTTP server written in Go.
2. A single page HTML & JS application that acts as a GUI. The HTML & JS is wrapped into an executable using Electron. 

## Organisation of Project Files

Malkovich is my first application built using HTML, JS and Go. As such the code and file organisation isn't ideal. The front end code in particular is a bit messy. 

* The CSS is pretty haphazard. It's been built up incrementally. I'm not sure if it will be difficult to maintain in the long term. 
* The file organisation needs to be improved. The source files for custom Riot.js elements are in two locations. They probably need to be consolidated into one location.
* I need to standardise on build tools. Right now Koala is being used for SCSS compilation. It would be better to use node.js instead. 
* The project developement is automated with a collection of BAT file and node.js scripts. I will probably phase out the majority of the BAT files and use node.js instead. 


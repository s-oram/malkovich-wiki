var PublicDir = "./public";
var SourceDir = "./source";
var PreviewServerPort = 1313;



//====================================================
//     File watching...
//====================================================

var fw = require('./_dev_filewatcher.js');

var watcherA = fw.newFileWatcher(SourceDir);



//====================================================
//     Live reload server.
//====================================================

console.log('Preview Server running at http://localhost:%s', PreviewServerPort);

var liveReload = require('./dev_livereload.js');
liveReload.startServer(PublicDir);


//====================================================
//     Finally start, the preview server.
//====================================================
var static = require('node-static');

var file = new static.Server(PublicDir);

require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        //
        // Serve files!
        //
        file.serve(request, response);
    }).resume();
}).listen(PreviewServerPort);













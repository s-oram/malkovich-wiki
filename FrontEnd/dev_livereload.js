exports.startServer = function(PublicDir){
    var request = require('request');
    var fsmonitor = require('fsmonitor');
    var tinylr = require('tiny-lr');
    var path = require('path');
    var _ = require('lodash');

    function TriggerLiveReloadEvent(changeType, filePath){
        var WatchedFileTypes = [
            '.html',
            '.htm',
            '.js',
            '.css'
        ];

        // Check if changed file is in the watched file list.
        var FileExt = path.extname(filePath).toLowerCase();
        if (_.indexOf(WatchedFileTypes, FileExt) == -1) return;

        if (changeType == 'new') {
            //console.log('new: ' + filePath);
            var url = 'http://localhost:35729/changed?files=' + filePath;
        } else if (changeType == 'update') {
            //console.log('changed: ' + filePath);
            var url = 'http://localhost:35729/changed?files=' + filePath;
        } else if (changeType == 'remove') {
            //console.log('removed: ' + filePath);
            var url = 'http://localhost:35729/changed?files=' + filePath;
        } else {
            console.log('ERROR: changeType not handled.');
            return;
        }

        request(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log('LiveReload:' + changeType + ' ' + filePath);
            }
        });
    }

    fsmonitor.watch(PublicDir, null, function(change) {
        var files = change.addedFiles;
        for (index = 0; index < files.length; ++index) {
            var fn = String(files[index]);
            TriggerLiveReloadEvent('new', fn);
        }

        var files = change.modifiedFiles;
        for (index = 0; index < files.length; ++index) {
            var fn = String(files[index]);
            TriggerLiveReloadEvent('update', fn);
        }

        var files = change.removedFiles;
        for (index = 0; index < files.length; ++index) {
            var fn = String(files[index]);
            TriggerLiveReloadEvent('remove', fn);
        }
    });


    function StartLiveReloadServer(){
        // standard LiveReload port
        var port = 35729;

        // tinylr(opts) => new tinylr.Server(opts);
        tinylr().listen(port, function() {
            console.log('LiveReload server listening on %s', port);
        });
    }

    setTimeout(StartLiveReloadServer, 0);
};


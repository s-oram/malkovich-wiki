// http://stackoverflow.com/a/18188209/395461

function FileWatcher(){
    this.rootDir = '';
}

exports.newFileWatcher = function(rootDir){
    var watcher = new FileWatcher();
    watcher.rootDir = rootDir;
    return watcher;
};



// Minimatch for filename matching.
// https://www.npmjs.com/package/minimatch




console.log(document.currentScript);

// golib filepath replicates some useful functions from go's "path/filepath" unit.
// http://golang.org/pkg/path/filepath


//==== some utility functions ===
function escapeRegExp(string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

//=================================



if (golib == undefined) {
    var golib = new Object();
}

if (golib.filepath == undefined) {
    golib.filepath = new Object();

    golib.filepath.Clean = function(text){
        var rtext = text;
        var ctext = text;

        while (true) {
            // 1. Replace multiple Separator elements with a single one.
            rtext = replaceAll(rtext, "//", "/");

            // 2. Eliminate each . path name element (the current directory).
            rtext = replaceAll(rtext, "/./", "/");
            // TODO:HIGH need to clean paths that start or end with a . charactor.

            // 3. Eliminate each inner .. path name element (the parent directory)
            // along with the non-.. element that precedes it.
            // TODO:HIGH

            // 4. Eliminate .. elements that begin a rooted path:
            // that is, replace "/.." by "/" at the beginning of a path,
            // assuming Separator is '/'.
            // TODO:HIGH


            if (rtext != ctext) {
                ctext = rtext;
            } else {
                break;
            }
        }

        // TODO:HIGH The returned path ends in a slash only if it represents a root directory, such as "/" on Unix or `C:\` on Windows.

        // If the result of this process is an empty string, Clean returns the string ".".

        if (rtext == "") rtext = ".";
        return rtext;
    };


    golib.filepath.Dir = function(text){
        // Dir returns all but the last element of path, typically the path's
        // directory. After dropping the final element, the path is Cleaned
        // and trailing slashes are removed. If the path is empty, Dir
        // returns ".". If the path consists entirely of separators, Dir
        // returns a single separator. The returned path does not end in a
        // separator unless it is the root directory.

        var parts = text.split("/");
        var path = "";

        for (c1 = 0; c1 < parts.length-1; c1++){
            if (parts[c1] != "") {
                path = path + "/" + parts[c1];
            }
        }

        if (path == "") path = ".";

        path = golib.filepath.Clean(path);
        return path;
    };

    golib.filepath.Base = function(text){
        // Base returns the last element of path. Trailing path separators
        // are removed before extracting the last element. If the path is
        // empty, Base returns ".". If the path consists entirely of
        // separators, Base returns a single separator.

        text = golib.filepath.Clean(text);
        var parts = text.split("/");
        var base = "";

        if (parts.length > 0) {
            base = parts[parts.length-1];
        }
        return base;
    };
}





(function(){
    //var Text = "/./james//brown//was//dead";
    //Text = golib.filepath.Base(Text);
    //console.log(Text);

    // TODO:HIGH should write some test cases to test these functions.

    // TODO:HIGH should check out require.js or something else to
    // manage javascript file inclusions.
}());


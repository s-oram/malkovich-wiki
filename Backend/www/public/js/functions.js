"use strict";

// TODO:MED this unit is polluting the global namespace.

var vam = vam || {};

vam.functions = {};

vam.functions.assigned = function(x){
    if(typeof x === 'undefined') {
        return false;
    } else if (x === null) {
        return false;
    } else {
        return true;
    }
};

vam.functions.sameText = function(stringA, stringB){
    // return false if either string is unassigned.
    if ( vam.functions.assigned(stringA) == false) return false;
    if ( vam.functions.assigned(stringB) == false) return false;

    // NOTE: This function may not be appropiate if using Turkish language.
    var areEqual = stringA.toUpperCase() === stringB.toUpperCase();
    return areEqual;
};

vam.functions.isDragSourceExternalFile = function(dataTransfer){
        // Code posted as answer on StackOverflow.
        // http://stackoverflow.com/a/32044172/395461

        // Source detection for Safari v5.1.7 on Windows.
        if (typeof Clipboard != 'undefined') {
            if (dataTransfer.constructor == Clipboard) {
                if (dataTransfer.files.length > 0)
                    return true;
                else
                    return false;
            }
        }

        // Source detection for Firefox on Windows.
        if (typeof DOMStringList != 'undefined'){
            var DragDataType = dataTransfer.types;
            if (DragDataType.constructor == DOMStringList){
                if (DragDataType.contains('Files'))
                    return true;
                else
                    return false;
            }
        }

        // Source detection for Chrome on Windows.
        if (typeof Array != 'undefined'){
            var DragDataType = dataTransfer.types;
            if (DragDataType.constructor == Array){
                if (DragDataType.indexOf('Files') != -1)
                    return true;
                else
                    return false;
            }
        }
};

// Merge object accepts an array of objects. Later objects will
// overwrite values in earlier objects.
// http://stackoverflow.com/a/29375179/395461
var mergeObjects = function (objectsArray) {
    var o = arguments[0] || {};
    for (var i = arguments.length - 1; i >= 0; i --) {
        var s = arguments[i]
        for (var k in s) o[k] = s[k]
    }
    return o
};

function replaceAll(string, find, replace) {
    return string.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

function escapeRegExp(string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

// String.format()
// http://stackoverflow.com/a/4673436/395461
// http://jsfiddle.net/joquery/9KYaQ/
// JS Prototype
// http://javascriptissexy.com/javascript-prototype-in-plain-detailed-language/
// TODO:HIGH this is bad. Should extend low level prototypes.
if (!String.format) {
    String.format = function() {
        // The string containing the format items (e.g. "{0}")
        // will and always has to be the first argument.
        var theString = arguments[0];

        // start with the second argument (i = 1)
        for (var i = 1; i < arguments.length; i++) {
            // "gm" = RegEx options for Global search (more than one instance)
            // and for Multiline search
            var regEx = new RegExp("\\{" + (i - 1) + "\\}", "gm");
            theString = theString.replace(regEx, arguments[i]);
        }

        return theString;
    };
}





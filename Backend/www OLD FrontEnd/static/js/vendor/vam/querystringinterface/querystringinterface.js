console.log(document.currentScript);
"use strict";

// Mozilla: Javascript OOP.
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript


//==================================================================================
//    Helper functions
//==================================================================================

// UpdateQueryString()
// http://stackoverflow.com/a/11654596/395461
function UpdateQueryString(key, value, url) {
    if (!url) url = window.location.href;
    var re = new RegExp("([?&])" + key + "=.*?(&|#|$)(.*)", "gi"),
        hash;

    if (re.test(url)) {
        if (typeof value !== 'undefined' && value !== null)
            return url.replace(re, '$1' + key + "=" + value + '$2$3');
        else {
            hash = url.split('#');
            url = hash[0].replace(re, '$1$3').replace(/(&|\?)$/, '');
            if (typeof hash[1] !== 'undefined' && hash[1] !== null)
                url += '#' + hash[1];
            return url;
        }
    }
    else {
        if (typeof value !== 'undefined' && value !== null) {
            var separator = url.indexOf('?') !== -1 ? '&' : '?';
            hash = url.split('#');
            url = hash[0] + separator + key + '=' + value;
            if (typeof hash[1] !== 'undefined' && hash[1] !== null)
                url += '#' + hash[1];
            return url;
        }
        else
            return url;
    }
}


function GetUrlParameters(search_string) {
    // How to get the value from the URL parameter?
    // http://stackoverflow.com/a/21151913/395461
    //
    // Usage:
    //  var Params = GetUrlParameters(location.search)
    //  var X = Params['MyParameter']

    var parse = function(params, pairs) {
        var pair = pairs[0];
        var parts = pair.split('=');
        var key = decodeURIComponent(parts[0]);
        var value = decodeURIComponent(parts.slice(1).join('='));

        // Handle multiple parameters of the same name
        if (typeof params[key] === "undefined") {
            params[key] = value;
        } else {
            params[key] = [].concat(params[key], value);
        }

        return pairs.length == 1 ? params : parse(params, pairs.slice(1))
    }

    // Get rid of leading ?
    return search_string.length == 0 ? {} : parse({}, search_string.substr(1).split('&'));
}



//==================================================================================
//    TQueryStringInterface class
//==================================================================================

var TQueryStringInterface = function(){
    this._QueryStrParameters = GetUrlParameters(location.search)
}

TQueryStringInterface.fn = TQueryStringInterface.prototype = {
    getString: function(ParName) {
        var keyValue = this._QueryStrParameters[ParName];

        if (keyValue !== null) {
            keyValue = String(keyValue)
            keyValue = keyValue.replace("+", " ");
            return keyValue;
        } else  {
            return "";
        }
    },

    getBool: function(ParName) {
        var keyValue = this._QueryStrParameters[ParName];
        var KVLC = String(keyValue).toLowerCase();
        if (typeof keyValue === 'undefined' || keyValue === null || keyValue === false || KVLC === "false") {
            return false;
        } else if (keyValue === 0 || keyValue === "0") {
            return false;
        } else if (keyValue === "" ) {
            return false;
        } else if (keyValue === true || keyValue === "1" || KVLC === "true") {
            return true;
        } else {
            return false;
        }
    },

    set: function(ParName, ParValue) {
        this._QueryStrParameters[ParName] = ParValue;
    },

    updateUrl: function() {
        var url = window.location.href;
        var qsp = this._QueryStrParameters;

        for (var key in qsp){
            var keyValue = qsp[key];
            var KVLC = String(keyValue).toLowerCase();
            if (typeof keyValue === 'undefined' || keyValue === null || keyValue === false || KVLC === "false") {
                url = UpdateQueryString(key, null, url);
            } else if (keyValue === 0 || keyValue === "0") {
                url = UpdateQueryString(key, null, url);
            } else if (keyValue === "" ) {
                url = UpdateQueryString(key, null, url);
            } else if (keyValue === true || keyValue === "1" || KVLC === "true") {
                url = UpdateQueryString(key, 1, url);
            } else {
                keyValue = keyValue.replace(" ", "+");
                url = UpdateQueryString(key, keyValue, url);
            }
        }
        var SafeUrl = encodeURI(url);
        history.pushState(null, null, SafeUrl);
        // Update the internal values after history push state to ensure
        // the object is consistent with the browser after any key value transforms.
        this._QueryStrParameters = GetUrlParameters(location.search)
    }
}








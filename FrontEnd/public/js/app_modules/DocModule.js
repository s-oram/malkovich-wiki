"use strict";

// TODO:MED lots of the Ajax callbacks in this file should probably
// be changed from synchronous to asynchronous calls.
// I was using synchronous calls originally because it was
// much easier with the last application structure.

function TDocModule(AppConfig){
    this.AppConfig = AppConfig;
    // Important: Do last.
    Object.preventExtensions(this);
}

TDocModule.prototype.DocNameToUrlString = function(DocName){
    var s = replaceAll(DocName, ' ', '_');
    s = s.toLowerCase();
    return s;
};

TDocModule.prototype.DocNameFromUrlString = function(DocName){
    var s = replaceAll(DocName, '_', ' ');
    s = _.startCase(DocName);
    return s;
};

TDocModule.prototype.Ajax_GetDocAsHtml = function(docName){
    var AjaxResponse = {};

    function AjaxSuccess(data){
        AjaxResponse.responseData = data;
        //console.log(data);
    }

    function AjaxError(jqXHR, textStatus, errorThrown) {
        console.log("AjaxError " + textStatus + " " + errorThrown)
    }

    function AjaxComplete( jqXHR, textStatus ) {
        // Possible textStatus values are:
        // success/notmodified/nocontent/error/timeout/abort/parsererror
        // http://api.jquery.com/jquery.ajax/
        AjaxResponse.responseStatus = textStatus;
    }

    var DocNameUrl = (this.DocNameToUrlString(docName));
    var GetRequestSettings = {};
    GetRequestSettings.url = this.AppConfig.ApiUrl.Root + this.AppConfig.ApiUrl.Docs + String.format("/{0}", DocNameUrl) + '/html';
    GetRequestSettings.type = 'GET';
    GetRequestSettings.async = false;
    GetRequestSettings.cache = false;
    GetRequestSettings.success = AjaxSuccess;
    GetRequestSettings.error = AjaxError;
    GetRequestSettings.complete = AjaxComplete; // Complete is called after the Success and Error callbacks.
    $.ajax(GetRequestSettings);

    return AjaxResponse;
};


TDocModule.prototype.Ajax_GetDocAsMarkDown = function(docName){
    var AjaxResponse = {};

    function AjaxSuccess(data){
        AjaxResponse.responseData = data;
    }

    function AjaxError(jqXHR, textStatus, errorThrown) {
        console.log("AjaxError " + textStatus + " " + errorThrown)
    }

    function AjaxComplete( jqXHR, textStatus ) {
        // Possible textStatus values are:
        // success/notmodified/nocontent/error/timeout/abort/parsererror
        // http://api.jquery.com/jquery.ajax/
        AjaxResponse.responseStatus = textStatus;
    }

    var DocNameUrl = (this.DocNameToUrlString(docName));
    var GetRequestSettings = {};
    GetRequestSettings.url = this.AppConfig.ApiUrl.Root + this.AppConfig.ApiUrl.Docs + String.format("/{0}", DocNameUrl) + '/md';
    GetRequestSettings.type = 'GET';
    GetRequestSettings.async = false;
    GetRequestSettings.cache = false;
    GetRequestSettings.success = AjaxSuccess;
    GetRequestSettings.error = AjaxError;
    GetRequestSettings.complete = AjaxComplete; // Complete is called after the Success and Error callbacks.
    $.ajax(GetRequestSettings);

    return AjaxResponse;
};



TDocModule.prototype.Ajax_SaveDoc = function (docName, docData) {
    var FunctionResult = {};

    function AjaxSuccess(data){
        data = JSON.parse(data);
        FunctionResult.IsSuccess = data.IsSuccess;
        FunctionResult.ErrorType = data.ErrorType;
    }

    function AjaxError(jqXHR, textStatus, errorThrown) {
        console.log("AjaxError " + textStatus + " " + errorThrown)
        FunctionResult.IsSuccess = false;
        FunctionResult.ErrorType = "AjaxError";
    }

    var DocNameUrl = (this.DocNameToUrlString(docName));
    var GetRequestSettings = {};
    GetRequestSettings.url = this.AppConfig.ApiUrl.Root + this.AppConfig.ApiUrl.Docs + String.format("/{0}", DocNameUrl);
    GetRequestSettings.type = 'PUT';
    GetRequestSettings.async = false;
    GetRequestSettings.cache = false;
    GetRequestSettings.data = docData;
    GetRequestSettings.success = AjaxSuccess;
    GetRequestSettings.error = AjaxError;
    $.ajax(GetRequestSettings);

    return FunctionResult;
};

TDocModule.prototype.Ajax_DeleteDocument = function (docName) {
    var AjaxResponse = {};

    // TODO:HIGH: This should be made into an async function.

    function AjaxSuccess(data){
        //AjaxResponse.responseData = data;
        AjaxResponse.responseData = JSON.parse(data);
        console.log(data);
    }

    function AjaxError(jqXHR, textStatus, errorThrown) {
        console.log("AjaxError " + textStatus + " " + errorThrown)
    };

    function AjaxComplete( jqXHR, textStatus ) {
        // Possible textStatus values are:
        // success/notmodified/nocontent/error/timeout/abort/parsererror
        // http://api.jquery.com/jquery.ajax/
        AjaxResponse.responseStatus = textStatus;
    }

    var DocNameUrl = (this.DocNameToUrlString(docName));
    var GetRequestSettings = {};
    GetRequestSettings.url = this.AppConfig.ApiUrl.Root + this.AppConfig.ApiUrl.Docs + String.format("/{0}", DocNameUrl);
    GetRequestSettings.type = 'DELETE';
    GetRequestSettings.async = false;
    GetRequestSettings.cache = false;
    GetRequestSettings.success = AjaxSuccess;
    GetRequestSettings.error = AjaxError;
    GetRequestSettings.complete = AjaxComplete; // Complete is called after the Success and Error callbacks.
    $.ajax(GetRequestSettings);

    return AjaxResponse;
}

TDocModule.prototype.UploadFile = function(docName, file, finishedCallback) {
    // https://developer.mozilla.org/en/docs/Using_files_from_web_applications

    // Asynchronous file upload with javascript and jquery.
    // http://stackoverflow.com/a/8758614/395461

    var uri = this.AppConfig.ApiUrl.Root + this.AppConfig.ApiUrl.Files + "/uploadfile";
    var xhr = new XMLHttpRequest();
    var fd = new FormData();
    xhr.open("POST", uri, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            if (finishedCallback != null) finishedCallback(file);
        } else if (xhr.readyState == 4 && xhr.status != 200) {
            if (finishedCallback != null) finishedCallback(file);
        }
    };
    fd.append('DocName', docName);
    fd.append('myFile', file);
    // Initiate a multipart/form-data upload
    xhr.send(fd);
};

TDocModule.prototype.UploadFiles = function(DocID, files, UploadFinishedCallback){
    // NOTE: The UploadFinishedCallback will be called once for each file uploaded.
    var self = this;

    $.each(files, function(index, value){
        self.UploadFile(DocID, value, UploadFinishedCallback);
    });
};


TDocModule.prototype.Ajax_GetFileList = function(DocID){
    var FunctionResult = null;

    function AjaxSuccess(data){
        FunctionResult = data;
    }

    function AjaxError(jqXHR, textStatus, errorThrown) {
        console.log("AjaxError " + textStatus + " " + errorThrown)
    };

    var GetRequestSettings = {};
    GetRequestSettings.url = this.AppConfig.ApiUrl.Root + this.AppConfig.ApiUrl.Files + "/list/" + DocID;
    GetRequestSettings.type = 'GET';
    GetRequestSettings.async = false;
    GetRequestSettings.cache = false;
    GetRequestSettings.success = AjaxSuccess;
    GetRequestSettings.error = AjaxError;
    $.ajax(GetRequestSettings);

    return FunctionResult;
};

TDocModule.prototype.Ajax_DeleteFile = function(docName, fileName) {
    var FunctionResult = null;

    function AjaxSuccess(data){
        FunctionResult = data;
    }

    function AjaxError(jqXHR, textStatus, errorThrown) {
        console.log("AjaxError " + textStatus + " " + errorThrown)
    };

    var RequestUrl = this.AppConfig.ApiUrl.Root + this.AppConfig.ApiUrl.Files + sprintf("/%s/%s", docName, fileName);
    console.log(RequestUrl);

    var GetRequestSettings = new Object();
    GetRequestSettings.url = RequestUrl;
    GetRequestSettings.type = 'DELETE';
    GetRequestSettings.async = false;
    GetRequestSettings.cache = false;
    GetRequestSettings.success = AjaxSuccess;
    GetRequestSettings.error = AjaxError;
    $.ajax(GetRequestSettings);

    return FunctionResult;
};
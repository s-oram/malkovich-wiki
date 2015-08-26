//console.log(document.currentScript);


//=====================================================
//   Global variables and classes.
//=====================================================
var QueryString = new TQueryStringInterface();


//=====================================================
//   General helper functions
//=====================================================

function LoadMustacheTemplate(element, templatePath, callback) {
    $.get(templatePath, function(template){
        var html = Mustache.render(template);
        $(element).html(html);
        if (callback != null) callback();
    });
}

function RenderMustacheTemplate(element, templatePath, data, callback) {
    $.get(templatePath, function(template){
         if (typeof data !== 'undefined'  || data !== null) {
         // NOTE: Rendering with data is untested.
         var html = Mustache.render(template, data);
         } else {
         var html = Mustache.render(template);
         }
        $(element).html(html);
        if (callback != null) callback();
    });
}




//=====================================================
//   Helper functions for the "doc" pages.
//=====================================================

function Ajax_DeleteDocument(docName){
    var AjaxResponse = new Object();

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

    var DocNameUrl = (DocNameToUrlString(docName));
    var GetRequestSettings = new Object();
    GetRequestSettings.url = ApiUrl.Root + ApiUrl.Docs + String.format("/{0}", DocNameUrl);
    GetRequestSettings.type = 'DELETE';
    GetRequestSettings.async = false;
    GetRequestSettings.cache = false;
    GetRequestSettings.success = AjaxSuccess;
    GetRequestSettings.error = AjaxError;
    GetRequestSettings.complete = AjaxComplete; // Complete is called after the Success and Error callbacks.
    $.ajax(GetRequestSettings);

    return AjaxResponse;
}

function Ajax_GetFrontPageDocListing(){
    var AjaxResponse = new Object();

    function AjaxSuccess(data){
        AjaxResponse.responseData = data;
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

    var GetRequestSettings = new Object();
    GetRequestSettings.url = ApiUrl.Root + ApiUrl.FrontPage;
    GetRequestSettings.type = 'GET';
    GetRequestSettings.async = false;
    GetRequestSettings.cache = false;
    //GetRequestSettings.dataType = 'html';
    //GetRequestSettings.data = RequestData;
    //GetRequestSettings.beforeSend = PrepareAjaxRequestForOSC;
    GetRequestSettings.success = AjaxSuccess;
    GetRequestSettings.error = AjaxError;
    GetRequestSettings.complete = AjaxComplete; // Complete is called after the Success and Error callbacks.
    $.ajax(GetRequestSettings);

    return AjaxResponse;
}

function Ajax_GetDocListing(){
    var AjaxResponse = new Object();

    function AjaxSuccess(data){
        AjaxResponse.responseData = data;
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

    var GetRequestSettings = new Object();
    GetRequestSettings.url = ApiUrl.Root + ApiUrl.Docs;
    GetRequestSettings.type = 'GET';
    GetRequestSettings.async = false;
    GetRequestSettings.cache = false;
    //GetRequestSettings.dataType = 'html';
    //GetRequestSettings.data = RequestData;
    //GetRequestSettings.beforeSend = PrepareAjaxRequestForOSC;
    GetRequestSettings.success = AjaxSuccess;
    GetRequestSettings.error = AjaxError;
    GetRequestSettings.complete = AjaxComplete; // Complete is called after the Success and Error callbacks.
    $.ajax(GetRequestSettings);

    return AjaxResponse;
}

function Ajax_GetDocAsHtml(docName){
    var AjaxResponse = new Object();

    function AjaxSuccess(data){
        AjaxResponse.responseData = data;
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

    var DocNameUrl = (DocNameToUrlString(docName));
    var GetRequestSettings = new Object();
    GetRequestSettings.url = ApiUrl.Root + ApiUrl.Docs + String.format("/{0}", DocNameUrl) + '/html';
    GetRequestSettings.type = 'GET';
    GetRequestSettings.async = false;
    GetRequestSettings.cache = false;
    //GetRequestSettings.dataType = 'html';
    //GetRequestSettings.data = RequestData;
    //GetRequestSettings.beforeSend = PrepareAjaxRequestForOSC;
    GetRequestSettings.success = AjaxSuccess;
    GetRequestSettings.error = AjaxError;
    GetRequestSettings.complete = AjaxComplete; // Complete is called after the Success and Error callbacks.
    $.ajax(GetRequestSettings);

    return AjaxResponse;
}

function Ajax_GetDocAsMarkDown(docName){
    var AjaxResponse = new Object();

    function AjaxSuccess(data){
        AjaxResponse.responseData = data;
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

    var DocNameUrl = (DocNameToUrlString(docName));
    var GetRequestSettings = new Object();
    GetRequestSettings.url = ApiUrl.Root + ApiUrl.Docs + String.format("/{0}", DocNameUrl) + '/md';
    GetRequestSettings.type = 'GET';
    GetRequestSettings.async = false;
    GetRequestSettings.cache = false;
    //GetRequestSettings.dataType = 'html';
    //GetRequestSettings.data = RequestData;
    //GetRequestSettings.beforeSend = PrepareAjaxRequestForOSC;
    GetRequestSettings.success = AjaxSuccess;
    GetRequestSettings.error = AjaxError;
    GetRequestSettings.complete = AjaxComplete; // Complete is called after the Success and Error callbacks.
    $.ajax(GetRequestSettings);

    return AjaxResponse;
}

function Ajax_SaveDoc(docName, docData) {
    var FunctionResult = new Object();

    function AjaxSuccess(data){
        data = JSON.parse(data);
        FunctionResult.IsSuccess = data.IsSuccess;
        FunctionResult.ErrorType = data.ErrorType;
        console.log(data);
    }

    function AjaxError(jqXHR, textStatus, errorThrown) {
        console.log("AjaxError " + textStatus + " " + errorThrown)
        FunctionResult.IsSuccess = false;
        FunctionResult.ErrorType = "AjaxError";
    };

    var DocNameUrl = (DocNameToUrlString(docName));
    var GetRequestSettings = new Object();
    GetRequestSettings.url = ApiUrl.Root + ApiUrl.Docs + String.format("/{0}", DocNameUrl);
    GetRequestSettings.type = 'PUT';
    GetRequestSettings.async = false;
    GetRequestSettings.cache = false;
    GetRequestSettings.data = docData;
    //GetRequestSettings.dataType = 'html';
    //GetRequestSettings.beforeSend = PrepareAjaxRequestForOSC;
    GetRequestSettings.success = AjaxSuccess;
    GetRequestSettings.error = AjaxError;
    $.ajax(GetRequestSettings);

    return FunctionResult;
}

function Ajax_CreateNewFrontPageDoc(docName){
    var AjaxResponse = new Object();

    function AjaxSuccess(data){
        // TODO:HIGH, instead of checking for null, empty strings and who knows
        // what other errors, I should be catching errors. Same will apply to all the other ajax methods.
        if (data != null && data != "") {
            AjaxResponse.responseData = JSON.parse(data);
        }
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

    var DocNameUrl = (DocNameToUrlString(docName));
    var GetRequestSettings = new Object();
    GetRequestSettings.url = ApiUrl.Root + ApiUrl.FrontPage + String.format("/{0}", DocNameUrl);
    GetRequestSettings.type = 'PUT';
    GetRequestSettings.async = false;
    GetRequestSettings.cache = false;
    GetRequestSettings.success = AjaxSuccess;
    GetRequestSettings.error = AjaxError;
    GetRequestSettings.complete = AjaxComplete; // Complete is called after the Success and Error callbacks.
    $.ajax(GetRequestSettings);

    return AjaxResponse;
};

function DocNameToUrlString(DocName){
    return replaceAll(DocName, ' ', '_');
};

function DocNameFromUrlString(DocName){
    return replaceAll(DocName, '_', ' ');
};


function ProcessDocumentContent(docElement){
    // NOTE: Add download attribute so file will be downloaded instead
    // of being opened in the browser.
    $(docElement).find('a.MicroNoteApi-FileDownloadLink').attr('download', '');
}


function PreparePageForDocReading(docName) {
    $("div#DocContent").hide();

    var AjaxResponse = Ajax_GetDocAsHtml(docName);
    if (AjaxResponse.responseStatus === 'success') {
        var html = AjaxResponse.responseData;
        // TODO:MED need a function to check if a document contains
        // anything other than white space.
        if (html === "") {
            $("div#DocContent").html('This page is empty. <a href="/" class="EditPageLink">Add something now!</a>');
        } else {
            $("div#DocContent").html(html);
            ProcessDocumentContent($("div#DocContent")[0]);
        }

    } else if (AjaxResponse.responseStatus === 'nocontent') {
        $("div#DocContent").html('There is no page with this exact name. <a href="/" class="EditPageLink">Create it now!</a>');
        // TODO:HIGH should hide the "Edit" page button.
    } else {
        $("div#DocContent").html(sprintf('Something went wrong. (Status: "%s")', AjaxResponse.responseStatus));
    }


    $("div#DocContent").show();
}

function PreparePageForDocEditing(docName){
    var AjaxResponse = Ajax_GetDocAsMarkDown(docName);
    if (AjaxResponse.responseStatus === 'success') {
        var markdown = AjaxResponse.responseData;
        $("textarea#DocTextEdit").html(markdown);
    }
}

function UpdatePageTitle(docName){
    $('div#MenuBar-PageTitle').html('#' + DocNameFromUrlString(docName));
}



function ChangeLocationToViewPage(DocName){
    var DocNameUrl = DocNameToUrlString(DocName);
    var url = '/doc/view/?name=' + DocNameUrl;
    ChangeLocation(url);
}

function ChangeLocationToEditPage(DocName){
    var DocNameUrl = DocNameToUrlString(DocName);
    var url = '/doc/edit/?name=' + DocNameUrl;
    ChangeLocation(url);
}




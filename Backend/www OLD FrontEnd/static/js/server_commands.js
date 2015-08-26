//console.log(document.currentScript);

function ServerCommand_OpenFile(FilePath){
    console.log(FilePath);


    var AjaxResponse = new Object();

    function AjaxSuccess(data){
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

    var GetRequestSettings = new Object();
    GetRequestSettings.url = ApiUrl.Root + ApiUrl.Commands + FilePath;
    GetRequestSettings.type = 'POST';
    GetRequestSettings.async = false;
    GetRequestSettings.cache = false;
    GetRequestSettings.success = AjaxSuccess;
    GetRequestSettings.error = AjaxError;
    GetRequestSettings.complete = AjaxComplete; // Complete is called after the Success and Error callbacks.
    $.ajax(GetRequestSettings);

    return AjaxResponse;
}

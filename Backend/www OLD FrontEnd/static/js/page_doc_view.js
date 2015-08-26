//console.log(document.currentScript);


//=================================================================
//           Event Handling
//=================================================================

$("div#EditDocButton").click(function(e){
    e.preventDefault();
    var docName = QueryString.getString("name");
    if (docName != null) {
        var url = "/doc/edit/?name=" + docName;
        ChangeLocation(url);
    }
});

$('div#FullPageContainer').delegate(".EditPageLink", "click", function(e){
    e.preventDefault();
    var docName = QueryString.getString("name");
    if (docName != null) {
        var url = "/doc/edit/?name=" + docName;
        ChangeLocation(url);
    }
});

$('div#FullPageContainer').delegate("#DeleteDocButton", "click", function(e){
    e.preventDefault();
    var docName = QueryString.getString("name");
    //if (docName != null) {
    //}

    var ConfirmDeleteDialog = new TMessageDialog();

    function DeleteHandler(){
        ConfirmDeleteDialog.hide();
        var AjaxResponse = Ajax_DeleteDocument(docName);
        console.log(AjaxResponse);
        if (AjaxResponse.responseStatus == 'success'){
            if (AjaxResponse.responseData.IsSuccess == true){
                PopupDialogs.ShowMessage("", "Page has been deleted.", function(){
                    var url = "/doc";
                    ChangeLocation(url);
                });
            } else {
                PopupDialogs.ShowMessage("ERROR", AjaxResponse.responseData.ErrorMsg);
            }
        } else {
            // TODO:MED instead of this error handling here, I could some custom error
            // handling that would apply to all ajax queries (where approppiate).
            PopupDialogs.ShowMessage("ERROR", "Something unexpected went wrong. Please try again later.");
        }
    }

    var Buttons = [{
        caption : 'Delete',
        type : 'Delete',
        click: DeleteHandler
    }, {
        caption : 'Cancel',
        type : 'Cancel',
        action: 'cancel'
    }];

    ConfirmDeleteDialog.show("", 'Really delete this page?', Buttons);
});

$('div#FullPageContainer').delegate("a.MicroNoteApi-FileDownloadLink", "click", function(e){
    e.preventDefault();
    //console.log();
    var FilePath = $(e.target).attr('href');
    ServerCommand_OpenFile(FilePath);
});

$(document).bind('keypress', 'ctrl+e', function(e){
    e.preventDefault();
    e.stopPropagation();

    var docName = QueryString.getString("name");
    if (docName != null) {
        var url = "/doc/edit/?name=" + docName;
        ChangeLocation(url);
    }
    return false;
});


//=================================================================
//           document ready handler
//=================================================================

$(document).ready(function() {
    var DocName = QueryString.getString("name");
    PreparePageForDocReading(DocName);
    UpdatePageTitle(DocName);
});


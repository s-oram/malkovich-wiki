console.log(document.currentScript);

$('div#FullPageContainer').delegate("#FrontPage_NewDocButton", "click", function(e){
    var msgTitle = '';
    var msgHtml = 'New Note Name';
    var inputText = '';
    function InputCallback(tag, text){
        if ((tag === "ok") && (text === "")){
            // TODO:HIGH display error message here.
        }
        if ((tag === "ok") && (text != "")){
            // TODO:HIGH need to check if
            // the string is a valid document name. If so,
            // try to create the new document.
            var DocName = text;
            var AjaxResponse = Ajax_CreateNewFrontPageDoc(DocName);
            if (AjaxResponse.responseStatus != 'success') {
                // TODO:HIGH show error message here.
                console.log(AjaxResponse.responseData);
            } else {
                if (AjaxResponse.responseData.IsSuccess === true) {
                    // show non-closeable message box to say the page is
                    // redirecting...
                    ChangeLocationToEditPage(DocName)
                } else {
                    // TODO:HIGH show error message here.
                    console.log(AjaxResponse.responseData);
                }
            }
        }
    }
    function ShowInputDialog(){
        PopupDialogs.Input(msgTitle, msgHtml, inputText, InputCallback)
    }
    ShowInputDialog();
});



//=================================================================
//           document ready handler
//=================================================================

$(document).ready(function() {
    var AjaxResponse = Ajax_GetFrontPageDocListing();

    function ApplyGrid(){
        //console.log("update layout");
        $("div.PageGrid").masonry({
            itemSelector: '.PageGridItem'
        });
    }

    if (AjaxResponse.responseStatus === "success"){
        var Container = $('div#DocPage')[0];
        var Data = JSON.parse(AjaxResponse.responseData);
        console.log(Data);
        RenderMustacheTemplate(Container, '/templates/view_page_listing.html', Data, ApplyGrid);
    }

    $("div.PageListing").delegate("div.PageGridItem", "click", function(e){
        var href = $(e.currentTarget).attr("data-href");
        ChangeLocation(href);
    });

    $("div.PageGrid").masonry();
});


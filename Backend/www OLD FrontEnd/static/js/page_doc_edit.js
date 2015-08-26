console.log(document.currentScript);

function CancelEditing(){
    var docName = QueryString.getString("name");
    if (docName != null) {
        var url = "/doc/view/?name=" + docName;
        ChangeLocation(url);
    }
}

function ReturnToDocumentView(){
    var docName = QueryString.getString("name");
    if (docName != null) {
        var url = "/doc/view/?name=" + docName;
        ChangeLocation(url);
    }
}


//=================================================================
//           Event Handling
//=================================================================

$("form input[type='submit']").click(function(e){
    e.preventDefault();
    var buttonName = $(this).attr("name");
    if (buttonName == "save") {
        $(this).closest("form").submit();
    } else if (buttonName == "cancel") {
        CancelEditing();
    } else {
        console.log("error: unknown button clicked.")
    }
});

$("form#DocEditForm").AjaxForm_OnSubmit(function(form){
    var docName = QueryString.getString("name");
    if (docName != null) {
        var formData = $(form).serializeJSON();
        SaveResult = Ajax_SaveDoc(docName, formData);
        console.log(SaveResult);
        if (SaveResult.IsSuccess) {
            ReturnToDocumentView();
        }
    }
});

$("textarea").bind('keydown', 'ctrl+return', function(){
    $(this).closest("form").submit();
});

$("textarea").bind('keydown', 'esc', function(){
    //TODO:HIGH Really should check for the page current state,
    // ie. is editing, is reading? and prevent actions,
    // that don't fit the current state.
    CancelEditing();
});

$(document).bind('keydown', 'esc', function(){
    //TODO:HIGH Really should check for the page current state,
    // ie. is editing, is reading? and prevent actions,
    // that don't fit the current state.
    CancelEditing();
});

$(document).bind('keypress', 'ctrl+e', function(e){
    e.preventDefault();
    e.stopPropagation();
    return false;
});

//=================================================================
//           document ready handler
//=================================================================

$(document).ready(function() {
    var DocName = QueryString.getString("name");
    PreparePageForDocEditing(DocName);
    $(document).focus();
    $("textarea").eq(0).focus();
});

//=================================================================
//           File Browser stuff.
//=================================================================

function NewNodeCallback(index, element){
    // Add drag and drop support in the text area.
    // http://stackoverflow.com/a/19223442/395461

    var IsFileNode = $(this).hasClass("filebrowser-node-file");

    if (IsFileNode) {
        $(this).on("dragstart", function(event){
            var link = $(event.target).attr("data-wikilink");
            if (link != null) {
                event.originalEvent.dataTransfer.setData("Text", link);
            };
        });

        $(this).on("dblclick", function(event){
            var link = $(event.target).attr("data-wikilink");
            if (link != null) {
                $TextArea = $("textarea#DocTextEdit");
                $TextArea.insertAtCaret(link);
            };
        });
    }

    if (IsFileNode === false) {
        // Dis-allow drag events.
        $(this).on("dragstart", function(event){
            return false;
        });
    }
}


var FBContainer = $('#DocEditFileBrowserContainer div.component-filebrowser')[0];
var fb = new TFileBrowser(FBContainer, {
    NewNodeCallback: NewNodeCallback,
    ScriptPath: '/widgets/filebrowser'
});




//=================================================================
//           AJAX file upload.
//=================================================================

function sendFile(docName, file, finishedCallback) {
    // https://developer.mozilla.org/en/docs/Using_files_from_web_applications

    // Asynchronous file upload with javascript and jquery.
    // http://stackoverflow.com/a/8758614/395461

    var uri = ApiUrl.Root + ApiUrl.Files + "/uploadfile";
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
}

function AddUploadPlaceHolder(file){
    div = $("#DocEditFileBrowserContainer div.UploadPlaceHolders")[0];
    var data = new Object();
    data.filename = file.name;
    var template = '<div class="x1a" data-name="{{filename}}">{{filename}}</div>';
    var html = Mustache.render(template, data);

    text = $(div).html();
    text = text + html;
    $(div).html(text);
}

function RemoveUploadPlaceHolder(file){
    // TODO:HIGH We are removing the place holder here, but we
    // should first check if it uploaded successfully. If
    // there was an error, it needs to be dealt with.
    div = $("#DocEditFileBrowserContainer div.UploadPlaceHolders");
    var target = sprintf('div[data-name="%s"]', file.name);
    div.find(target).remove();
}

function sendFiles(files) {
    var DocName = QueryString.getString("name");

    $.each(files, function(index, value){
        AddUploadPlaceHolder(value);
    });

    function UploadFinished(file){
        console.log("Finished");
        console.log(file);
        RemoveUploadPlaceHolder(file);
        fb.RefreshFileList();
    }
    $.each(files, function(index, value){
        sendFile(DocName, value, UploadFinished);
    });
}



//=================================================================
//           document ready handler
//=================================================================
function PreparePageElements() {
    var UploadURL = ApiUrl.Root + ApiUrl.Files + "/uploadfile";
    var options = {iframe: {url: UploadURL}, input:false}
    var dropzone = new FileDrop('dropzone1', options);

    $("div#dropzone1").click(function(){
        $(".component-uploadfile-fileinput").trigger("click");
    });

    $(".component-uploadfile-fileinput").change(function(){
        var files = $(".component-uploadfile-fileinput").prop("files");
        var NativeFiles = [];
        $.each(files, function(index, value){
            NativeFiles.push(value);
        });
        sendFiles(NativeFiles);
    });

    dropzone.event('send', function (files) {
        var NativeFiles = [];
        $.each(files, function(index, value){
            NativeFiles.push(value.nativeFile);
        });
        sendFiles(NativeFiles);
    })
};

$(document).ready(function() {
    var DocName = QueryString.getString("name");
    if (DocName != null) {
        fb.Generate(DocName)
    }
    PreparePageElements();
    UpdatePageTitle(DocName);
});
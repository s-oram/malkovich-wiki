console.log(document.currentScript);
"use strict";



// Mozilla: Javascript OOP.
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript



var TFileBrowser = function(containerElement, options){
    this.ClassName = "TFileBrowser";
    this.Options = new Object;
    this.Options.NewNodeCallback = null;
    this.Options.ScriptPath = '/widgets/filebrowser';
    $.extend(this.Options, options);

    this._BrowserRoot = "/";
    this.containerElement = containerElement;
    this._DocName = "";

    var _this = this;
    $(containerElement).delegate("div.filebrowser-node a", "click", function(e){
        _this.OnFileNodeClick(e);
    });

    $(containerElement).delegate("input.action-tag", "change", this.EventHandle_NodeTagChanged.bind(this));
    $(containerElement).delegate("input.action-tagall", "change", this.EventHandle_NodeTagAllChanged.bind(this));
    $(containerElement).delegate(".action-button", "click", this.EventHandle_ActionButtonClicked.bind(this));
};

TFileBrowser.prototype.Ajax_GetFileList = function(docName){
    var FunctionResult = null;

    function AjaxSuccess(data){
        FunctionResult = data;
    }

    function AjaxError(jqXHR, textStatus, errorThrown) {
        console.log("AjaxError " + textStatus + " " + errorThrown)
    };

    var GetRequestSettings = new Object();
    GetRequestSettings.url = ApiUrl.Root + ApiUrl.Files + "/list/" + docName;
    GetRequestSettings.type = 'GET';
    GetRequestSettings.async = false;
    GetRequestSettings.cache = false;
    GetRequestSettings.success = AjaxSuccess;
    GetRequestSettings.error = AjaxError;
    $.ajax(GetRequestSettings);

    return FunctionResult;
}

TFileBrowser.prototype.Ajax_DeleteFile = function(docName, fileName){
    var FunctionResult = null;

    function AjaxSuccess(data){
        FunctionResult = data;
    }

    function AjaxError(jqXHR, textStatus, errorThrown) {
        console.log("AjaxError " + textStatus + " " + errorThrown)
    };

    var RequestUrl = ApiUrl.Root + ApiUrl.Files + sprintf("/%s/%s", docName, fileName);
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
}

TFileBrowser.prototype.RefreshFileList = function(){
    var _this = this;
    if (this.containerElement != null) {
        var fileBrowserContainer = $(this.containerElement);
        var fileBrowser = fileBrowserContainer.find("div.filebrowser");
        fileBrowser.empty();
        this.Generate(this._DocName);
    }
}

TFileBrowser.prototype.SetBrowserRoot = function(root){
    this._BrowserRoot = root;
    var container = this.containerElement;
    var qs = sprintf('div[data-root="%s"]', root);
    $(container).find("div.filebrowser-node-dir").hide();
    $(container).find("div.filebrowser-node-file").hide();
    var parentRoot = golib.filepath.Dir(root);
    if (parentRoot == ".") parentRoot = "/";
    $(container).find("div.filebrowser-node-parentdir").attr("data-root", parentRoot);
    $(container).find(qs).show();
    if (root == "/") {
        $(container).find("div.filebrowser-node-parentdir").hide();
    } else {
        $(container).find("div.filebrowser-node-parentdir").show();
    }
}

TFileBrowser.prototype.OnFileNodeClick = function(e){
    e.preventDefault();
    console.log("file node click");
    var TargetElement = e.target;
    var fileNode = $(TargetElement).parent();
    if (fileNode.attr("data-type") == "dir") {
        var root = fileNode.attr("data-root") + "/" + fileNode.attr("data-name");
        root = golib.filepath.Clean(root);
        this.SetBrowserRoot(root);
    } else if (fileNode.attr("data-type") == "parentdir") {
        console.log("parent dir.");
        var root = fileNode.attr("data-root");
        this.SetBrowserRoot(root);
    }
}

TFileBrowser.prototype.Generate = function(docName, callback){
    var _this = this;
    _this._DocName = docName;

    var container = _this.containerElement;

    $.get(_this.Options.ScriptPath + "/templates/fileBrowser.html", function(template){
        var dataJSON = _this.Ajax_GetFileList(docName);
        var fileList = JSON.parse(dataJSON);
        var html = Mustache.render(template, fileList);
        var fileBrowserContainer = $(container);
        fileBrowserContainer.html(html);
        var fileBrowser = fileBrowserContainer.find("div.filebrowser");

        fileBrowser.find('div[data-type="dir"]').addClass("filebrowser-node-dir");
        fileBrowser.find('div[data-type="file"]').addClass("filebrowser-node-file");

        if (_this.Options.NewNodeCallback != null) {
            fileBrowser.find(".filebrowser-node-dir").each(_this.Options.NewNodeCallback);
            fileBrowser.find(".filebrowser-node-file").each(_this.Options.NewNodeCallback);
        }

        _this.SetBrowserRoot(_this._BrowserRoot);
        _this.UpdateActionElements();

        if (callback != null) {callback()};
    });
}

TFileBrowser.prototype.EventHandle_NodeTagAllChanged = function(e){
    console.assert(this.ClassName === "TFileBrowser");
    var target = $(e.target);
    var TagState = target.is(':checked');
    $('input.action-tag').prop('checked', TagState);
    this.UpdateActionElements();
}

TFileBrowser.prototype.EventHandle_NodeTagChanged = function(e){
    console.assert(this.ClassName === "TFileBrowser");
    this.UpdateActionElements();
}

TFileBrowser.prototype.UpdateActionElements = function(){
    console.assert(this.ClassName === "TFileBrowser");

    var AreAnyTagsChecked = false;
    $('input.action-tag').each(function(index, value){
        if ($(value).is(':checked')) AreAnyTagsChecked = true;
    });

    if (AreAnyTagsChecked) {
        $(this.containerElement).find('.action-button').removeClass('disabled');
    } else {
        $(this.containerElement).find('.action-button').addClass('disabled');
    };
}

TFileBrowser.prototype.EventHandle_ActionButtonClicked = function(e){
    console.assert(this.ClassName === "TFileBrowser");
    var _this = this;

    var DeleteAction = function(index, value){
        if ($(value).is(':checked')) {
            var fn = $(value).parent().attr("data-name");
            //console.log(fn);
            _this.Ajax_DeleteFile(_this._DocName, fn);
            _this.RefreshFileList();
        };
    };

    var action = $(e.target).attr('data-action');
    if (action === "delete") {
        $(this.containerElement)
            .find('input.action-tag:checkbox')
            .each(DeleteAction);
    }



}



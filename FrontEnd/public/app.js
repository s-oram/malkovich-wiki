"use strict";

(function () {
    // Prevent drag and drop files being loaded by the browser by default.
    // http://stackoverflow.com/a/6756680/395461
    $(document).on('dragover', function(e){
        // add the dataTransfer property for use with the native `drop` event
        // to capture information about files dropped into the browser window
        // https://api.jquery.com/category/events/event-object/
        var IsFile = vam.functions.isDragSourceExternalFile(e.originalEvent.dataTransfer);
        if (IsFile) {
            e.preventDefault();
        }
    });
    $(document).on('drop', function(e){
        var IsFile = vam.functions.isDragSourceExternalFile(e.originalEvent.dataTransfer);
        if (IsFile) {
            e.preventDefault();
        }
    });

    //===== Dispatcher ========
    function TDispatcher(){
        this.TagReadyState = [];
        this.ActionStack = [];
        this.ActionTimeoutID = null;
    }
    TDispatcher.prototype.trigger = function(action){};
    var Dispatcher = new TDispatcher();

    //===== RiotControl ========
    var RiotControl = new function(){
        riot.observable(this);
    };

    var App = {};

    var AppConfig = new TAppConfig();

    App.Modules = {};
    App.Modules.Doc = new TDocModule(AppConfig);

    App.Controllers = {};
    App.Controllers.DialogController = new TDialogController(AppConfig, Dispatcher, RiotControl, App.Modules);

    App.Stores = {};
    App.Stores.Page = new TPageDataStore(AppConfig, Dispatcher, RiotControl, App.Modules);
    App.Stores.PageFiles = new TPageFilesDataStore(AppConfig, Dispatcher, RiotControl, App.Modules);

    Dispatcher.checkIfTagsAreReady = function(){
        if (this.TagReadyState['DocView'] != true) return false;
        if (this.TagReadyState['MenuBar'] != true) return false;
        if (this.TagReadyState['DocEdit'] != true) return false;
        if (this.TagReadyState['DocEdit_SideBar'] != true) return false;
        if (this.TagReadyState['DocEdit_FileBrowser'] != true) return false;
        if (this.TagReadyState['RiotDialog:Message'] != true) return false;
        if (this.TagReadyState['PageSettingsMenu'] != true) return false;
        return true;
    };

    Dispatcher.trigger = function(action){
        var self = this;

        var ActionObj = {
            ID : action,
            Args : arguments
        };
        this.ActionStack.push(ActionObj);

        window.clearTimeout(this.ActionTimeoutID);
        this.ActionTimeoutID = window.setTimeout(function(){
            self.ProcessActionStack();
        }, 10);
    };

    Dispatcher.ProcessActionStack = function(){
        while (this.ActionStack.length > 0) {
            var ActionObj = this.ActionStack[0];
            this.ActionStack.splice(0,1);
            this.DoAction.apply(this, ActionObj.Args);
        }
    };

    Dispatcher.DoAction = function(action){
        //console.log('do action');
        //console.log(action);
        //console.log(arguments);
        if (action == 'TagReady'){
            var id = arguments[1];
            //console.log(id);
            this.TagReadyState[id] = true;
            if (this.checkIfTagsAreReady() == true) {
                riot.route.start();
                this.trigger('Cmd:RouteTo', 'doc', 'index', 'view');
                //this.trigger('Cmd:RouteTo', 'doc', 'best_pizza_recipe', 'edit');
                //this.trigger('Cmd:ShowPageSettingsMenu', 500, 60);
                //this.trigger('Cmd:DeletePageWithConfirm', 'pizza_recipe');
            }
        }

        if (action == 'ShowDocView'){
            var PageID = arguments[1];
            PageID = App.Modules.Doc.DocNameToUrlString(PageID);
            RiotControl.trigger('DocEdit:Hide');
            App.Stores.Page.ChangePage(PageID);
            App.Stores.PageFiles.ChangePage(PageID);
            RiotControl.trigger('DocView:Show');
        }

        if (action == 'ShowDocEdit'){
            var PageID = arguments[1];
            PageID = App.Modules.Doc.DocNameToUrlString(PageID);
            RiotControl.trigger('DocView:Hide');
            App.Stores.Page.ChangePage(PageID);
            App.Stores.PageFiles.ChangePage(PageID);
            RiotControl.trigger('DocEdit:Show');
        }

        if (action == 'Cmd:RouteTo'){
            var collection   = arguments[1];
            var id = arguments[2];
            var action = arguments[3];
            var url = collection + '/' + id + '/' + action;
            riot.route(url);
        }

        if (action == 'Cmd:UpdateDoc:Content') {
            var PageID = arguments[1];
            var FormData = arguments[2];
            PageID = App.Modules.Doc.DocNameToUrlString(PageID);

            var SaveResult = App.Modules.Doc.Ajax_SaveDoc(PageID, FormData)
            if (SaveResult.IsSuccess) {
                this.trigger('Cmd:RouteTo', 'doc', PageID, 'view');
            } else {
                //TODO:HIGH show error message.
                console.log(SaveResult);
            }
        }

        if (action == 'Cmd:UpdateDoc:UploadFiles'){
            var PageID = arguments[1];
            var NativeFiles = arguments[2];
            PageID = App.Modules.Doc.DocNameToUrlString(PageID);
            App.Stores.PageFiles.UploadFiles(PageID, NativeFiles);
        }

        if (action == 'Cmd:DeleteFileWithConfirm') {
            var PageID = arguments[1];
            var FileName = arguments[2];
            PageID = App.Modules.Doc.DocNameToUrlString(PageID);
            App.Controllers.DialogController.ShowFileDeleteConfirmMessage(PageID, FileName);
        }

        if (action == 'Cmd:DeleteFile') {
            var PageID = arguments[1];
            var FileName = arguments[2];
            PageID = App.Modules.Doc.DocNameToUrlString(PageID);
            App.Stores.PageFiles.DeleteFile(PageID, FileName);
        }

        if (action == 'Cmd:DeletePageWithConfirm'){
            var PageID = arguments[1];
            PageID = App.Modules.Doc.DocNameToUrlString(PageID);
            App.Controllers.DialogController.ShowPageDeleteConfirmMessage(PageID);
        }

        if (action == 'Cmd:DeletePage'){
            var PageID = arguments[1];
            PageID = App.Modules.Doc.DocNameToUrlString(PageID);
            App.Modules.Doc.Ajax_DeleteDocument(PageID);
            this.trigger('Cmd:RouteTo', 'doc', 'index', 'view');
        }

        if (action == 'Cmd:ShowPageSettingsMenu') {
            var x = arguments[1];
            var y = arguments[2];
            RiotControl.trigger('Cmd:ShowPageSettingsMenu', x, y);
        }

        if (action == 'Cmd:HidePageSettingsMenu') {
            RiotControl.trigger('Cmd:HidePageSettingsMenu');
        }
    };

    riot.route(function(collection, id, action){
        if (collection == 'doc' && action == 'view') Dispatcher.trigger('ShowDocView', id);
        if (collection == 'doc' && action == 'edit') Dispatcher.trigger('ShowDocEdit', id);
    });

    var TagOptions;
    TagOptions = {
        AppConfig: AppConfig,
        Dispatcher: Dispatcher,
        RiotControl: RiotControl,
        DataStores: {
            PageData: App.Stores.Page.Data,
            PageFiles: App.Stores.PageFiles.Data
        }
    };
    Object.freeze(TagOptions);

    riot.mount('*', TagOptions);

}());
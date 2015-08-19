"use strict";

function TPageFilesDataStore(AppConfig, dispatcher, RiotControl, AppModules){
    this.AppConfig = AppConfig;
    this.dispatcher = dispatcher;
    this.RiotControl = RiotControl;
    this.AppModules = AppModules;

    riot.observable(this);

    this.Data = {};
    this.Data.PageID = null; //used in the URL.
    this.Data.FileCount = 0;
    this.Data.FileList = [];
    Object.preventExtensions(this.Data);

    // Important: Do last.
    Object.preventExtensions(this);
};

TPageFilesDataStore.prototype.ChangePage = function(PageID){
    this.Data.PageID = PageID;
    this.UpdateFileListing(PageID);
};

TPageFilesDataStore.prototype.UploadFiles = function(PageID, NativeFiles){
    var self = this;
    this.AppModules.Doc.UploadFiles(PageID, NativeFiles, OnUploadFinish);

    function OnUploadFinish(file){
        if (PageID == self.Data.PageID) {
            self.UpdateFileListing(PageID);
        }
    }
};

TPageFilesDataStore.prototype.UpdateFileListing = function(PageID){
    var dataJSON = this.AppModules.Doc.Ajax_GetFileList(PageID);
    var fileList = JSON.parse(dataJSON);
    Object.preventExtensions(fileList);

    // Empty the file list array.
    // http://stackoverflow.com/a/1232046/395461
    this.Data.FileList.length = 0;

    // push any 'files' to the file list. ignore directories.
    for (var c1=0; c1 < fileList.nodes.length; c1++){
        if (vam.functions.sameText(fileList.nodes[c1].type, 'file')){
            this.Data.FileList.push(fileList.nodes[c1]);
        }
    }

    this.RiotControl.trigger('PageFiles:Changed');
};

TPageFilesDataStore.prototype.DeleteFile = function(PageID, FileName){
    var ajaxResponse = this.AppModules.Doc.Ajax_DeleteFile(PageID, FileName);
    console.log(ajaxResponse);

    // TODO:HIGH
    // Need to look at ajaxResponse and figure out
    // what the reponse will be under different conditions.
    // Need to update the GUI after deleting the file.



    /*
    if (ajaxResponse.responseStatus == 'success'){
        // do something here.
    } else {
       // do something else here.
    }
    */

    if (PageID == this.Data.PageID) {
        this.UpdateFileListing(PageID);
    }
};



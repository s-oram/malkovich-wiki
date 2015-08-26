riot.tag('docedit_sidebar', '<div>Attached Files</div> <div id="DocEditFileBrowserContainer" class="FGRows FGCellGrow">  <div id="dropzone1" class="component-uploadfile FileDropZone"> <div class="FileBrowserContainer"> <docedit_filebrowser global_options="{ opts.global_options }"></docedit_filebrowser> </div> <div class="component-uploadfile-ready-msg DropHereMessage"><div>Drop files here or &nbsp; <a>browse...</a></div></div> <input type="file" class="component-uploadfile-fileinput" name="files[]" multiple> </div> <div class="UploadPlaceHolders"></div> </div>', 'class="docedit_sidebar"', function(opts) {
"use strict";
var self = this;

var AppConfig = self.opts.global_options.AppConfig;
var Dispatcher = self.opts.global_options.Dispatcher;
var DataStores = self.opts.global_options.DataStores;
var RiotControl = self.opts.global_options.RiotControl;

self.SetupEventHandlers = function () {
    var $node = $(self.root);

    var UploadURL = AppConfig.ApiUrl.Root + AppConfig.ApiUrl.Files + "/uploadfile";
    var options = { iframe: { url: UploadURL }, input: false };
    var dropzone = new FileDrop('dropzone1', options);

    dropzone.event('send', function (files) {
        var NativeFiles = [];
        $.each(files, function (index, value) {
            NativeFiles.push(value.nativeFile);
        });
        var DocID = DataStores.PageData.PageID;
        Dispatcher.trigger('Cmd:UpdateDoc:UploadFiles', DocID, NativeFiles);
    });

    $node.find(".component-uploadfile-fileinput").change(function () {
        var files = $node.find(".component-uploadfile-fileinput").prop("files");
        var NativeFiles = [];
        $.each(files, function (index, value) {
            NativeFiles.push(value);
        });
        var DocID = DataStores.PageData.PageID;
        Dispatcher.trigger('Cmd:UpdateDoc:UploadFiles', DocID, NativeFiles);
    });

    $node.find('div.DropHereMessage').click(function (e) {
        $node.find(".component-uploadfile-fileinput").trigger('click');
    });
};

self.on('mount', function () {
    self.SetupEventHandlers();
    Dispatcher.trigger('TagReady', 'DocEdit_SideBar');
});

RiotControl.on('PageFiles:Changed', function () {
    self.update();
});
});
riot.tag('docedit', '<div id="EditPageMainEditArea" class="docedit_main"> <div> Editing: { DataStores.PageData.PageName } </div> <form id="DocEditForm" class="FGCellGrow FGRows" > <div class="FormGroup hidden form-error-message"></div> <div class="FormGroup hidden form-success-message"></div> <textarea name="DocText" id="DocTextEdit" class="FormGroup FGCellGrow"></textarea> <div class="FormGroup FormButtonContainer"> <ul class="InlineList"> <li><input class="Button btn btn-primary" type="submit" name="save" value="Save Changes"> <li><input class="Button btn btn-default" type="submit" name="cancel" value="Cancel"> </ul> </div> </form> </div> <docedit_sidebar global_options="{ opts }" ></docedit_sidebar>', 'class="DocEditComponent"', function(opts) {
"use strict";
var self = this;
self.data = {};
self.opts = opts;
this.DataStores = self.opts.DataStores;
ExtendRiotTag(self, RiotTagEx_VisibleProperty);
ExtendRiotTag(self, RiotTagEx_GlobalOptions);
Object.preventExtensions(self);

var AppConfig = self.global_options.AppConfig;
var Dispatcher = self.global_options.Dispatcher;
var DataStores = self.global_options.DataStores;
var RiotControl = self.global_options.RiotControl;

self.on('mount', function () {
    SetupEventHandlers(this);
    Dispatcher.trigger('TagReady', 'DocEdit');
});

self.on('update', function () {
    if (self.Visible) {
        var content = DataStores.PageData.PageContentMarkdown;
        var $EditNode = $(self.root).find('textarea#DocTextEdit');
        // IMPORTANT: Use val() function to set the value of the text area.
        // html() will be ignored if the content has been edited by the user.
        // http://stackoverflow.com/a/13467121/395461
        $(self.root).find('textarea#DocTextEdit').val(content);
    }
});

function SetupEventHandlers(tag) {
    var $node = $(tag.root);
    var $DocEditForm = $node.find('form#DocEditForm');

    $DocEditForm.find("input[type='submit']").click(function (e) {
        e.preventDefault();
        var buttonName = $(this).attr("name");
        if (buttonName == "save") {
            $DocEditForm.submit();
        } else if (buttonName == "cancel") {
            Dispatcher.trigger('Cmd:RouteTo', 'doc', DataStores.PageData.PageID, 'view');
        }
    });

    $DocEditForm.AjaxForm_OnSubmit(function (form) {
        var PageID = DataStores.PageData.PageID;
        var formData = $(form).serializeJSON();
        Dispatcher.trigger('Cmd:UpdateDoc:Content', PageID, formData);
    });

    $node.on('dragover', 'textarea#DocTextEdit', OnDragOver);
}

function OnDragOver(e) {
    // TODO:MED do some drag over stuff here.
}

RiotControl.on('Page:Change', function () {
    if (self.Visible) self.update();
});

RiotControl.on('DocEdit:Show', function () {
    self.Visible = true;
});

RiotControl.on('DocEdit:Hide', function () {
    self.Visible = false;
});
});
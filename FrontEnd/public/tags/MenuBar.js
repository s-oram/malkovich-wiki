riot.tag('menubar', '<div class="FGColumns WikiMenu"> <div if="{!DataStores.PageData.IsIndexPage}" class="MenuBarFlexButton HomeButton"> <span class="ButtonText">Home</span> </div> <div id="PageTitle" class="MenuBarElement"> { \'#\' + DataStores.PageData.PageName } </div> </div> <div class="FGColumns PageMenu"> <div class="MenuBarFlexButton EditDocButton"> <span class="ButtonText">Edit</span> </div> <div class="MenuBarFlexButton SettingsButton"> <span class="ButtonText">Settings</span> </div> </div>', 'class="MainMenuBar FGColumns"', function(opts) {
"use strict";
var self = this;
ExtendRiotTag(self, RiotTagEx_VisibleProperty);
ExtendRiotTag(self, RiotTagEx_GlobalOptions);
this.DataStores = self.global_options.DataStores;
Object.preventExtensions(self);

var AppConfig = self.global_options.AppConfig;
var Dispatcher = self.global_options.Dispatcher;
var DataStores = self.global_options.DataStores;
var RiotControl = self.global_options.RiotControl;

self.on('mount', function () {
    SetupEventHandlers(this);
    Dispatcher.trigger('TagReady', 'MenuBar');
});

self.on('update', function () {});

function SetupEventHandlers(tag) {
    $(tag.root).click(OnClick);
}

function OnClick(e) {
    if ($(e.target).hasClass("EditDocButton")) {
        e.preventDefault();
        Dispatcher.trigger('Cmd:RouteTo', 'doc', DataStores.PageData.PageID, 'edit');
    }

    if ($(e.target).hasClass("SettingsButton")) {
        e.preventDefault();
        var objPos = $(e.target).position();
        var x = objPos.left + $(e.target).width();
        var y = objPos.top + $(e.target).height() - 1; //-1 because it looks better in that position.
        Dispatcher.trigger('Cmd:ShowPageSettingsMenu', x, y);
    }

    if ($(e.target).hasClass("HomeButton")) {
        e.preventDefault();
        Dispatcher.trigger('Cmd:RouteTo', 'doc', 'index', 'view');
    }
}

RiotControl.on('Page:Change', function () {
    self.update();
});

RiotControl.on('DocView:Show', function () {
    self.Visible = true;
});

RiotControl.on('DocView:Hide', function () {
    self.Visible = false;
});
});

"use strict";

function TDialogController(AppConfig, Dispatcher, RiotControl, AppModules){
    this.AppConfig = AppConfig;
    this.Dispatcher = Dispatcher;
    this.RiotControl = RiotControl;
    this.AppModules = AppModules;
}

TDialogController.prototype.ShowPageDeleteConfirmMessage = function(PageID){
    var self = this;
    var MsgSetup = {};
    MsgSetup.DialogCallback = Callback;
    MsgSetup.DialogTitle = 'Delete Page?';
    MsgSetup.DialogMessage = 'Do you really want to delete this page? This cannot be undone.';
    MsgSetup.MsgButtons = [];
    MsgSetup.MsgButtons.push({
        caption : 'Delete',
        tag : 'delete'
    });
    MsgSetup.MsgButtons.push({
        caption : 'Cancel',
        tag : 'cancel'
    });

    function Callback(ButtonTag){
        if (ButtonTag == 'delete') {
            self.Dispatcher.trigger('Cmd:DeletePage', PageID);
        }
    }

    this.RiotControl.trigger('RiotDialog:Message:Show', MsgSetup);

};

TDialogController.prototype.ShowFileDeleteConfirmMessage = function(PageID, FileName){
    var self = this;
    var MsgSetup = {};
    MsgSetup.DialogCallback = Callback;
    MsgSetup.DialogTitle = 'Delete "' + FileName +'"?';
    MsgSetup.DialogMessage = 'Do you really want to delete this file? This cannot be undone.';
    MsgSetup.MsgButtons = [];
    MsgSetup.MsgButtons.push({
        caption : 'Delete',
        tag : 'delete'
    });
    MsgSetup.MsgButtons.push({
        caption : 'Cancel',
        tag : 'cancel'
    });

    function Callback(ButtonTag){
        if (ButtonTag == 'delete') {
            self.Dispatcher.trigger('Cmd:DeleteFile', PageID, FileName);
        }
    }

    this.RiotControl.trigger('RiotDialog:Message:Show', MsgSetup);
};
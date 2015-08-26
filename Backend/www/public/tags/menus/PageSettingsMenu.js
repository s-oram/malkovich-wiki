riot.tag('page-settings-menu', '<div class="PopupMenu"> <ul> <li class="danger DeletePageMenuOption">Delete Page</li> </ul> </div>', function(opts) {
"use strict";
self = this;
this.AllowClose = false;
ExtendRiotTag(self, RiotTagEx_VisibleProperty);
ExtendRiotTag(self, RiotTagEx_GlobalOptions);
this.Visible = false;
Object.preventExtensions(self);

var Dispatcher = self.global_options.Dispatcher;
var RiotControl = self.global_options.RiotControl;
var DataStores = self.global_options.DataStores;

self.on('mount', function () {
    SetupEventHandlers(self);
    $(self.root).find('.PopupMenu').hide();
    Dispatcher.trigger('TagReady', 'PageSettingsMenu');
});

self.on('update', function () {
    if (DataStores.PageData.IsIndexPage) {
        $(self.root).find('.DeletePageMenuOption').addClass('DisabledMenuItem');
    } else {
        $(self.root).find('.DeletePageMenuOption').removeClass('DisabledMenuItem');
    }
});

function SetupEventHandlers(tag) {
    $(tag.root).click(OnClick);
}

function OnClick(e) {
    if ($(e.target).hasClass('DeletePageMenuOption')) {
        e.preventDefault();
        Dispatcher.trigger('Cmd:HidePageSettingsMenu');
        Dispatcher.trigger('Cmd:DeletePageWithConfirm', DataStores.PageData.PageID);
    }
}

function OnDocumentClick(e) {
    // Close the settings menu when clicking outside the menu.
    if (self.root.contains(e.target) == false) {
        Dispatcher.trigger('Cmd:HidePageSettingsMenu');
    }

    // NOTE: This article explains why stopping event propagation is bad.
    // https://css-tricks.com/dangers-stopping-event-propagation/
}

RiotControl.on('Cmd:ShowPageSettingsMenu', function (x, y) {
    // NOTE: The menu close detection is attached to the document
    // click event handler. Therefore close events will
    // sometimes be fired immediately after a open event.
    // This prevents the menu from opening. As a hacky work-around,
    // temporarily ignore close events for XX period of time.
    self.AllowClose = false;

    // Set the click handler using a time out to
    // allow the current click event to fully
    // propagate through the document nodes.
    setTimeout(function () {
        self.AllowClose = true;
        $(document).on('click', OnDocumentClick);
    }, 100);

    self.Visible = true;

    var $MenuElement = $(self.root).find('.PopupMenu');
    var MenuX = x - $MenuElement.width();
    var MenuY = y;

    // Convert to strings...
    MenuX = MenuX + 'px';
    MenuY = MenuY + 'px';

    $MenuElement.css({ 'left': MenuX });
    $MenuElement.css({ 'top': MenuY });
    $MenuElement.show();
});

RiotControl.on('Cmd:HidePageSettingsMenu', function () {
    if (self.AllowClose == true) {
        self.Visible = false;
        $(document).off('click', OnDocumentClick);
        console.log('hide');
    }
});
});
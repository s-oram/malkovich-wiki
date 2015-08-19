"use strict";

function TPageDataStore(AppConfig, dispatcher, RiotControl, AppModules){
    this.AppConfig = AppConfig;
    this.dispatcher = dispatcher;
    this.RiotControl = RiotControl;
    this.AppModules = AppModules;

    riot.observable(this);

    this.Data = {};
    this.Data.PageID = null; //used in the URL.
    this.Data.PageName = null; //used for human readable output.
    this.Data.PageContentHtml = null;
    this.Data.PageContentMarkdown = null;
    this.Data.PageHasContent = false;
    this.Data.IsIndexPage = false;
    Object.preventExtensions(this.Data);

    Object.preventExtensions(this);
}

TPageDataStore.prototype._IsPageIndex = function(PageID){
    if (PageID.toLowerCase() == 'index')
        return true;
    else
        return false;

};

TPageDataStore.prototype.ChangePage = function(PageID){
    var self = this;
    this.Data.PageID = PageID;
    this.Data.IsIndexPage = this._IsPageIndex(PageID);
    this.UpdatePageData(PageID, OnUpdateFinished);
    function OnUpdateFinished(){
        self.RiotControl.trigger('Page:Change');
        //var msgTitle = '';
        //var msgHtml = "<p>There isn't any content on this page.</p><p>Add some now?</p>";
        //RiotDialog.ShowMessage(self.RiotControl, msgTitle, msgHtml, NoContentCallback);
    }
};

TPageDataStore.prototype.UpdatePageData = function(PageID, FinishedCallback){
    if (PageID == this.Data.PageID) {
        this.Data.PageID = PageID;
        if (this._IsPageIndex(PageID))
            this.Data.PageName = 'Welcome';
        else
            this.Data.PageName = this.AppModules.Doc.DocNameFromUrlString(PageID);

        var ajaxResponse = this.AppModules.Doc.Ajax_GetDocAsHtml(PageID);
        if (ajaxResponse.responseStatus == 'success') {
            this.Data.PageContentHtml = ajaxResponse.responseData;
        } else if (ajaxResponse.responseStatus == 'nocontent') {
            this.Data.PageContentHtml = '';
        } else {
            console.log(ajaxResponse);
            this.Data.PageContentHtml = '';
        }

        var ajaxResponse = this.AppModules.Doc.Ajax_GetDocAsMarkDown(PageID);
        if (ajaxResponse.responseStatus == 'success'){
            this.Data.PageContentMarkdown = ajaxResponse.responseData;
        } else if (ajaxResponse.responseStatus == 'nocontent') {
            this.Data.PageContentMarkdown = '';
        } else {
            this.Data.PageContentMarkdown = 'ERROR';
        }

        // Check if the page has any content.
        this.Data.PageContentHtml = _.trim(this.Data.PageContentHtml);
        if (this.Data.PageContentHtml == '')
            this.Data.PageHasContent = false;
        else
            this.Data.PageHasContent = true;

        //===============
        this.RiotControl.trigger('Page:Updated');
    }
    if (vam.functions.assigned(FinishedCallback)) FinishedCallback();
};

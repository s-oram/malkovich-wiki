console.log(document.currentScript);
"use strict";

var TInputDialog = function(options){
    this.ClassName = "TInputDialog";
    this.options = {
        //Set default options here.
        ScriptPath : '/widgets/popup_dialog'
    };
    $.extend(this.options, options);
    this.$PopUpContainer = null;
}

TInputDialog.prototype.show = function(msgTitle, msgHtml, inputText, callback){
    var self = this;
    var templatePath = self.options.ScriptPath + '/templates/input_dialog.html';

    var msgButtons = [{
        caption : 'Ok',
        type : 'Ok',
        tag : 'ok'
    }, {
        caption : 'Cancel',
        type : 'Cancel',
        tag: 'cancel'
    }];

    function ButtonClick(e){
        var tag = $(e.target).attr("data-tag");
        var text = self.$PopUpContainer.find('input.VamPopUp-InputText').val();
        if (callback != null) {
            callback(tag, text);
        }
    }

    function BackgroundClick(e){
        e.stopPropagation();
        if (callback != null) {
            callback('cancel', '');
        }
    }

    function DialogBackgroundClick(e){
        e.stopPropagation();
    }

    //TODO:MED should add event handlers to for 'ENTER' and 'ESC' hotkeys.

    $.get(templatePath, function(template){
        var templateData = {
            DialogTitle: msgTitle,
            DialogMessage: msgHtml,
            InputText: inputText,
            Buttons: msgButtons
        }
        var html = Mustache.render(template, templateData);

        $(document.body).append(html);

        self.$PopUpContainer = $('.VamPopUp_Container').last();
        self.$PopUpContainer.click(BackgroundClick);
        self.$PopUpContainer.find('div.VamPopUp_DialogContainer').click(DialogBackgroundClick);
        self.$PopUpContainer.find('input.VamPopUp-InputText').focus();
        self.$PopUpContainer.find(".VamPopUp-DialogButton").each(function(index, obj){
            $(obj).click(ButtonClick.bind(self));
        });
    });
}

TInputDialog.prototype.hide = function(){
    var self = this;
    if (self.$PopUpContainer !== null ){
        self.$PopUpContainer.remove();
        self.$PopUpContainer = null;
    }
}


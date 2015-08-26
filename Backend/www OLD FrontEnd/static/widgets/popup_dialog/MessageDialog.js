console.log(document.currentScript);
"use strict";

//TODO:MED instead of using an event handler for each button,
// it might be better to have one call back handler for each button.
// The callback can have a 'tag' argument so the callback
// handler can respond appropriately.

var TMessageDialog = function(options){
    this.ClassName = "TMessageDialog";
    this.options = {
        //Set default options here.
        ScriptPath : '/widgets/popup_dialog'
    };
    $.extend(this.options, options);
    this.$PopUpContainer = null;
}


TMessageDialog.prototype.show = function(msgTitle, msgHtml, msgButtons){
    var self = this;
    var templatePath = self.options.ScriptPath + '/templates/popup_dialog.html';

    $.get(templatePath, function(template){
        var templateData = {
            DialogTitle: msgTitle,
            DialogMessage: msgHtml,
            Buttons: msgButtons
        }
        console.log(msgButtons);

        var html = Mustache.render(template, templateData);

        $(document.body).append(html);
        self.$PopUpContainer = $('.VamPopUp_Container').last();
        self.$PopUpContainer.find(".VamPopUp-DialogButton").each(function(index, obj){
            if (msgButtons[index].click != null) {
                var EventHandler = msgButtons[index].click;
                $(obj).click(EventHandler.bind(self));
            } else if (msgButtons[index].action === 'ok'){
                var EventHandler = self.hide;
                $(obj).click(EventHandler.bind(self));
            } else if (msgButtons[index].action === 'cancel'){
                var EventHandler = self.hide;
                $(obj).click(EventHandler.bind(self));
            };
        });
    });
}

TMessageDialog.prototype.hide = function(){
    var self = this;
    if (self.$PopUpContainer !== null ){
        self.$PopUpContainer.remove();
        self.$PopUpContainer = null;
    }
}

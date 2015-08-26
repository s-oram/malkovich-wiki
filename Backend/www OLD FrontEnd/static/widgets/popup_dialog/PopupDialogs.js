

var PopupDialogs = new Object();

PopupDialogs.ShowMessage = function(msgTitle, msgText, callback){
    var MessageDialog = new TMessageDialog();

    function ClickHandler(){
        MessageDialog.hide();
        if (callback != null) callback();
    };

    var Buttons = [{
        caption : 'Ok',
        type : 'Ok',
        click : ClickHandler
    }];

    MessageDialog.show(msgTitle, msgText, Buttons);
};

PopupDialogs.Input = function(msgTitle, msgHtml, inputText, callback){
    var InputDialog = new TInputDialog();

    function DialogCallback(tag, text){
        if (tag == 'ok') {
            InputDialog.hide();
        };
        if (tag == 'cancel') {
            InputDialog.hide();
        };
        if (callback != null) callback(tag, text);
    }

    InputDialog.show(msgTitle, msgHtml, inputText, DialogCallback);
}



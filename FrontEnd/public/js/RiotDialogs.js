;var RiotDialog = (function() {
    // Mastering the module pattern
    // http://toddmotto.com/mastering-the-module-pattern/

    function TRiotDialog(){

    }

    TRiotDialog.prototype.ShowMessage = function(RiotControl, msgTitle, msgHtml, Callback){
        var MsgSetup = {};
        //MsgData is a free variable for the user. Anything assigned to the MsgData will be returned in the callback.
        MsgSetup.MsgData = null;
        MsgSetup.DialogTitle = msgTitle
        MsgSetup.DialogMessage = msgHtml;
        MsgSetup.DialogCallback = Callback;
        MsgSetup.MsgButtons = [];
        MsgSetup.MsgButtons.push({
            caption : 'Ok',
            tag : 'ok'
        });

        RiotControl.trigger('RiotDialog:Message:Show', MsgSetup);
    };



    return new TRiotDialog();
}.call());

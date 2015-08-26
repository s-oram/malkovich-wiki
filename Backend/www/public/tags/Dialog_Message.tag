<riotdialog-message class="RiotDialog MessageDialog">
    <div class="PopUpWrapper">
        <div class="DialogContainer">
            <div class="Content">
                <div if={Data.DialogTitle} class="DialogTitle">{Data.DialogTitle}</div>
                <div class="DialogMessage"></div>
                <ul class="DialogButtons">
                    <li each={Data.MsgButtons} class={ButtonClass} data-dialogElement="DialogButton" data-tag={tag}>{caption}</li>
                </ul>
            </div>
        </div>
    </div>


    <script>
        "use strict";
        var self = this;
        ExtendRiotTag(self, RiotTagEx_VisibleProperty);
        ExtendRiotTag(self, RiotTagEx_GlobalOptions);
        self.Visible = false;
        self.Data = {};
        //MsgData is a free variable for the user. Anything assigned to the MsgData will be returned in the callback.
        self.Data.MsgData = null;
        self.Data.DialogTitle = 'Message!';
        self.Data.DialogMessage = 'This is a very important message.';
        self.Data.DialogCallback = null;
        self.Data.MsgButtons = [];
        self.Data.MsgButtons.push({
            caption : 'Ok',
            tag : 'ok'
        });
        self.Data.MsgButtons.push({
            caption : 'Cancel',
            tag : 'cancel'
        });
        Object.preventExtensions(self);

        var Dispatcher = self.global_options.Dispatcher;
        var RiotControl = self.global_options.RiotControl;

        self.on('mount', function() {
            SetupEventHandlers(self);
            Dispatcher.trigger('TagReady', 'RiotDialog:Message');
        });

        self.on('update', function(){
            _.forEach(this.Data.MsgButtons, function(value){
                value.ButtonClass = 'RiotDialogButton ' + value.tag.toLowerCase();
            });
            $(self.root).find('.DialogMessage').html(self.Data.DialogMessage);
        });

        function SetupEventHandlers(tag){
            $(tag.root).click(OnClick);
        }

        function OnClick(e){
            var ElementType = $(e.target).attr('data-dialogElement');
            var ButtonTag = $(e.target).attr('data-tag');
            if (ElementType == 'DialogButton') {
                e.preventDefault();
                if (vam.functions.assigned(self.Data.DialogCallback)) self.Data.DialogCallback(ButtonTag, self.Data.MsgData);
                self.Visible = false;
                self.update();
            }
        }

        RiotControl.on('RiotDialog:Message:Show', function(MsgSetup){
            self.Data.MsgButtons.length = 0;
            _.extend(self.Data, MsgSetup);
            self.Visible = true;
        });

    </script>
</riotdialog-message>
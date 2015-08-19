<docview class="DocViewComponent">
    <script>
        "use strict";
        var self = this;
        self.Data = {};
        ExtendRiotTag(self, RiotTagEx_VisibleProperty);

        var AppConfig = self.opts.AppConfig;
        var RiotControl = self.opts.RiotControl;
        var Dispatcher = self.opts.Dispatcher;
        var DataStores = self.opts.DataStores;

        // Important: Call last.
        Object.preventExtensions(self);

        self.on('mount', function() {
            SetupEventHandlers(this);
            Dispatcher.trigger('TagReady', 'DocView');
        });

        self.on('update', function(){
            if (self.Visible) {
                if (DataStores.PageData.PageHasContent) {
                    self.root.innerHTML = DataStores.PageData.PageContentHtml;
                } else {
                    var link = '<a href="" class="EditDocLink">Edit to add some content now...</a>';
                    self.root.innerHTML = '<p class="PageEmptyMessage">This page is empty. ' + link + '</p>';
                }

            }
        });

        function SetupEventHandlers(tag){
            $(tag.root).click(OnClick);
        }

        function OnClick(e){
            if ($(e.target).hasClass("EditDocLink")) {
                e.preventDefault();
                Dispatcher.trigger('Cmd:RouteTo', 'doc', DataStores.PageData.PageID, 'edit');
            }
        }

        RiotControl.on('Page:Change', function(){
            if (self.Visible) self.update();
        });

        RiotControl.on('DocView:Show', function(){
            self.Visible = true;
        });

        RiotControl.on('DocView:Hide', function(){
            self.Visible = false;
        });

    </script>
</docview>
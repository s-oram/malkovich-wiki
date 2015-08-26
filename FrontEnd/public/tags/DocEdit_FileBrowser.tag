<docedit_filebrowser class="docedit_filebrowser">
    <!--<div class="component-filebrowser"></div>-->
    <ul class="FileItemList">
        <li if={ DataStores.PageFiles.FileList.length == 0 } class="NoFilesFound">
            No files found
        </li>

        <li each={ DataStores.PageFiles.FileList } class="FileItem" draggable="true" data-dragtype="File" data-pageid={DataStores.PageData.PageID} data-filename={name} data-wikilink={wikilink} >
            <div class="FileIcon"></div>
            <div class="FileName">{ name }</div>
            <div class="FileButtons">
                <button class="FileDeleteButton" data-pageid={DataStores.PageData.PageID} data-filename={name} >&nbsp;</button>
            </div>
        </li>
    </ul>

    <script>
        "use strict";
        var self = this;
        self.opts = opts;
        ExtendRiotTag(self, RiotTagEx_GlobalOptions);
        this.DataStores = self.global_options.DataStores;
        Object.preventExtensions(self);


        var AppConfig = self.global_options.AppConfig;
        var Dispatcher = self.global_options.Dispatcher;
        var DataStores = self.global_options.DataStores;
        var RiotControl = self.global_options.RiotControl;

        function SetupEventHandlers(tag){
            $(tag.root).click(OnClick);
            $(tag.root).on('dragstart', 'li.FileItem', OnDragStart)
        }

        function OnClick(e){
            if ($(e.target).hasClass('FileDeleteButton')){
                e.preventDefault();
                var PageID = $(e.target).attr('data-pageid');
                var FileName = $(e.target).attr('data-filename');
                Dispatcher.trigger('Cmd:DeleteFileWithConfirm', PageID, FileName);
            }
        }

        function OnDragStart(e){
            if ($(e.target).hasClass('FileItem')){
                e.preventDefault;
                var link = $(e.target).attr("data-wikilink");
                e.originalEvent.dataTransfer.setData('Text', link);
            }
        }

        self.on('mount', function() {
            SetupEventHandlers(self);
            Dispatcher.trigger('TagReady', 'DocEdit_FileBrowser');
        });

        self.on('update', function(){
        });

        RiotControl.on('PageFiles:Changed', function(){
            self.update();
        });

    </script>
</docedit_filebrowser>
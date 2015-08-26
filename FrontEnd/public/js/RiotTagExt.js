"use strict";

function ExtendRiotTag(tag, extension) {
    extension(tag);
};

var RiotTagEx_VisibleProperty = function(tag){
    tag._Visible = false;

    Object.defineProperty(tag,'Visible', {
        enumerable: true,
        get: function(){ return this._Visible},
        set: function(value){
            if (value != this._Visible) {
                this._Visible = value
                this.update();
            }
        }
    });

    tag.on('update', function(){
        if (this.Visible) {
            $(this.root).removeClass('hidden');
        } else {
            $(this.root).addClass('hidden');
        }
    });
};

var RiotTagEx_GlobalOptions = function(tag){
    if (vam.functions.assigned(tag.opts.global_options))
        tag.global_options = tag.opts.global_options;
    else
        tag.global_options = tag.opts;
};



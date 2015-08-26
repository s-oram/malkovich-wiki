console.log(document.currentScript);


// Source: http://stackoverflow.com/a/2735606/395461
function getCaretPosition(el) {
    if (el.selectionStart) {
        return el.selectionStart;
    } else if (document.selection) {
        el.focus();

        var r = document.selection.createRange();
        if (r == null) {
            return 0;
        }

        var re = el.createTextRange(),
            rc = re.duplicate();
        re.moveToBookmark(r.getBookmark());
        rc.setEndPoint('EndToStart', re);

        var add_newlines = 0;
        for (var i=0; i<rc.text.length; i++) {
            if (rc.text.substr(i, 2) == '\r\n') {
                add_newlines += 2;
                i++;
            }
        }

        //return rc.text.length + add_newlines;

        //We need to substract the no. of lines
        return rc.text.length - add_newlines;
    }
    return 0;
}
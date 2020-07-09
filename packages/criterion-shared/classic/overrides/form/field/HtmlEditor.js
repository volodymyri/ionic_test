Ext.define('criterion.overrides.form.field.HtmlEditor', {

    override : 'Ext.form.field.HtmlEditor',

    privates : {
        //MIDAS createLink workaround
        createLink : function() {
            var url = prompt(this.createLinkText, this.defaultLinkValue);
            if (url && url != 'http:/' + '/') {
                var sel = false;
                if (window.getSelection) {
                    sel = this.getWin().getSelection();
                } else if (document.getSelection) {
                    sel = this.getDoc().getSelection();
                }
                if (sel) {
                    if (sel.type != 'Range') {
                        if (!this.hasFocus) {
                            this.focus();
                            var value = this.value + '<a target="_blank" href="' + url + '">' + url + '</a>';
                            this.setValue(value);

                            Ext.defer(function() {
                                var contentDoc = this.inputEl.dom.contentDocument;
                                var range = contentDoc.createRange();
                                range.setStart(contentDoc.body.lastChild, 1);//url.length);
                                range.setEnd(contentDoc.body.lastChild, 1);//url.length);
                                var selection = this.inputEl.dom.contentWindow.getSelection();
                                selection.removeAllRanges();
                                selection.addRange(range);
                            }, 1, this);
                        } else {
                            this.insertAtCursor('<a target="_blank" href="' + url + '">' + url + '</a>');
                        }
                    } else {
                        this.insertAtCursor('<a target="_blank" href="' + url + '">' + sel + '</a>');
                    }
                } else if (document.selection) {
                    sel = this.getDoc().selection.createRange();
                    sel.pasteHTML('<a target="_blank" href="' + url + '">' + sel.text + '</a>');
                } else this.relayCmd('createlink', url);

                this.fireEvent('change');
            }
        }
    }
});

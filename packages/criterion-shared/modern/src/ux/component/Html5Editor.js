Ext.define('criterion.ux.component.Html5Editor', {

    extend : 'Ext.Component',

    alias : 'widget.criterion_html5editor',

    config : {
        value : '',
        placeholder : ''
    },

    publishes : {
        value : true
    },

    initialize : function() {
        var me = this,
            innerHtml;

        me.callParent();

        me.addCls('criterion-modern-html5editor x-field x-textfield');
        innerHtml = me.getInnerHtmlElement();
        innerHtml.set({
            contenteditable : true
        });
        innerHtml.addCls('x-input-el');
        innerHtml.on('blur', function() {
            me.setValue(innerHtml.dom.innerHTML);
        });
        innerHtml.on('keyup', Ext.Function.createBuffered(function() {
            me.publishState('value', innerHtml.dom.innerHTML);
            Ext.defer(function() {
                me.placeCaretAtEnd(innerHtml.dom);
            }, 10)
        }, 500));
    },

    placeCaretAtEnd : function(el) {
        var range,
            sel;

        el.focus();

        if (
            typeof window.getSelection !== "undefined"
            &&
            typeof document.createRange !== "undefined"
        ) {
            range = document.createRange();
            range.selectNodeContents(el);
            range.collapse(false);

            sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        } else if (typeof document.body.createTextRange !== "undefined") {
            var textRange = document.body.createTextRange();

            textRange.moveToElementText(el);
            textRange.collapse(false);
            textRange.select();
        }
    },

    updateValue : function(value) {
        this.setHtml(value);
    },

    updatePlaceholder : function(text) {
        var me = this,
            innerHtml = me.getInnerHtmlElement();

        innerHtml.set({
            placeholder : text
        });
    }
});

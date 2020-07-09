Ext.define('criterion.overrides.form.Labelable', {

    override : 'Ext.form.Labelable',

    encodeLabelHtml : false,

    getFieldLabel : function() {
        let value = this.trimLabelSeparator();

        // <- changed
        return this.encodeLabelHtml ? Ext.String.htmlEncode(value) : value;
    },

    setActiveErrors : function(errors) {
        this.callParent([Ext.Array.unique(errors)]);
    },

    labelWidth : 130,
    labelSeparator : '&nbsp;',
    labelPad : null // we use scss variables instead

});

Ext.define('criterion.ux.form.field.MultiFileButton', function() {

    return {

        extend : 'Ext.form.field.FileButton',

        alias : [
            'widget.criterion_multi_filebutton'
        ],

        config : {
            multiple : true
        },

        afterRender : function() {
            if (this.getMultiple()) {
                this.fileInputEl.set({
                    multiple : 'multiple'
                })
            }

            this.callParent(arguments)
        },

        clearValue : function() {
            this.fileInputEl.dom.value = null;
        }
    }
});
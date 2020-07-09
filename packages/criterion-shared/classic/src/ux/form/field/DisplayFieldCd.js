Ext.define('criterion.ux.form.field.DisplayFieldCd', function() {

    return {
        alias : 'widget.criterion_display_field_cd',

        extend : 'criterion.ux.form.field.CodeDetail',

        requires : [
            'criterion.ux.form.field.plugin.DisplayOnly'
        ],

        growToLongestValue : false,

        hideEmpty : true,

        listeners : {
            change : function(cmp, value) {
                if (cmp.hideEmpty) {
                    cmp.setHidden(!value);
                }
            }
        },

        initComponent : function() {
            this.addPlugin('criterion_display_only');

            this.callParent(arguments);

            if (this.hideEmpty && !this.getValue()) {
                this.hide();
            }
        }
    };

});

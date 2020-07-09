Ext.define('criterion.view.ux.form.field.SSN', function() {

    return {

        extend : 'criterion.view.ux.form.field.Format',

        alias : 'widget.criterion_field_ssn',

        requires : [
            'criterion.ux.form.field.plugin.InputMask',
            'criterion.ux.form.field.plugin.HiddenValue'
        ],

        listeners : {
            blur : 'handleBlur',
            scope : 'this'
        },

        config : {
            activateHideValue : true
        },

        enableTriggerClickOnReadOnly : true,

        fieldLabel : i18n.gettext('Social Security Number'),

        fieldType : criterion.Consts.FIELD_FORMAT_TYPE.SSN,

        initComponent : function() {
            this.addPlugin({
                ptype : 'inputmask',
                placeholder : 'X'
            });
            this.addPlugin('criterion_hidden_value');

            this.callParent(arguments);
        },

        setActivateHideValue : function(val) {
            this.callParent(arguments);

            if (!val) {
                Ext.Array.each(this.plugins, function(plug) {
                    if (plug.ptype === 'criterion_hidden_value') {
                        plug.switchOff();
                    }
                });
            }
        },

        handleBlur : function() {
            if (this.getActivateHideValue()) {
                Ext.Array.each(this.plugins, function(plug) {
                    if (plug.ptype === 'criterion_hidden_value') {
                        plug.hideValue();
                    }
                });
            }
        }
    };
});

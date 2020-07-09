Ext.define('criterion.view.settings.payroll.GLAccount', function() {

    return {

        alias : 'widget.criterion_payroll_settings_gl_account',

        extend : 'criterion.view.FormView',

        title : i18n.gettext('GL Account'),

        defaults : {
            labelWidth : 200
        },

        items : [
            {
                xtype : 'textfield',
                fieldLabel : i18n.gettext('Account Number'),
                name : 'accountNumber',
                allowBlank : false
            },
            {
                xtype : 'textfield',
                fieldLabel : i18n.gettext('Account Name'),
                name : 'accountName',
                allowBlank : false
            }
        ]
    };

});

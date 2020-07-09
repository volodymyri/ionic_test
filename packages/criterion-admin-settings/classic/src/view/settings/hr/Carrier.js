Ext.define('criterion.view.settings.hr.Carrier', function() {

    return {

        alias : 'widget.criterion_settings_hr_carrier',

        extend : 'criterion.view.FormView',

        plugins : [
            {
                ptype : 'criterion_sidebar',
                width : criterion.Consts.UI_DEFAULTS.MODAL_NARROW_WIDTH
            }
        ],

        title : i18n.gettext('Carrier'),

        allowDelete : true,

        bodyPadding : '25 10',

        defaults : criterion.Consts.UI_CONFIG.ONE_COL_FORM,

        items : [
            {
                xtype : 'textfield',
                fieldLabel : i18n.gettext('Code'),
                name : 'code',
                allowBlank : false
            },
            {
                xtype : 'textfield',
                fieldLabel : i18n.gettext('Name'),
                name : 'name',
                allowBlank : false
            },
            {
                xtype : 'textfield',
                fieldLabel : i18n.gettext('Master Policy Number'),
                name : 'masterPolicyNumber'
            },
            {
                xtype : 'textfield',
                fieldLabel : i18n.gettext('Tax ID'),
                name : 'taxId'
            },
            {
                xtype : 'textfield',
                fieldLabel : i18n.gettext('Trading Partner ID'),
                name : 'tradingPartnerId'
            }
        ]
    }

});

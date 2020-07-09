Ext.define('criterion.view.settings.benefits.benefit.OptionForm', function() {

    return {
        alias : 'widget.criterion_settings_benefit_option_form',

        extend : 'criterion.view.FormView',

        modal : true,
        cls : 'criterion-modal',

        plugins : [
            {
                ptype : 'criterion_sidebar',
                width : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_WIDTH,
                height : 'auto',
                modal : true
            }
        ],

        items : [
            {
                layout : 'hbox',

                defaults : criterion.Consts.UI_CONFIG.TWO_COL_CONDENSED,

                items : [
                    {
                        padding : '0 10',

                        items : [
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Name'),
                                name : 'name',
                                bind : '{record.name}'
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Code'),
                                name : 'code',
                                bind : '{record.code}'
                            }

                        ]
                    },
                    {
                        padding : '0 10',
                        defaults : {
                            labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDER_WIDTH
                        },

                        items : [
                            {
                                xtype : 'toggleslidefield',
                                fieldLabel : i18n.gettext('Dependents Allowed'),
                                bind : '{record.isAllowDependent}'
                            },
                            {
                                xtype : 'toggleslidefield',
                                fieldLabel : i18n.gettext('Beneficiaries Allowed'),
                                bind : '{record.isAllowBeneficiary}'
                            },
                            {
                                xtype : 'toggleslidefield',
                                fieldLabel : i18n.gettext('Active'),
                                bind : '{record.isActive}'
                            }
                        ]
                    }
                ]
            }
        ]
    };
});

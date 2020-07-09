Ext.define('criterion.view.settings.hr.Onboarding', function() {

    return {

        alias : 'widget.criterion_settings_onboarding',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.controller.settings.hr.Onboarding',
            'criterion.view.settings.hr.onboarding.Details'
        ],

        bodyPadding : 0,

        header : {
            title : i18n.gettext('Onboarding List'),
            padding : '10 10 10 15',
            margin : 0,
            items : [
                {
                    xtype : 'tbfill'
                },
                {
                    xtype : 'button',
                    text : i18n.gettext('Assign'),
                    handler : 'handleAssign',
                    margin : '0 20 0 0',
                    hidden : true,
                    bind : {
                        hidden : '{isPhantom}'
                    }
                }
            ]
        },

        controller : {
            type : 'criterion_settings_onboarding',
            externalUpdate : false
        },

        viewModel : {
            data : {
                /**
                 * @type criterion.model.employer.Onboarding
                 */
                record : undefined
            }
        },

        items : [
            {
                xtype : 'criterion_panel',

                bodyPadding : '0 10',

                defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER,

                layout : 'hbox',

                plugins : [
                    'criterion_responsive_column'
                ],

                items : [
                    {
                        items : [
                            {
                                xtype : 'criterion_employer_combo',
                                fieldLabel : i18n.gettext('Employer'),
                                bind : {
                                    value : '{record.employerId}'
                                },
                                disabled : true,
                                hideTrigger : true
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Name'),
                                bind : {
                                    value : '{record.name}'
                                },
                                allowBlank : false
                            }
                        ]
                    },
                    {
                        items : [
                            {
                                xtype : 'toggleslidefield',
                                fieldLabel : i18n.gettext('Pre Hire'),
                                bind : {
                                    value : '{record.isPreHire}'
                                },
                                allowBlank : false
                            }
                        ]
                    }
                ]
            },
            {
                xtype : 'criterion_settings_onboarding_details',
                bind : {
                    store : '{record.details}'
                }
            }
        ]
    };
});


Ext.define('criterion.view.settings.payroll.WorkersCompensation', function() {

    return {
        alias : 'widget.criterion_payroll_settings_workers_compensation',

        extend : 'criterion.view.FormView',

        controller : {
            externalUpdate : false
        },

        plugins : [
            {
                ptype : 'criterion_sidebar',
                modal : false
            }
        ],

        title : i18n.gettext('Workers Compensation'),

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        defaults : {
            bodyPadding : '0 10'
        },

        items : [
            {
                xtype : 'criterion_panel',

                layout : 'hbox',

                plugins : [
                    'criterion_responsive_column'
                ],

                defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDE,

                items : [
                    {
                        items : [
                            {
                                xtype : 'criterion_code_detail_field',
                                fieldLabel : i18n.gettext('Worker Compensation'),
                                name : 'workersCompensationCd',
                                allowBlank : false,
                                codeDataId : criterion.consts.Dict.WORKERS_COMPENSATION
                            },
                            {
                                xtype : 'numberfield',
                                fieldLabel : i18n.gettext('Rate (per 100)'),
                                name : 'rate',
                                decimalPrecision : 6
                            },
                            {
                                xtype : 'numberfield',
                                fieldLabel : i18n.gettext('Experience Modifier'),
                                name : 'experienceModifier',
                                decimalPrecision : 6
                            }
                        ]
                    },
                    {
                        items : [
                            {
                                xtype : 'datefield',
                                fieldLabel : i18n.gettext('Effective Date'),
                                name : 'effectiveDate'
                            },
                            {
                                xtype : 'numberfield',
                                fieldLabel : i18n.gettext('Employee Contribution (per 100)'),
                                name : 'employeeContribution',
                                decimalPrecision : 6
                            },
                            {
                                xtype : 'numberfield',
                                fieldLabel : i18n.gettext('Limit (Year)'),
                                name : 'limitYear',
                                decimalPrecision : 4
                            }
                        ]
                    }
                ]
            }
        ]
    };

});

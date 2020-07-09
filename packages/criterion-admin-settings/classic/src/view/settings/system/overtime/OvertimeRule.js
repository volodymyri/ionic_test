Ext.define('criterion.view.settings.system.overtime.OvertimeRule', function() {

    return {

        alias : 'widget.criterion_settings_system_overtime_rule',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.controller.settings.system.overtime.OvertimeRule',
            'criterion.view.settings.system.overtime.OvertimeSequence',
            'criterion.store.employer.IncomeLists',
            'criterion.store.employer.overtime.Details',
            'criterion.store.employeeGroup.Overtimes'
        ],

        controller : {
            type : 'criterion_settings_system_overtime_rule',
            externalUpdate : false
        },

        viewModel : {
            stores : {
                overtimeSequence : {
                    type : 'criterion_employer_overtime_details'
                },
                incomeLists : {
                    type : 'employer_income_lists'
                },
                employeeGroupOvertimes : {
                    type : 'criterion_employee_group_overtimes'
                }
            }
        },

        bodyPadding : 0,

        header : {
            title : i18n._('Overtime Details'),

            defaults : {
                margin : '0 10 0 0'
            },

            items : [
                {
                    xtype : 'button',
                    handler : 'handleShowSettingsForm',
                    cls : 'criterion-btn-feature',
                    glyph : criterion.consts.Glyph['ios7-list-outline']
                }
            ]
        },

        scrollable : false,

        items : [
            {
                xtype : 'criterion_panel',

                layout : 'hbox',

                bodyPadding : '0 10',

                plugins : [
                    'criterion_responsive_column'
                ],

                defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER,

                items : [
                    {
                        items : [
                            {
                                xtype : 'criterion_employer_combo',
                                fieldLabel : i18n._('Employer'),
                                name : 'employerId',
                                disabled : true,
                                hideTrigger : true
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n._('Code'),
                                name : 'code',
                                allowBlank : false
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n._('Description'),
                                name : 'description',
                                allowBlank : false
                            }
                        ]
                    },
                    {
                        items : [
                            {
                                xtype : 'toggleslidefield',
                                fieldLabel : i18n._('Comp Time'),
                                name : 'isCompTime'
                            },
                            {
                                xtype : 'toggleslidefield',
                                fieldLabel : i18n._('Auto Deduct Breaks'),
                                name : 'isAutoDeductBreak'
                            },
                            {
                                xtype : 'criterion_employee_group_combobox',
                                reference : 'employeeGroupCombo',
                                fieldLabel : i18n._('Employee Groups'),
                                objectParam : 'overtimeId',
                                bind : {
                                    valuesStore : '{employeeGroupOvertimes}'
                                }
                            }
                        ]
                    }
                ]
            },
            {
                xtype : 'criterion_settings_overtime_sequence',
                flex : 1,
                bind : {
                    store : '{overtimeSequence}'
                }
            }
        ]
    };

});

Ext.define('criterion.view.settings.payroll.PayGroup', function() {

    return {

        alias : 'widget.criterion_settings_pay_group',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.controller.settings.payroll.PayGroup',
            'criterion.store.payGroup.Employees',
            'criterion.store.payGroup.Incomes',
            'criterion.store.employer.IncomeLists',
            'criterion.store.employeeGroup.PayGroups',
            'criterion.store.employer.payroll.Schedules'
        ],

        controller : {
            type : 'criterion_settings_pay_group',
            externalUpdate : false
        },

        listeners : {
            scope : 'controller',
            recordLoaded : 'handleRecordLoaded'
        },

        viewModel : {
            stores : {
                incomeLists : {
                    type : 'employer_income_lists'
                },
                employeeGroupPayGroups : {
                    type : 'criterion_employee_group_pay_groups'
                },
                employerPayrollPeriodSchedule : {
                    type : 'criterion_employer_payroll_schedules'
                }
            },
            formulas : {
                isNew : function(get) {
                    var record = get('record');

                    return record && record.phantom;
                }
            }
        },

        bodyPadding : 0,

        title : i18n.gettext('Pay Group Details'),

        modelValidation : true,

        items : [
            {
                xtype : 'criterion_panel',
                layout : 'hbox',

                defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER,
                plugins : [
                    'criterion_responsive_column'
                ],
                bodyPadding : 10,

                items : [
                    {
                        items : [
                            {
                                xtype : 'criterion_employer_combo',
                                fieldLabel : i18n.gettext('Employer'),
                                name : 'employerId',
                                disabled : true,
                                hideTrigger : true
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Name'),
                                name : 'name',
                                bind : {
                                    readOnly : '{!isNew}'
                                },
                                allowBlank : false
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Description'),
                                name : 'description',
                                bind : {
                                    readOnly : '{!isNew}'
                                },
                                allowBlank : false,
                                margin : '0 0 30 0'
                            }
                        ]
                    },
                    {
                        items : [
                            {
                                xtype : 'extended_combo',
                                fieldLabel : i18n.gettext('Payroll Schedule'),
                                name : 'payrollScheduleId',
                                bind : {
                                    store : '{employerPayrollPeriodSchedule}',
                                    readOnly : '{!isNew}'
                                },
                                displayField : 'name',
                                valueField : 'id',
                                editable : false,
                                allowBlank : false,
                                queryMode : 'local',
                                emptyText : i18n.gettext('Not Selected')
                            },
                            {
                                xtype : 'criterion_employee_group_combobox',
                                reference : 'employeeGroupCombo',
                                objectParam : 'payGroupId',
                                bind : {
                                    valuesStore : '{employeeGroupPayGroups}'
                                }
                            }
                        ]
                    }
                ]
            },
            {
                xtype : 'criterion_gridpanel',
                reference : 'incomeLists',
                padding : '0 0 30',
                title : i18n.gettext('Incomes'),

                store : {
                    type : 'criterion_pay_group_incomes'
                },
                listeners : {
                    scope : 'controller',
                    removeaction : 'remove'
                },

                tbar : [
                    {
                        xtype : 'button',
                        text : i18n.gettext('Add'),
                        cls : 'criterion-btn-feature',
                        listeners : {
                            click : 'handleAddIncome'
                        }
                    }
                ],

                columns : [
                    {
                        xtype : 'gridcolumn',
                        flex : 1,
                        text : i18n.gettext('Type'),
                        dataIndex : 'incomeListId',
                        renderer : 'renderIncome'
                    },
                    {
                        xtype : 'criterion_actioncolumn',
                        items : [
                            {
                                glyph : criterion.consts.Glyph['ios7-trash-outline'],
                                tooltip : i18n.gettext('Delete'),
                                action : 'removeaction'
                            }
                        ]
                    }
                ]
            }
        ]
    };

});

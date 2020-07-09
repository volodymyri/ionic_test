Ext.define('criterion.view.settings.payroll.Schedule', function() {

    return {

        alias : 'widget.criterion_payroll_settings_payroll_schedule',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.controller.settings.payroll.Schedule',
            'criterion.store.employer.payroll.payrollSchedule.PayrollPeriods',
            'criterion.controller.settings.payroll.schedule.Periods',
            'criterion.view.settings.payroll.schedule.Period'
        ],

        controller : {
            type : 'criterion_settings_payroll_schedule',
            externalUpdate : false
        },

        viewModel : {
            data : {
                currentYear : null,
                maxEndDate : null
            },
            stores : {
                years : {
                    type : 'store',
                    proxy : {
                        type : 'memory',
                        reader : {
                            type : 'json'
                        }
                    },
                    fields : [
                        {
                            name : 'id',
                            type : 'int'
                        },
                        {
                            name : 'title',
                            type : 'string'
                        }
                    ],
                    sorters : [
                        {
                            property : 'id',
                            direction : 'ASC'
                        }
                    ]
                },
                payrollSchedulePayrollPeriods : {
                    type : 'criterion_employer_payroll_payroll_schedule_payroll_periods',

                    listeners : {
                        scope : 'controller',
                        load : 'onLoadSchedulePayrollPeriods'
                    },

                    filters : [
                        {
                            property : 'year',
                            value : '{currentYear}'
                        }
                    ]
                }
            },
            formulas : {
                submitBtnText : function(data) {
                    return data('blockedState') ? 'Please wait...' : (data('isPhantom') ? 'Create' : 'Save')
                },
                yearSelectorIsHidden : function(data) {
                    return !data('currentYear');
                }
            }
        },

        bodyPadding : 0,

        title : i18n.gettext('Payroll Schedule Details'),

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
                                allowBlank : false,
                                bind : '{record.name}'
                            },
                            {
                                xtype : 'criterion_code_detail_field',
                                codeDataId : criterion.consts.Dict.PAY_FREQUENCY,
                                fieldLabel : i18n.gettext('Frequency'),
                                name : 'payFrequencyCd',
                                allowBlank : false,
                                bind : {
                                    value : '{record.payFrequencyCd}',
                                    disabled : '{!isPhantom}'
                                },
                                listeners : {
                                    codedetailsLoaded : function() {
                                        this.setFilterValues({
                                            attribute : 'attribute3',
                                            value : 'true'
                                        })
                                    }
                                }
                            }
                        ]
                    },
                    {
                        items : [
                            {
                                xtype : 'numberfield',
                                fieldLabel : i18n.gettext('Pay Date (Days After)'),
                                name : 'payDateDaysAfter',
                                allowBlank : false,
                                bind : '{record.payDateDaysAfter}'
                            }
                        ]
                    }
                ]
            },
            {
                xtype : 'criterion_gridview',
                reference : 'periodsList',
                padding : '0 0 30',
                title : i18n.gettext('Periods'),
                bind : {
                    hidden : '{isPhantom}',
                    store : '{payrollSchedulePayrollPeriods}'
                },
                controller : {
                    type : 'criterion_payroll_settings_payroll_schedule_periods',
                    connectParentView : false,
                    editor : {
                        xtype : 'criterion_settings_payroll_schedule_period',
                        plugins : [
                            {
                                ptype : 'criterion_sidebar',
                                modal : true,
                                height : 'auto',
                                width : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_WIDTH
                            }
                        ],
                        draggable : true,
                        modal : true
                    }
                },

                tbar : [
                    {
                        xtype : 'combobox',
                        reference : 'yearCombo',
                        fieldLabel : i18n.gettext('Year'),
                        bind : {
                            store : '{years}',
                            value : '{currentYear}',
                            hidden : '{yearSelectorIsHidden}'
                        },
                        displayField : 'title',
                        valueField : 'id',
                        queryMode : 'local',
                        forceSelection : true,
                        editable : false
                    },
                    '->',
                    {
                        xtype : 'button',
                        text : i18n.gettext('Delete'),
                        cls : 'criterion-btn-remove',
                        listeners : {
                            click : 'handleDeleteClick'
                        },
                        bind : {
                            hidden : '{!yearCombo.selection}'
                        }
                    },
                    {
                        xtype : 'button',
                        text : i18n.gettext('New'),
                        cls : 'criterion-btn-feature',
                        listeners : {
                            click : 'handleAddClick'
                        }
                    }
                ],

                columns : [
                    {
                        xtype : 'gridcolumn',
                        width : criterion.Consts.UI_DEFAULTS.COL_ITEM_WIDTH,
                        text : i18n.gettext('Number'),
                        dataIndex : 'number'
                    },
                    {
                        xtype : 'datecolumn',
                        text : i18n.gettext('Start Date'),
                        flex : 1,
                        dataIndex : 'periodStartDate'
                    },
                    {
                        xtype : 'datecolumn',
                        text : i18n.gettext('End Date'),
                        flex : 1,
                        dataIndex : 'periodEndDate'
                    },
                    {
                        xtype : 'datecolumn',
                        text : i18n.gettext('Pay Date'),
                        flex : 1,
                        dataIndex : 'payDate'
                    }
                ]
            }
        ],

        loadRecord : function(record) {
            this.getViewModel().set('record', record);
            this.callParent(arguments);

            this.getController() && this.getController().handleAfterRecordLoad(record);
        }
    };

});

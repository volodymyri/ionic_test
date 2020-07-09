Ext.define('criterion.view.settings.payroll.ShiftRate', function() {

    return {
        alias : 'widget.criterion_payroll_settings_shift_rate',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.controller.settings.payroll.ShiftRate',

            'criterion.view.settings.payroll.shiftRate.Detail',

            'criterion.store.employeeGroup.ShiftRates',
            'criterion.store.WeekDays'
        ],

        controller : {
            type : 'criterion_payroll_settings_shift_rate',
            externalUpdate : false
        },

        bodyPadding : 0,

        title : i18n.gettext('Shift Rate Details'),

        modelValidation : true,

        viewModel : {
            stores : {
                employeeGroupShiftRates : {
                    type : 'criterion_employee_group_shift_rates'
                },
                weekDays : {
                    type : 'criterion_weekdays'
                }
            },
            formulas : {
                isPhantom : function(data) {
                    return data('record') && data('record').phantom;
                }
            }
        },

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        scrollable : true,

        initComponent : function() {
            var me = this;

            me.items = [
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
                                    allowBlank : false,
                                    bind : {
                                        readOnly : '{!isPhantom}'
                                    },
                                    listeners : {
                                        change : 'handleEmployerChange'
                                    }
                                },
                                {
                                    xtype : 'textfield',
                                    fieldLabel : i18n.gettext('Name'),
                                    name : 'name',
                                    allowBlank : false
                                }
                            ]
                        },
                        {
                            items : [
                                {
                                    xtype : 'criterion_employee_group_combobox',
                                    reference : 'employeeGroupCombo',
                                    objectParam : 'shiftRateId',
                                    bind : {
                                        valuesStore : '{employeeGroupShiftRates}'
                                    }
                                }
                            ]
                        }
                    ]
                },
                // Details
                {
                    xtype : 'criterion_gridview',
                    reference : 'shiftPeriods',
                    flex : 2,
                    title : i18n.gettext('Shift Periods'),
                    bind : {
                        store : '{record.details}'
                    },

                    controller : {
                        type : 'criterion_gridview',
                        connectParentView : false,
                        loadRecordOnEdit : false,
                        editor : {
                            xtype : 'criterion_settings_shift_rate_detail'
                        }
                    },

                    tbar : [
                        {
                            xtype : 'button',
                            text : i18n.gettext('Add'),
                            cls : 'criterion-btn-feature',
                            listeners : {
                                click : 'handleAddClick'
                            }
                        }
                    ],

                    columns : [
                        {
                            xtype : 'gridcolumn',
                            flex : 1,
                            text : i18n.gettext('Name'),
                            dataIndex : 'name'
                        },
                        {
                            xtype : 'gridcolumn',
                            flex : 1,
                            text : i18n.gettext('Days of Week'),
                            dataIndex : 'weekPattern',
                            renderer : function(value) {
                                var weekDaysStore = me.getViewModel().getStore('weekDays'),
                                    weekDaysFirstLetters = [];

                                weekDaysStore.each(function(wdRecord) {
                                    if (!(~value & wdRecord.get('value'))) {
                                        weekDaysFirstLetters.push(wdRecord.get('firstLetter'))
                                    }
                                });

                                return weekDaysFirstLetters.join(', ');
                            }
                        },
                        {
                            xtype : 'timecolumn',
                            flex : 1,
                            text : i18n.gettext('Start Time'),
                            dataIndex : 'startTime'
                        },
                        {
                            xtype : 'timecolumn',
                            flex : 1,
                            text : i18n.gettext('End Time'),
                            dataIndex : 'endTime'
                        },
                        {
                            xtype : 'gridcolumn',
                            flex : 1,
                            text : i18n.gettext('Premium'),
                            dataIndex : 'amount',
                            renderer : function(value, metaData, record) {
                                return record.get('isPercentage') ? Ext.util.Format.percent(value, '0.##') : criterion.LocalizationManager.currencyFormatter(value);
                            }
                        }
                    ]
                }
            ];

            me.callParent(arguments);
        },

        loadRecord : function(record) {
            this.getController() && this.getController().loadRecord(record);
            this.callParent(arguments);
        }
    };

});


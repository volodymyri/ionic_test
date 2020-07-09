Ext.define('criterion.view.settings.system.dataImport.PayrollData', function() {

    return {

        alias : 'widget.criterion_settings_data_import_payroll_data',

        extend : 'criterion.view.settings.system.dataImport.Base',

        requires : [
            'criterion.controller.settings.system.dataImport.PayrollData',
            'criterion.store.employer.payroll.payrollSchedule.PayrollPeriods',
            'criterion.store.employer.payroll.Schedules',
            'criterion.store.employer.payroll.Batches'
        ],

        controller : 'criterion_settings_data_import_payroll_data',

        importURL : criterion.consts.Api.API.PAYROLL_IMPORT_DATA_IMPORT,
        errorsURL : criterion.consts.Api.API.PAYROLL_IMPORT_DATA_ERRORS,
        dataURL : criterion.consts.Api.API.PAYROLL_IMPORT_DATA,
        discrepanciesURL : criterion.consts.Api.API.PAYROLL_IMPORT_DATA_DISCREPANCIES,

        defaults : {
            labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDE_WIDTH,
            minWidth : criterion.Consts.UI_DEFAULTS.FORM_ITEM_WIDTH
        },

        viewModel : {
            data : {
                multiplePeriodImport : false
            },
            stores : {
                employerPayrollPeriodSchedules : {
                    type : 'criterion_employer_payroll_schedules',
                    filters : [
                        {
                            property : 'employerId',
                            value : '{employerId}'
                        }
                    ]
                },
                periods : {
                    type : 'criterion_employer_payroll_payroll_schedule_payroll_periods'
                },
                employerPayrollBatches : {
                    type : 'criterion_employer_payroll_batches'
                }
            }
        },

        listeners : {
            activate : 'handleActivate'
        },

        items : [
            {
                xtype : 'panel',
                layout : 'card',
                itemId : 'actionsCardPanel',
                items : [
                    {
                        xtype : 'criterion_form',
                        bodyPadding : 0,
                        defaults : {
                            labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDE_WIDTH,
                            minWidth : criterion.Consts.UI_DEFAULTS.FORM_ITEM_WIDTH
                        },
                        isImport : true,
                        items : [
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Batch Name'),
                                name : 'batchName',
                                allowBlank : false
                            },
                            {
                                xtype : 'extended_combo',
                                fieldLabel : i18n.gettext('Payroll Schedule'),
                                name : 'payrollScheduleId',
                                reference : 'payrollSchedule',
                                bind : {
                                    store : '{employerPayrollPeriodSchedules}',
                                    value : '{payrollScheduleId}'
                                },
                                displayField : 'name',
                                valueField : 'id',
                                editable : false,
                                allowBlank : false,
                                queryMode : 'local',
                                emptyText : i18n.gettext('Not Selected'),
                                listeners : {
                                    change : 'onPayrollScheduleChange'
                                }
                            },
                            {
                                xtype : 'toggleslidefield',
                                fieldLabel : i18n.gettext('Multiple Period Import'),
                                name : 'multiplePeriodImport',
                                value : false,
                                inputValue : true,
                                bind : {
                                    value : '{multiplePeriodImport}'
                                }
                            },
                            {
                                xtype : 'combo',
                                fieldLabel : i18n.gettext('Pay Period'),
                                name : 'payrollPeriodId',
                                reference : 'payPeriodCombo',
                                bind : {
                                    store : '{periods}',
                                    value : '{payrollPeriodId}',
                                    disabled : '{multiplePeriodImport}',
                                    hidden : '{multiplePeriodImport}'
                                },
                                tpl : Ext.create('Ext.XTemplate',
                                    '<tpl for=".">',
                                    '<div class="x-boundlist-item">{number}, {periodStartDate:date("m/d/Y")} to {periodEndDate:date("m/d/Y")}</div>',
                                    '</tpl>'
                                ),
                                displayTpl : Ext.create('Ext.XTemplate',
                                    '<tpl for=".">',
                                    '{number}, {periodStartDate:date("m/d/Y")} to {periodEndDate:date("m/d/Y")}',
                                    '</tpl>'
                                ),
                                valueField : 'id',
                                editable : false,
                                allowBlank : false,
                                queryMode : 'local',
                                emptyText : i18n.gettext('Not Selected')
                            },
                            {
                                xtype : 'datefield',
                                fieldLabel : i18n.gettext('Pay Date'),
                                submitFormat : criterion.consts.Api.DATE_FORMAT,
                                format : criterion.consts.Api.SHOW_DATE_FORMAT,
                                name : 'payDate',
                                reference : 'payDate',
                                disabled : true,
                                bind : {
                                    value : '{payDate}',
                                    disabled : '{multiplePeriodImport}',
                                    hidden : '{multiplePeriodImport}'
                                },
                                allowBlank : false
                            }
                        ]
                    },
                    {
                        xtype : 'criterion_form',
                        bodyPadding : 0,
                        defaults : {
                            labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDE_WIDTH,
                            minWidth : criterion.Consts.UI_DEFAULTS.FORM_ITEM_WIDTH
                        },
                        isImport : false,
                        items : [
                            {
                                xtype : 'combobox',
                                fieldLabel : i18n.gettext('Batch'),
                                reference : 'payrollBatches',
                                bind : {
                                    store : '{employerPayrollBatches}'
                                },
                                name : 'payrollBatchId',
                                valueField : 'id',
                                displayField : 'name',
                                editable : true,
                                queryMode : 'local',
                                forceSelection : true,
                                allowBlank : false
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Tolerance'),
                                name : 'tolerance',
                                value : '0.01'
                            }
                        ]

                    }
                ]
            }
        ]
    }
});

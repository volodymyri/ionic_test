Ext.define('criterion.view.payroll.batch.Info', function() {

    var DICT = criterion.consts.Dict;

    return {

        alias : 'widget.criterion_payroll_batch_info',

        extend : 'criterion.ux.form.Panel',

        viewModel : {
            data : {
                isPayProcessing : false
            },
            formulas : {
                cycleText : function(data) {
                    return data('batchRecord.isOffCycle') ? i18n.gettext('Off Cycle') : i18n.gettext('On Cycle');
                },
                hidePayrollSchedule : function(data) {
                    return data('isPayProcessing');
                }
            },
            stores : {
                periods : {
                    type : 'criterion_employer_payroll_payroll_schedule_payroll_periods',
                    autoLoad : true // todo refactoring
                },
                payGroups : {
                    type : 'criterion_employer_pay_groups',
                    autoLoad : true
                },
                employerPayrollPeriodSchedule : {
                    type : 'criterion_employer_payroll_schedules',
                    autoLoad : true
                }
            }
        },

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        bodyPadding : 20,

        defaults : {
            labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDER_WIDTH
        },

        initComponent : function() {
            this.items = [
                {
                    xtype : 'label',
                    margin : '0 0 20 0',
                    cls : 'bold',
                    hidden : true,
                    bind : {
                        text : '{cycleText}',
                        hidden : '{isPayProcessing}'
                    }
                },
                {
                    xtype : 'criterion_employer_combo',
                    fieldLabel : i18n.gettext('Employer'),
                    name : 'employerId',
                    allowBlank : false,
                    disabled : true,
                    hideTrigger : true,
                    bind : {
                        value : '{batchRecord.employerId}'
                    }
                },
                {
                    xtype : 'textfield',
                    fieldLabel : i18n.gettext('Name'),
                    disabled : true,
                    bind : {
                        value : '{batchRecord.name}'
                    }
                },
                {
                    xtype : 'extended_combo',
                    fieldLabel : i18n.gettext('Pay Group'),
                    store : this.getViewModel().getStore('payGroups'),
                    bind : {
                        value : '{batchRecord.payGroupId}',
                        hidden : '{isPayProcessing}'
                    },
                    hidden : true,
                    disabled : true,
                    displayField : 'name',
                    valueField : 'id',
                    editable : true,
                    allowBlank : true,
                    hideTrigger : true,
                    queryMode : 'local'
                },
                {
                    xtype : 'criterion_code_detail_field',
                    fieldLabel : i18n.gettext('Special Pay Period'),
                    bind : {
                        value : '{batchRecord.specialPayPeriodCd}',
                        hidden : '{isPayProcessing}'
                    },
                    hidden : true,
                    disabled : true,
                    codeDataId : DICT.SPECIAL_PAY_PERIOD,
                    editable : false,
                    hideTrigger : true
                },
                {
                    xtype : 'criterion_code_detail_field',
                    fieldLabel : i18n.gettext('Supplemental Calculation'),
                    bind : {
                        value : '{batchRecord.taxCalcMethodCd}',
                        hidden : '{isPayProcessing}'
                    },
                    hidden : true,
                    disabled : true,
                    codeDataId : DICT.TAX_CALC_METHOD,
                    editable : false,
                    allowBlank : false,
                    hideTrigger : true
                },
                {
                    xtype : 'extended_combo',
                    fieldLabel : i18n.gettext('Payroll Schedule'),
                    name : 'payrollScheduleId',
                    bind : {
                        store : '{employerPayrollPeriodSchedule}',
                        value : '{batchRecord.payrollScheduleId}',
                        hidden : '{hidePayrollSchedule}'
                    },
                    hidden : true,
                    displayField : 'name',
                    valueField : 'id',
                    editable : false,
                    allowBlank : false,
                    queryMode : 'local',
                    emptyText : i18n.gettext('Not Selected'),
                    disabled : true,
                    hideTrigger : true
                },
                {
                    xtype : 'combobox',
                    reference : 'payPeriodCombo',
                    fieldLabel : i18n.gettext('Pay Period'),
                    store : this.getViewModel().getStore('periods'),
                    bind : {
                        value : '{batchRecord.payrollPeriodId}'
                    },
                    disabled : true,
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
                    allowBlank : true,
                    queryMode : 'local',
                    hideTrigger : true
                },
                {
                    xtype : 'datefield',
                    fieldLabel : i18n.gettext('Pay Date'),
                    bind : {
                        value : '{batchRecord.payDate}'
                    },
                    disabled : true,
                    allowBlank : false,
                    hideTrigger : true
                },
                {
                    xtype : 'textfield',
                    fieldLabel : i18n.gettext('Number of Employees'),
                    disabled : true,
                    bind : {
                        value : '{batchSummary.numberOfEmployees}'
                    }
                }
            ];

            this.callParent(arguments);
        }

    }
});

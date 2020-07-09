Ext.define('criterion.view.settings.payroll.CertifiedRateDetail', function() {

    return {
        alias : 'widget.criterion_payroll_settings_certified_rate_detail',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.controller.settings.payroll.CertifiedRateDetail'
        ],

        plugins : [
            {
                ptype : 'criterion_sidebar',
                width : criterion.Consts.UI_DEFAULTS.MODAL_NARROW_WIDTH,
                height : 'auto',
                modal : true
            }
        ],

        viewModel : {
            formulas : {
                isBase : function(data) {
                    return data('record.rateType') === criterion.Consts.CERTIFIED_RATE_DETAIL_TYPE.BASE.value;
                },
                isDeduction : function(data) {
                    return data('record.rateType') === criterion.Consts.CERTIFIED_RATE_DETAIL_TYPE.DEDUCTION.value;
                },
                isIncomes : function(data) {
                    return data('record.rateType') === criterion.Consts.CERTIFIED_RATE_DETAIL_TYPE.INCOME.value;
                },
                notDeductionAndPercent : data => {
                    let isDeduction = data('isDeduction');

                    if (!isDeduction) {
                        return true;
                    } else {
                        return data('record.deductionCalcMethodIsPercent')
                    }
                },
                notDeductionAndNotPercent : function(data) {
                    let isDeduction = data('isDeduction');

                    if (!isDeduction) {
                        return true;
                    } else {
                        return !data('record.deductionCalcMethodIsPercent')
                    }
                },
            }
        },

        controller : {
            type : 'criterion_payroll_settings_certified_rate_detail',
            externalUpdate : true
        },

        title : i18n.gettext('Detail'),

        allowDelete : true,

        modal : true,

        items : [
            {
                xtype : 'combobox',
                fieldLabel : i18n.gettext('Position'),
                reference : 'positionField',
                bind : {
                    store : '{employerPositions}',
                    value : '{record.positionId}'
                },
                allowBlank : false,
                displayField : 'title',
                valueField : 'id',
                queryMode : 'local',
                listeners : {
                    change : 'handlePositionChange'
                }
            },
            {
                xtype : 'combobox',
                fieldLabel : i18n.gettext('Type'),
                store : Ext.create('Ext.data.Store', {
                    fields : ['value', 'text'],
                    data : Ext.Object.getValues(criterion.Consts.CERTIFIED_RATE_DETAIL_TYPE)
                }),
                bind : {
                    value : '{record.rateType}'
                },
                valueField : 'value',
                displayField : 'text',
                queryMode : 'local',
                forceSelection : true,
                editable : false,
                autoSelect : true,
                allowBlank : false,
                listeners : {
                    change : 'handleRateTypeChange'
                }
            },
            {
                xtype : 'criterion_currencyfield',
                fieldLabel : i18n.gettext('Rate'),
                hidden : true,
                bind : {
                    value : '{record.rate}',
                    hidden : '{!isBase && !isIncomes}'
                }
            },

            // income
            {
                xtype : 'combobox',
                fieldLabel : i18n.gettext('Income'),
                hidden : true,
                disabled : true,
                bind : {
                    store : '{incomes}',
                    value : '{record.incomeListId}',
                    hidden : '{!isIncomes}',
                    disabled : '{!isIncomes}'
                },
                valueField : 'id',
                displayField : 'description',
                queryMode : 'local',
                forceSelection : true,
                editable : false,
                autoSelect : true,
                allowBlank : false,
                listeners : {
                    change : 'handleIncomeChange'
                }
            },

            // deduction
            {
                xtype : 'combobox',
                fieldLabel : i18n.gettext('Deduction'),
                hidden : true,
                disabled : true,
                bind : {
                    store : '{certifiedRateDeductions}',
                    value : '{record.deductionId}',
                    hidden : '{!isDeduction}',
                    disabled : '{!isDeduction}'
                },
                valueField : 'id',
                displayField : 'description',
                queryMode : 'local',
                forceSelection : true,
                editable : false,
                autoSelect : true,
                allowBlank : false,
                listeners : {
                    change : 'handleDeductionChange'
                }
            },
            {
                xtype : 'criterion_currencyfield',
                fieldLabel : i18n.gettext('Employee Amount'),
                hidden : true,
                bind : {
                    value : '{record.employeeAmount}',
                    hidden : '{notDeductionAndPercent}'
                }
            },
            {
                xtype : 'criterion_currencyfield',
                fieldLabel : i18n.gettext('Employer Amount'),
                hidden : true,
                bind : {
                    value : '{record.employerAmount}',
                    hidden : '{notDeductionAndPercent}'
                }
            },
            {
                xtype : 'criterion_percentagefield',
                fieldLabel : i18n.gettext('Employee Amount'),
                hidden : true,
                bind : {
                    value : '{record.employeeAmount}',
                    hidden : '{notDeductionAndNotPercent}'
                }
            },
            {
                xtype : 'criterion_percentagefield',
                fieldLabel : i18n.gettext('Employer Amount'),
                hidden : true,
                bind : {
                    value : '{record.employerAmount}',
                    hidden : '{notDeductionAndNotPercent}'
                }
            }
        ]
    }
});

Ext.define('criterion.view.employee.payroll.form.IncomeForm', function() {

    return {
        alias : 'widget.criterion_employee_payroll_income_form',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.controller.employee.payroll.IncomeForm',
            'criterion.store.employer.IncomeLists'
        ],

        controller : {
            type : 'criterion_employee_payroll_income_form',
            externalUpdate : false
        },

        plugins : [
            {
                ptype : 'criterion_sidebar',
                height : '100%',
                modal : false
            }
        ],

        title : i18n.gettext('Income'),

        viewModel : {
            data : {
                record : null,
                selectedIncomeList : null
            },
            stores : {
                incomeListsStore : {
                    type : 'employer_income_lists'
                }
            },

            formulas : {
                submitBtnText : function(vmGet) {
                    return vmGet('record') && vmGet('record').phantom ? 'Save' : 'Update';
                },

                hideSave : function(data) {
                    return !this.get(criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.EMPLOYEE_INCOMES, criterion.SecurityManager.UPDATE, false, true));
                },

                hideDelete : function(data) {
                    return data('hideDeleteInt') || !this.get(criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.EMPLOYEE_INCOMES, criterion.SecurityManager.DELETE, false, true));
                },

                isIncomeFormulaType : function(data) {
                    return data('selectedIncomeList.incomeCalcMethodCode') === criterion.Consts.INCOME_CALC_METHOD.FORMULA;
                }
            }
        },

        modelValidation : true,

        defaults : {
            xtype : 'criterion_panel',
            layout : 'hbox',

            plugins : [
                'criterion_responsive_column'
            ],

            defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER
        },

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        autoScroll : true,

        items : [
            {
                bodyPadding : '0 0 10',

                items : [
                    {
                        items : [
                            {
                                xtype : 'combobox',
                                reference : 'incomeTypeCombo',
                                bind : {
                                    value : '{record.incomeListId}',
                                    selection : '{selectedIncomeList}',
                                    store : '{incomeListsStore}',
                                    readOnly : '{!isPhantom}'
                                },
                                fieldLabel : i18n.gettext('Income Code'),
                                displayField : 'code',
                                valueField : 'id',
                                queryMode : 'local',
                                forceSelection : true,
                                listeners : {
                                    change : 'handleIncomeListChange'
                                }
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Description'),
                                readOnly : true,
                                bind : '{record.incomeListDescription}'
                            },
                            {
                                xtype : 'criterion_currencyfield',
                                fieldLabel : i18n.gettext('Amount'),
                                hidden : true,
                                disabled : true,
                                bind : {
                                    value : '{record.amount}',
                                    hidden : '{isIncomeFormulaType}',
                                    disabled : '{isIncomeFormulaType}'
                                }
                            },
                            {
                                xtype : 'criterion_percentagefield',
                                fieldLabel : i18n.gettext('Amount'),
                                decimalPrecision : 6,
                                hidden : true,
                                disabled : true,
                                bind : {
                                    value : '{record.amount}',
                                    hidden : '{!isIncomeFormulaType}',
                                    disabled : '{!isIncomeFormulaType}'
                                }
                            }
                        ]
                    },
                    {
                        items : [
                            {
                                xtype : 'toggleslidefield',
                                fieldLabel : i18n.gettext('Show In Timesheet'),
                                hidden : true,
                                disabled : true,
                                bind : {
                                    value : '{record.showInTimesheet}',
                                    hidden : '{isIncomeFormulaType}',
                                    disabled : '{isIncomeFormulaType}'
                                }
                            },
                            {
                                xtype : 'datefield',
                                name : 'effectiveDate',
                                vtype : 'daterange',
                                allowBlank : false,
                                fieldLabel : i18n.gettext('Effective Date'),
                                width : '100%',
                                endDateField : 'expirationDate',
                                bind : '{record.effectiveDate}'
                            },
                            {
                                xtype : 'datefield',
                                name : 'expirationDate',
                                vtype : 'daterange',
                                fieldLabel : i18n.gettext('Expiration Date'),
                                width : '100%',
                                startDateField : 'effectiveDate',
                                bind : '{record.expirationDate}'
                            }
                        ]
                    }
                ]
            }
        ],

        loadRecord : function(record) {
            this.getController() && this.getController().loadRecord(record);
        }
    };

});

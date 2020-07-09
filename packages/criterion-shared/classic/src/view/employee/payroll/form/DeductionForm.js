Ext.define('criterion.view.employee.payroll.form.DeductionForm', function() {

    const DEDUCTION_CALC_METHOD_CODES = criterion.Consts.DEDUCTION_CALC_METHOD_CODES,
        CONTRIBUTION_TYPE = criterion.Consts.CONTRIBUTION_TYPE;

    return {
        alias : 'widget.criterion_employee_payroll_form_deduction',

        extend : 'criterion.view.FormView',

        title : i18n.gettext('Deduction'),

        requires : [
            'criterion.controller.employee.payroll.form.DeductionForm',
            'criterion.store.employer.Deductions',
            'criterion.store.DeductionFrequencies',
            'criterion.store.employer.BankAccounts'
        ],

        controller : {
            type : 'criterion_employee_payroll_form_deduction',
            externalUpdate : false
        },

        viewModel : {
            stores : {
                employerDeductions : {
                    type : 'employer_deductions'
                },
                deductionFrequencies : {
                    type : 'criterion_deduction_frequencies'
                },
                employerBankAccounts : {
                    type : 'employer_bank_accounts'
                }
            },
            formulas : {
                hideEmployeeType : data => {
                    let contributionType = data('record.contributionTypeCode');

                    return !contributionType || contributionType === CONTRIBUTION_TYPE.ER
                },
                hideEmployerType : data => {
                    let contributionType = data('record.contributionTypeCode');

                    return !contributionType || contributionType === CONTRIBUTION_TYPE.EE
                },
                employerMatchEnabled : data => {
                    let deductionCalcMethodCode = data('record.deductionCalcMethodCode');

                    return deductionCalcMethodCode && Ext.Array.contains([
                        DEDUCTION_CALC_METHOD_CODES.AMOUNT_MATCH,
                        DEDUCTION_CALC_METHOD_CODES.PERCENT_OF_GROSS_MATCH
                    ], deductionCalcMethodCode);
                },
                employeeAmountIsPercentEnabled : data => {
                    let deductionCalcMethodCode = data('record.deductionCalcMethodCode');

                    return deductionCalcMethodCode && !data('hideEmployeeType') && Ext.Array.contains([
                        DEDUCTION_CALC_METHOD_CODES.PERCENT_OF_GROSS,
                        DEDUCTION_CALC_METHOD_CODES.PERCENT_OF_GROSS_MATCH,
                        DEDUCTION_CALC_METHOD_CODES.CERTIFIED_RATE_PERCENT
                    ], deductionCalcMethodCode);
                },
                employeeAmountIsNotPercentEnabled : data => {
                    let deductionCalcMethodCode = data('record.deductionCalcMethodCode');

                    return deductionCalcMethodCode && !data('hideEmployeeType') && Ext.Array.contains([
                        DEDUCTION_CALC_METHOD_CODES.AMOUNT,
                        DEDUCTION_CALC_METHOD_CODES.AMOUNT_MATCH,
                        DEDUCTION_CALC_METHOD_CODES.FORMULA,
                        DEDUCTION_CALC_METHOD_CODES.CERTIFIED_RATE,
                        DEDUCTION_CALC_METHOD_CODES.CERTIFIED_RATE_AMOUNT
                    ], deductionCalcMethodCode);
                },
                employerAmountIsPercentEnabled : data => {
                    let deductionCalcMethodCode = data('record.deductionCalcMethodCode');

                    return deductionCalcMethodCode && !data('hideEmployerType') && Ext.Array.contains([
                        DEDUCTION_CALC_METHOD_CODES.PERCENT_OF_GROSS,
                        DEDUCTION_CALC_METHOD_CODES.CERTIFIED_RATE_PERCENT
                    ], deductionCalcMethodCode);
                },
                employerAmountIsFormulaEnabled : data => {
                    let deductionCalcMethodCode = data('record.deductionCalcMethodCode');

                    return deductionCalcMethodCode && !data('hideEmployerType') && deductionCalcMethodCode === DEDUCTION_CALC_METHOD_CODES.FORMULA;
                },
                employerAmountIsCurrencyEnabled : data => {
                    let deductionCalcMethodCode = data('record.deductionCalcMethodCode');

                    return deductionCalcMethodCode && !data('hideEmployerType') && Ext.Array.contains([
                        DEDUCTION_CALC_METHOD_CODES.AMOUNT,
                        DEDUCTION_CALC_METHOD_CODES.CERTIFIED_RATE,
                        DEDUCTION_CALC_METHOD_CODES.CERTIFIED_RATE_AMOUNT
                    ], deductionCalcMethodCode);
                },
                hideArrearAmount : data => {
                    let deductionId = data('record.deductionId'),
                        employerDeductions = data('employerDeductions'),
                        employerDeduction = deductionId && employerDeductions && employerDeductions.getById(deductionId);

                    return employerDeduction ? !employerDeduction.get('isAutoMakeup') : true;
                },
                isGarnishment : data => data('record.deductionCalcMethodCode') === DEDUCTION_CALC_METHOD_CODES.GARNISHMENT,
                hideSave : function(data) {
                    return !this.get(criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.EMPLOYEE_DEDUCTIONS, criterion.SecurityManager.UPDATE, false, true));
                },
                hideDelete : function(data) {
                    return data('hideDeleteInt') || !this.get(criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.EMPLOYEE_DEDUCTIONS, criterion.SecurityManager.DELETE, false, true));
                },
                isInPoolFlag : data => data('isInPool')
            },
            data : {
                employeeGarnishment : null,
                isInPool : false
            }
        },

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

        modelValidation : true,

        items : [
            {
                bodyPadding : '0 0 10',

                items : [
                    {
                        items : [
                            {
                                xtype : 'combobox',
                                reference : 'deductionCombo',
                                fieldLabel : i18n.gettext('Deduction List'),
                                displayField : 'code',
                                valueField : 'id',
                                width : '100%',
                                allowBlank : false,
                                editable : false,
                                queryMode : 'local',
                                hidden : true,
                                disabled : true,
                                bind : {
                                    store : '{employerDeductions}',
                                    visible : '{isPhantom}',
                                    disabled : '{!isPhantom}',
                                    value : '{record.deductionId}'
                                },
                                listeners : {
                                    change : 'handleChangeDeduction'
                                }
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Code'),
                                disabled : true,
                                width : '100%',
                                hidden : true,
                                bind : {
                                    hidden : '{isPhantom}',
                                    value : '{deductionCombo.selection.code}'
                                }
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Description'),
                                disabled : true,
                                width : '100%',
                                bind : {
                                    value : '{deductionCombo.selection.description}'
                                }
                            },
                            {
                                xtype : 'criterion_code_detail_field',
                                fieldLabel : i18n.gettext('Calculation Method'),
                                name : 'deductionCalcMethodCd',
                                allowBlank : false,
                                codeDataId : criterion.consts.Dict.DEDUCTION_CALC_METHOD,
                                readOnly : true,
                                bind : {
                                    value : '{record.deductionCalcMethodCd}'
                                },
                                listeners : {
                                    // this field is readonly but the change event is used!
                                    change : 'handleDeductionCalcMethodChange'
                                }
                            }
                        ]
                    },
                    {
                        items : [
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
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Account Number'),
                                width : '100%',
                                bind : {
                                    value : '{record.accountNumber}'
                                }
                            }
                        ]
                    }
                ]
            },
            {
                border : true,
                bodyStyle : {
                    'border-width' : '1px 0 0 0 !important'
                },

                bodyPadding : '10 0 0',

                items : [
                    {
                        items : [
                            {
                                xtype : 'combobox',
                                fieldLabel : i18n.gettext('Frequency'),
                                displayField : 'description',
                                valueField : 'id',
                                width : '100%',
                                disabled : true,
                                queryMode : 'local',
                                bind : {
                                    store : '{deductionFrequencies}',
                                    value : '{deductionCombo.selection.deductionFrequencyId}'
                                }
                            },
                            {
                                xtype : 'criterion_percentagefield',
                                flex : 1,
                                maxValue : 1,
                                fieldLabel : i18n.gettext('Employee Contribution'),
                                name : 'employeeAmountFloat',
                                hidden : true,
                                decimalPrecision : 5,
                                bind : {
                                    value : '{record.employeeAmountFloat}',
                                    hidden : '{!employeeAmountIsPercentEnabled}',
                                    disabled : '{!employeeAmountIsPercentEnabled}'
                                },
                                listeners : {
                                    change : 'handleEmployeeAmountChange'
                                }
                            },
                            {
                                xtype : 'criterion_percentagefield',
                                flex : 1,
                                maxValue : 1,
                                fieldLabel : i18n.gettext('Employer Contribution'),
                                name : 'employerAmountFloat',
                                hidden : true,
                                decimalPrecision : 5,
                                disabled : true,
                                bind : {
                                    value : '{record.employerAmountFloat}',
                                    hidden : '{!employerAmountIsPercentEnabled}',
                                    disabled : '{!employerAmountIsPercentEnabled}'
                                },
                                listeners : {
                                    change : 'handleEmployerAmountChange'
                                }
                            },
                            {
                                xtype : 'criterion_currencyfield',
                                name : 'employeeAmountFloat',
                                fieldLabel : i18n.gettext('Employee Contribution'),
                                width : '100%',
                                bind : {
                                    value : '{record.employeeAmountFloat}',
                                    hidden : '{!employeeAmountIsNotPercentEnabled}',
                                    disabled : '{!employeeAmountIsNotPercentEnabled}'
                                },
                                listeners : {
                                    change : 'handleEmployeeAmountChange'
                                }
                            },
                            {
                                xtype : 'textfield',
                                name : 'employeeAmount',
                                fieldLabel : i18n.gettext('Employee Contribution'),
                                width : '100%',
                                hidden : true,
                                bind : {
                                    value : '{record.employeeAmount}',
                                    hidden : '{!isGarnishment}',
                                    disabled : '{!isGarnishment}'
                                }
                            },
                            {
                                xtype : 'criterion_currencyfield',
                                name : 'employerAmountFloat',
                                fieldLabel : i18n.gettext('Employer Contribution'),
                                width : '100%',
                                disabled : true,
                                bind : {
                                    value : '{record.employerAmountFloat}',
                                    hidden : '{!employerAmountIsCurrencyEnabled}',
                                    disabled : '{!employerAmountIsCurrencyEnabled}'
                                },
                                listeners : {
                                    change : 'handleEmployerAmountChange'
                                }
                            },
                            {
                                xtype : 'textfield',
                                name : 'employerAmount',
                                fieldLabel : i18n.gettext('Employer Contribution'),
                                width : '100%',
                                bind : {
                                    value : '{record.employerAmount}',
                                    hidden : '{!employerAmountIsFormulaEnabled}',
                                    disabled : '{!employerAmountIsFormulaEnabled}'
                                }
                            },
                            {
                                xtype : 'textfield',
                                name : 'employerMatch',
                                fieldLabel : i18n.gettext('Employer Match'),
                                width : '100%',
                                hidden : true,
                                bind : {
                                    value : '{record.employerMatch}',
                                    hidden : '{!employerMatchEnabled}',
                                    disabled : '{!employerMatchEnabled}'
                                }
                            },
                            {
                                xtype : 'criterion_currencyfield',
                                name : 'arrearAmount',
                                fieldLabel : i18n.gettext('Arrear Amount'),
                                width : '100%',
                                hidden : true,
                                bind : {
                                    value : '{record.arrearAmount}',
                                    hidden : '{hideArrearAmount}'
                                }
                            }
                        ]
                    },
                    {
                        items : [
                            {
                                xtype : 'criterion_code_detail_field',
                                fieldLabel : i18n.gettext('Limit Per'),
                                codeDataId : criterion.consts.Dict.DEDUCTION_LIMIT,
                                bind : {
                                    value : '{record.deductionLimitCd}',
                                    readOnly : '{isInPoolFlag}'
                                }
                            },
                            {
                                xtype : 'textfield',
                                name : 'employeeLimit',
                                fieldLabel : i18n.gettext('Employee Limit'),
                                bind : {
                                    value : '{record.employeeLimit}',
                                    hidden : '{hideEmployeeType}',
                                    disabled : '{hideEmployeeType}',
                                    readOnly : '{isInPoolFlag}'
                                }
                            },
                            {
                                xtype : 'textfield',
                                name : 'employerLimit',
                                fieldLabel : i18n.gettext('Employer Limit'),
                                bind : {
                                    value : '{record.employerLimit}',
                                    hidden : '{hideEmployerType}',
                                    disabled : '{hideEmployerType}',
                                    readOnly : '{isInPoolFlag}'
                                }
                            }
                        ]
                    }
                ]
            },
            {
                border : true,
                bodyStyle : {
                    'border-width' : '1px 0 0 0 !important'
                },

                title : i18n.gettext('Garnishment'),

                bodyPadding : '10 0 0',

                hidden : true,

                bind : {
                    hidden : '{!isGarnishment}',
                    disabled : '{!isGarnishment}'
                },

                items : [
                    {
                        items : [
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Case Number'),
                                bind : '{employeeGarnishment.caseNumber}',
                                maxLength : 20
                            },
                            {
                                xtype : 'criterion_code_detail_field',
                                fieldLabel : i18n.gettext('Lien Type'),
                                codeDataId : criterion.consts.Dict.GARNISHMENT_LIEN_TYPE,
                                bind : '{employeeGarnishment.garnishmentLienTypeCd}'
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Fips Code'),
                                bind : '{employeeGarnishment.fipsCode}',
                                maxLength : 7
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Memo'),
                                bind : '{employeeGarnishment.memo}',
                                maxLength : 40
                            }
                        ]
                    },
                    {
                        items : [
                            {
                                xtype : 'criterion_code_detail_field',
                                fieldLabel : i18n.gettext('Jurisdiction State'),
                                codeDataId : criterion.consts.Dict.STATE,
                                bind : '{employeeGarnishment.jurisdictionStateCd}'
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Jurisdiction County'),
                                bind : '{employeeGarnishment.jurisdictionCounty}',
                                maxLength : 22
                            },
                            {
                                xtype : 'combo',
                                fieldLabel : i18n.gettext('Bank Account'),
                                bind : {
                                    store : '{employerBankAccounts}',
                                    value : '{employeeGarnishment.employerBankAccountId}'
                                },
                                displayField : 'name',
                                valueField : 'id',
                                queryMode : 'local'
                            }
                        ]
                    }
                ]
            },
            {
                border : true,
                bodyStyle : {
                    'border-width' : '1px 0 0 0 !important'
                },

                title : i18n.gettext('Payee'),

                bodyPadding : '10 0 0',

                hidden : true,

                bind : {
                    hidden : '{!isGarnishment}',
                    disabled : '{!isGarnishment}'
                },

                items : [
                    {
                        items : [
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Payee Name'),
                                bind : '{employeeGarnishment.payeeName}',
                                maxLength : 30
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Alternate Name'),
                                bind : '{employeeGarnishment.payeeNameAlternate}',
                                maxLength : 30
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Address 1'),
                                bind : '{employeeGarnishment.payeeAddress1}',
                                maxLength : 30
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Address 2'),
                                bind : '{employeeGarnishment.payeeAddress2}',
                                maxLength : 30
                            }
                        ]
                    },
                    {
                        items : [
                            {
                                xtype : 'criterion_code_detail_field',
                                fieldLabel : i18n.gettext('Payee Code'),
                                codeDataId : criterion.consts.Dict.GARNISHMENT_PAYEE,
                                bind : '{employeeGarnishment.garnishmentPayeeCd}'
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('City'),
                                bind : '{employeeGarnishment.payeeCity}',
                                maxLength : 22
                            },
                            {
                                xtype : 'criterion_code_detail_field',
                                fieldLabel : i18n.gettext('State'),
                                codeDataId : criterion.consts.Dict.STATE,
                                bind : '{employeeGarnishment.payeeStateCd}'
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Zip Code'),
                                bind : '{employeeGarnishment.payeePostalCode}',
                                maxLength : 25
                            }
                        ]
                    }
                ]
            },
            {
                border : true,
                bodyStyle : {
                    'border-width' : '1px 0 0 0 !important'
                },

                title : i18n.gettext('Obligee'),

                bodyPadding : '10 0 0',

                hidden : true,

                bind : {
                    hidden : '{!isGarnishment}',
                    disabled : '{!isGarnishment}'
                },

                items : [
                    {
                        items : [
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('First Name'),
                                bind : '{employeeGarnishment.obligeeFirstName}',
                                maxLength : 50
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Middle Name'),
                                bind : '{employeeGarnishment.obligeeMiddleName}',
                                maxLength : 50
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Last Name'),
                                bind : '{employeeGarnishment.obligeeLastName}',
                                maxLength : 50
                            }
                        ]
                    },
                    {
                        items : [
                            {
                                xtype : 'criterion_field_ssn',
                                fieldLabel : i18n.gettext('Social Security Number'),
                                bind : '{employeeGarnishment.obligeeNationalIdentifier}',
                                maxLength : 50
                            }
                        ]
                    }
                ]
            }
        ],

        loadRecord : function(record) {
            this.lookupController().load(record);
        }
    }
});

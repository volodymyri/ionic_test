Ext.define('criterion.view.settings.benefits.Deduction', function() {

    const DEDUCTION_CALC_METHOD_CODES = criterion.Consts.DEDUCTION_CALC_METHOD_CODES,
        CONTRIBUTION_TYPE = criterion.Consts.CONTRIBUTION_TYPE;

    return {
        alias : 'widget.criterion_settings_deduction',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.store.TeDeductions',
            'criterion.store.DeductionFrequencies',
            'criterion.store.employer.DeductionLabels',
            'criterion.controller.settings.benefits.Deduction'
        ],

        controller : {
            type : 'criterion_settings_deduction',
            externalUpdate : false
        },

        bodyPadding : 0,

        title : i18n.gettext('Deduction Details'),

        viewModel : {
            data : {
                isInPool : false,
                pooledParent : null
            },
            stores : {
                teDeductions : {
                    type : 'criterion_te_deductions',
                    autoLoad : true
                },
                deductionFrequencies : {
                    type : 'criterion_deduction_frequencies',
                    autoLoad : true,
                    proxy : {
                        extraParams : {
                            isActive : true
                        }
                    }
                },
                employerDeductionLabels : {
                    type : 'criterion_employer_deduction_labels'
                },
                employerDeductions : {
                    type : 'employer_deductions'
                },
                employerDeductionsPoolWithoutParent : {
                    type : 'employer_deductions'
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
                contributionTypeFilters : data => data('record.deductionCalcMethodCode') === DEDUCTION_CALC_METHOD_CODES.GARNISHMENT ? [
                    function(contributionType) {
                        return contributionType.data('code') === CONTRIBUTION_TYPE.EE;
                    }
                ] : [],
                isGarnishment : data => data('record.deductionCalcMethodCode') === DEDUCTION_CALC_METHOD_CODES.GARNISHMENT,
                hasPooledParent : data => data('pooledParent') || data('record.poolParentDeductionId')
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

        items : [
            {
                bodyPadding : '0 10 10',

                items : [
                    {
                        defaults : {
                            height : criterion.Consts.UI_DEFAULTS.FORM_ITEM_HEIGHT,
                            labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDER_WIDTH
                        },
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
                                name : 'code',
                                fieldLabel : i18n.gettext('Code'),
                                allowBlank : false,
                                width : '100%'
                            },
                            {
                                xtype : 'textfield',
                                name : 'description',
                                fieldLabel : i18n.gettext('Description'),
                                allowBlank : false,
                                width : '100%'
                            },
                            {
                                xtype : 'extended_combobox',
                                name : 'teDeductionId',
                                bind : {
                                    store : '{teDeductions}'
                                },
                                fieldLabel : i18n.gettext('Deduction Type'),
                                displayField : 'plan',
                                valueField : 'id',
                                width : '100%',
                                allowBlank : false,
                                queryMode : 'local',
                                editable : false
                            },
                            {
                                xtype : 'criterion_code_detail_field',
                                fieldLabel : i18n.gettext('Pay Type'),
                                reference : 'payTypeCombo',
                                codeDataId : criterion.consts.Dict.PAY_TYPE,
                                listeners : {
                                    codedetailsLoaded : function() {
                                        this.setFilterValues({
                                            attribute : 'attribute2',
                                            value : '1'
                                        })
                                    }
                                },
                                name : 'payTypeCd',
                                allowBlank : false
                            },
                            {
                                xtype : 'criterion_employer_labels_combobox',
                                reference : 'employerDeductionLabelsCombo',
                                objectParam : 'deductionId',
                                bind : {
                                    valuesStore : '{employerDeductionLabels}'
                                }
                            },
                            {
                                xtype : 'numberfield',
                                name : 'priority',
                                fieldLabel : i18n.gettext('Priority'),
                                width : '100%'
                            },
                            {
                                xtype : 'combobox',
                                fieldLabel : i18n.gettext('Start After'),
                                displayField : 'code',
                                valueField : 'id',
                                width : '100%',
                                editable : true,
                                queryMode : 'local',
                                bind : {
                                    store : '{employerDeductions}',
                                    value : '{record.startAfterDeductionId}'
                                }
                            }
                        ]
                    },
                    {
                        defaults : {
                            height : criterion.Consts.UI_DEFAULTS.FORM_ITEM_HEIGHT,
                            labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDER_WIDTH
                        },
                        items : [
                            {
                                xtype : 'toggleslidefield',
                                inputValue : true,
                                fieldLabel : i18n.gettext('Active'),
                                name : 'isActive'
                            },
                            {
                                xtype : 'toggleslidefield',
                                inputValue : true,
                                fieldLabel : i18n.gettext('Auto Makeup'),
                                name : 'isAutoMakeup'
                            },
                            {
                                xtype : 'toggleslidefield',
                                inputValue : true,
                                fieldLabel : i18n.gettext('Show Employee'),
                                name : 'isShowEmployee'
                            },
                            {
                                xtype : 'toggleslidefield',
                                inputValue : true,
                                fieldLabel : i18n.gettext('Use In Off Cycle'),
                                name : 'isUseInOffCycle'
                            },
                            {
                                xtype : 'toggleslidefield',
                                inputValue : true,
                                fieldLabel : i18n.gettext('Pool'),
                                name : 'isPool',
                                bind : '{isInPool}',
                            },
                            {
                                xtype : 'criterion_code_detail_field',
                                fieldLabel : i18n.gettext('Show Cost'),
                                name : 'costVisibilityCd',
                                codeDataId : criterion.consts.Dict.COST_VISIBILITY,
                                bind : '{record.costVisibilityCd}'
                            },
                            {
                                xtype : 'criterion_code_detail_field',
                                fieldLabel : i18n.gettext('Calculation Method'),
                                name : 'deductionCalcMethodCd',
                                allowBlank : false,
                                codeDataId : criterion.consts.Dict.DEDUCTION_CALC_METHOD,
                                bind : '{record.deductionCalcMethodCd}',
                                listeners : {
                                    change : 'handleDeductionCalcMethodChange'
                                }
                            },
                            {
                                xtype : 'criterion_code_detail_field',
                                reference : 'contributionTypeCombo',
                                fieldLabel : i18n.gettext('Contribution Type'),
                                name : 'contributionTypeCd',
                                allowBlank : false,
                                codeDataId : criterion.consts.Dict.CONTRIBUTION_TYPE,
                                bind : {
                                    value : '{record.contributionTypeCd}',
                                    filters : '{contributionTypeFilters}'
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

                bodyPadding : '10 10 0',

                items : [
                    {
                        items : [
                            {
                                xtype : 'extended_combobox',
                                name : 'deductionFrequencyId',
                                bind : {
                                    store : '{deductionFrequencies}'
                                },
                                fieldLabel : i18n.gettext('Frequency'),
                                displayField : 'description',
                                valueField : 'id',
                                width : '100%',
                                queryMode : 'local',
                                allowBlank : false,
                                editable : false
                            },
                            // percent
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
                                    change : 'handleEmployeeContributionPercentChange'
                                }
                            },
                            {
                                xtype : 'criterion_percentagefield',
                                flex : 1,
                                maxValue : 1,
                                fieldLabel : i18n.gettext('Employer Contribution'),
                                name : 'employerAmountFloat',
                                hidden : true,
                                disabled : true,
                                decimalPrecision : 5,
                                bind : {
                                    value : '{record.employerAmountFloat}',
                                    hidden : '{!employerAmountIsPercentEnabled}',
                                    disabled : '{!employerAmountIsPercentEnabled}'
                                },
                                listeners : {
                                    change : 'handleEmployerContributionPercentChange'
                                }
                            },
                            // amount
                            {
                                xtype : 'criterion_currencyfield',
                                name : 'employeeAmountFloat',
                                fieldLabel : i18n.gettext('Employee Contribution'),
                                width : '100%',
                                hidden : false,
                                bind : {
                                    value : '{record.employeeAmountFloat}',
                                    hidden : '{!employeeAmountIsNotPercentEnabled}',
                                    disabled : '{!employeeAmountIsNotPercentEnabled}'
                                },
                                listeners : {
                                    change : 'handleEmployeeContributionAmountChange'
                                }
                            },
                            {
                                xtype : 'criterion_currencyfield',
                                name : 'employerAmountFloat',
                                fieldLabel : i18n.gettext('Employer Contribution'),
                                width : '100%',
                                hidden : true,
                                disabled : true,
                                bind : {
                                    value : '{record.employerAmountFloat}',
                                    hidden : '{!employerAmountIsCurrencyEnabled}',
                                    disabled : '{!employerAmountIsCurrencyEnabled}'
                                },
                                listeners : {
                                    change : 'handleEmployerContributionAmountChange'
                                }
                            },
                            // Garnishment
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
                                xtype : 'textfield',
                                name : 'employerAmount',
                                fieldLabel : i18n.gettext('Employer Contribution'),
                                width : '100%',
                                hidden : false,
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
                            }
                        ]
                    },
                    {
                        items : [
                            {
                                xtype : 'criterion_code_detail_field',
                                fieldLabel : i18n.gettext('Limit Per'),
                                name : 'deductionLimitCd',
                                allowBlank : false,
                                codeDataId : criterion.consts.Dict.DEDUCTION_LIMIT
                            },
                            {
                                xtype : 'textfield',
                                name : 'employeeLimit',
                                fieldLabel : i18n.gettext('Employee Limit'),
                                width : '100%',
                                readOnly : false,
                                bind : {
                                    hidden : '{hideEmployeeType}',
                                    disabled : '{hideEmployeeType}',
                                    readOnly : '{hasPooledParent}'
                                }
                            },
                            {
                                xtype : 'textfield',
                                name : 'employerLimit',
                                fieldLabel : i18n.gettext('Employer Limit'),
                                width : '100%',
                                readOnly : false,
                                bind : {
                                    hidden : '{hideEmployerType}',
                                    disabled : '{hideEmployerType}',
                                    readOnly : '{hasPooledParent}'
                                }
                            },
                            {
                                xtype : 'combobox',
                                fieldLabel : i18n.gettext('Pooled Parent'),
                                displayField : 'code',
                                valueField : 'id',
                                width : '100%',
                                editable : true,
                                queryMode : 'local',
                                hidden : true,
                                bind : {
                                    store : '{employerDeductionsPoolWithoutParent}',
                                    hidden : '{!isInPool}',
                                    value : '{record.poolParentDeductionId}'
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    };

});


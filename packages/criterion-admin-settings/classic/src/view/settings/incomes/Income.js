Ext.define('criterion.view.settings.incomes.Income', function() {

    var DICT = criterion.consts.Dict,
        INCOME_CALC_METHOD = criterion.Consts.INCOME_CALC_METHOD;

    var getValueByCode = function(val, dic) {
        return val ? criterion.CodeDataManager.getValue(val, dic, 'code') : null;
    };

    return {

        alias : 'widget.criterion_payroll_settings_payroll_income',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.store.employer.IncomeLists',
            'criterion.store.employer.IncomeListLabels',
            'criterion.controller.settings.incomes.Income'
        ],

        controller : {
            type : 'criterion_payroll_settings_payroll_income',
            externalUpdate : false
        },

        bodyPadding : 0,

        defaults : {
            xtype : 'criterion_panel',
            layout : 'hbox',

            plugins : [
                'criterion_responsive_column'
            ],

            defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER
        },

        viewModel : {
            data : {
                record : null
            },
            stores : {
                employerIncomeListLabels : {
                    type : 'criterion_employer_income_list_labels'
                }
            },
            formulas : {
                hideExcludeFrom : function(data) {
                    return Ext.Array.indexOf([INCOME_CALC_METHOD.AMOUNT, INCOME_CALC_METHOD.UNIT, INCOME_CALC_METHOD.FORMULA], data('record.incomeCalcMethodCode')) !== -1;
                },

                isSalaryType : function(data) {
                    return data('record.incomeCalcMethodCode') === INCOME_CALC_METHOD.SALARY;
                },

                hideMultiplier : function(data) {
                    return Ext.Array.indexOf([INCOME_CALC_METHOD.AMOUNT, INCOME_CALC_METHOD.UNIT, INCOME_CALC_METHOD.FORMULA], data('record.incomeCalcMethodCode')) !== -1;
                },

                isFormulaType : function(data) {
                    return data('record.incomeCalcMethodCode') === INCOME_CALC_METHOD.FORMULA;
                },
                payrollNumber : {
                    get : function(data) {
                        var vals = {},
                            res = [];

                        vals[1] = data('cb1');
                        vals[2] = data('cb2');
                        vals[3] = data('cb3');
                        vals[4] = data('cb4');
                        vals[5] = data('cb5');
                        vals[6] = data('cb6');

                        Ext.Object.each(vals, function(key, val) {
                            if (val) {
                                res.push(key);
                            }
                        });

                        return res;
                    },
                    set : function(value) {
                        var setVals = {};

                        Ext.each([1, 2, 3, 4, 5, 6], function(indx) {
                            setVals['cb' + indx] = false;
                        });

                        Ext.each(value, function(indx) {
                            setVals['cb' + indx] = true;
                        });

                        this.set(setVals);
                    }
                }
            }
        },

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        autoScroll : true,

        title : i18n.gettext('Income Details'),

        initComponent : function() {
            var me = this;

            me.items = [
                {
                    bodyPadding : '0 10 10',

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
                                    fieldLabel : i18n.gettext('Code'),
                                    name : 'code',
                                    allowBlank : false
                                },
                                {
                                    xtype : 'textfield',
                                    fieldLabel : i18n.gettext('Description'),
                                    name : 'description',
                                    allowBlank : false
                                },
                                {
                                    xtype : 'combobox',
                                    fieldLabel : i18n.gettext('Compensation Type'),
                                    bind : {
                                        store : '{teIncomes}'
                                    },
                                    queryMode : 'local',
                                    valueField : 'id',
                                    displayField : 'compensationType',
                                    forceSelection : true,
                                    autoSelect : true,
                                    editable : true,
                                    name : 'teIncomeId',
                                    allowBlank : false
                                },
                                {
                                    xtype : 'criterion_code_detail_field',
                                    fieldLabel : i18n.gettext('Pay Type'),
                                    codeDataId : DICT.PAY_TYPE,
                                    name : 'payTypeCd',
                                    allowBlank : false,
                                    listeners : {
                                        codedetailsLoaded : function() {
                                            this.setFilterValues({
                                                attribute : 'attribute1',
                                                value : '1'
                                            })
                                        }
                                    }
                                },
                                {
                                    xtype : 'criterion_code_detail_field',
                                    fieldLabel : i18n.gettext('Calculation Method'),
                                    codeDataId : DICT.INCOME_CALC_METHOD,
                                    name : 'incomeCalcMethodCd',
                                    allowBlank : false,
                                    bind : {
                                        value : '{record.incomeCalcMethodCd}'
                                    }
                                }
                            ]
                        },
                        {
                            items : [
                                {
                                    xtype : 'toggleslidefield',
                                    name : 'isActive',
                                    fieldLabel : i18n.gettext('Active'),
                                    allowBlank : false
                                },
                                {
                                    xtype : 'toggleslidefield',
                                    name : 'isOvertimeEligible',
                                    fieldLabel : i18n.gettext('Overtime Eligible'),
                                    allowBlank : false,
                                    hidden : true,
                                    disabled : true,
                                    bind : {
                                        hidden : '{isFormulaType}',
                                        disabled : '{isFormulaType}'
                                    }
                                },
                                {
                                    xtype : 'criterion_currencyfield',
                                    fieldLabel : i18n.gettext('Rate'),
                                    isRatePrecision : true,
                                    name : 'rate',
                                    hidden : true,
                                    disabled : true,
                                    bind : {
                                        value : '{record.rate}',
                                        hidden : '{isSalaryType || isFormulaType}',
                                        disabled : '{isSalaryType || isFormulaType}'
                                    }
                                },
                                {
                                    xtype : 'criterion_percentagefield',
                                    fieldLabel : i18n.gettext('Rate'),
                                    name : 'rate',
                                    decimalPrecision : 6,
                                    hidden : true,
                                    disabled : true,
                                    bind : {
                                        value : '{record.rate}',
                                        hidden : '{!isFormulaType}',
                                        disabled : '{!isFormulaType}'
                                    }
                                },
                                {
                                    xtype : 'numberfield',
                                    fieldLabel : i18n.gettext('Multiplier'),
                                    name : 'multiplier',
                                    hidden : true,
                                    bind : {
                                        value : '{record.multiplier}',
                                        hidden : '{hideMultiplier}',
                                        disabled : '{hideMultiplier}'
                                    }
                                },
                                {
                                    xtype : 'textfield',
                                    fieldLabel : i18n.gettext('Formula'),
                                    name : 'multiplier',
                                    hidden : true,
                                    disabled : true,
                                    bind : {
                                        value : '{record.multiplier}',
                                        hidden : '{!isFormulaType}',
                                        disabled : '{!isFormulaType}'
                                    }
                                },
                                {
                                    xtype : 'combobox',
                                    fieldLabel : i18n.gettext('Exclude From'),
                                    store : Ext.create('Ext.data.ArrayStore', {
                                        fields : ['id', 'display'],
                                        data : [
                                            [criterion.Consts.INCOME_EXCLUSION_TYPES.SALARY, i18n.gettext('Salary')],
                                            [criterion.Consts.INCOME_EXCLUSION_TYPES.EXEMPT, i18n.gettext('Exempt')]
                                        ]
                                    }),
                                    hidden : true,
                                    bind : {
                                        hidden : '{hideExcludeFrom}',
                                        disabled : '{hideExcludeFrom}',
                                        value : '{record.exclusionType}'
                                    },
                                    queryMode : 'local',
                                    valueField : 'id',
                                    displayField : 'display',
                                    forceSelection : true,
                                    autoSelect : true,
                                    editable : true,
                                    name : 'exclusionType',
                                    allowBlank : true
                                },
                                {
                                    xtype : 'criterion_employer_labels_combobox',
                                    reference : 'employerIncomeListLabelsCombo',
                                    objectParam : 'incomeListId',
                                    bind : {
                                        valuesStore : '{employerIncomeListLabels}'
                                    }
                                },
                                {
                                    xtype : 'numberfield',
                                    fieldLabel : i18n.gettext('Priority'),
                                    name : 'priority',
                                    hidden : true,
                                    bind : {
                                        value : '{record.priority}',
                                        hidden : '{!isFormulaType}',
                                        minValue : '{isFormulaType ? 1 : 0}'
                                    }
                                },
                                {
                                    xtype : 'tagfield',
                                    fieldLabel : i18n.gettext('Payroll Number / Month'),
                                    bind : '{payrollNumber}',
                                    valueField : 'id',
                                    name : 'payrollNumber',
                                    store : new Ext.data.Store({
                                        proxy : {
                                            type : 'memory'
                                        },
                                        data : [
                                            {id : 1, text : i18n.gettext('First')},
                                            {id : 2, text : i18n.gettext('Second')},
                                            {id : 3, text : i18n.gettext('Third')},
                                            {id : 4, text : i18n.gettext('Fourth')},
                                            {id : 5, text : i18n.gettext('Fifth')},
                                            {id : 6, text : i18n.gettext('Last')}
                                        ],
                                        sorters : [{
                                            property : 'id',
                                            direction : 'ASC'
                                        }]
                                    })
                                },

                                {
                                    xtype : 'hiddenfield',
                                    name : 'first',
                                    disableDirtyCheck : true,
                                    bind : '{cb1}'
                                },
                                {
                                    xtype : 'hiddenfield',
                                    name : 'second',
                                    disableDirtyCheck : true,
                                    bind : '{cb2}'
                                },
                                {
                                    xtype : 'hiddenfield',
                                    name : 'third',
                                    disableDirtyCheck : true,
                                    bind : '{cb3}'
                                },
                                {
                                    xtype : 'hiddenfield',
                                    name : 'fourth',
                                    disableDirtyCheck : true,
                                    bind : '{cb4}'
                                },
                                {
                                    xtype : 'hiddenfield',
                                    name : 'fifth',
                                    disableDirtyCheck : true,
                                    bind : '{cb5}'
                                },
                                {
                                    xtype : 'hiddenfield',
                                    name : 'last',
                                    disableDirtyCheck : true,
                                    bind : '{cb6}'
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
                                    xtype : 'criterion_currencyfield',
                                    fieldLabel : i18n.gettext('Period Ceiling'),
                                    name : 'periodCeiling',
                                    allowBlank : false
                                },
                                {
                                    xtype : 'criterion_currencyfield',
                                    fieldLabel : i18n.gettext('Monthly Ceiling'),
                                    name : 'monthlyCeiling',
                                    allowBlank : false
                                }
                            ]
                        },
                        {
                            items : [
                                {
                                    xtype : 'criterion_currencyfield',
                                    fieldLabel : i18n.gettext('Annual Ceiling'),
                                    name : 'annualCeiling',
                                    allowBlank : false
                                },
                                {
                                    xtype : 'criterion_currencyfield',
                                    fieldLabel : i18n.gettext('Lifetime Ceiling'),
                                    name : 'lifetimeCeiling',
                                    allowBlank : false
                                }
                            ]
                        }
                    ]
                }
            ];

            me.callParent(arguments);
        },

        loadRecord : function(record) {
            let me = this,
                vm = this.getViewModel();

            vm.set('record', record);

            this.callParent(arguments);

            vm.bind({
                bindTo : '{payrollNumber}',
                single : true
            }, function() {
                me.down('[name=payrollNumber]').resetOriginalValue();
            });

            vm.set({
                cb1 : record.get('first'),
                cb2 : record.get('second'),
                cb3 : record.get('third'),
                cb4 : record.get('fourth'),
                cb5 : record.get('fifth'),
                cb6 : record.get('last')
            });
        }

    };

});

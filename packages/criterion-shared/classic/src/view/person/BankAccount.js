Ext.define('criterion.view.person.BankAccount', function() {

    return {
        alias : 'widget.criterion_person_bank_account',

        extend : 'criterion.view.FormView',

        title : i18n.gettext('Bank Account'),

        requires : [
            'criterion.controller.person.BankAccount'
        ],

        controller : {
            type : 'criterion_person_bank_account',
            externalUpdate : false
        },

        viewModel : {
            data : {
                isUsePresets : false
            },
            formulas : {
                maxValue : function(get) {
                    return (get('record.depositTypeCode') === criterion.Consts.DEPOSIT_TYPE.PERCENT) ? 100 : Number.MAX_VALUE;
                },
                isPercent : function(get) {
                    return get('record.depositTypeCode') === criterion.Consts.DEPOSIT_TYPE.PERCENT
                },
                isBalance : function(get) {
                    return get('record.depositTypeCode') === criterion.Consts.DEPOSIT_TYPE.BALANCE
                },

                hideSave : function(data) {
                    return !this.get(criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.EMPLOYEE_BANK_ACCOUNTS, criterion.SecurityManager.UPDATE, false, true));
                },

                hideDelete : function(data) {
                    return data('hideDeleteInt') || !this.get(criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.EMPLOYEE_BANK_ACCOUNTS, criterion.SecurityManager.DELETE, false, true));
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

        initComponent() {

            this.items = [
                {
                    xtype : 'container',

                    defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM,

                    layout : 'hbox',

                    plugins : [
                        'criterion_responsive_column'
                    ],

                    items : [
                        {
                            xtype : 'container',
                            defaults : {
                                labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WMID_WIDTH
                            },

                            items : [
                                {
                                    xtype : 'numberfield',
                                    fieldLabel : i18n.gettext('Deposit Order'),
                                    decimalPrecision : 0,
                                    width : '100%',
                                    bind : {
                                        value : '{record.depositOrder}',
                                        readOnly : '{readOnly}'
                                    }
                                },
                                {
                                    xtype : 'criterion_code_detail_field',
                                    fieldLabel : i18n.gettext('Deposit Type'),
                                    sortByDisplayField : false,
                                    codeDataId : criterion.consts.Dict.DEPOSIT_TYPE,
                                    bind : {
                                        value : '{record.depositTypeCd}',
                                        readOnly : '{readOnly}'
                                    }
                                },
                                {
                                    xtype : 'criterion_currencyfield',
                                    fieldLabel : i18n.gettext('Amount'),
                                    minValue : 0,
                                    flex : 1,
                                    hidden : true,
                                    allowDecimals : true,
                                    isRatePrecision : false,
                                    bind : {
                                        maxValue : '{maxValue}',
                                        value : '{record.value}',
                                        hidden : '{isPercent}',
                                        disabled : '{isBalance}',
                                        readOnly : '{readOnly}'
                                    }
                                },
                                {
                                    xtype : 'numberfield',
                                    fieldLabel : i18n.gettext('Percent'),
                                    reference : 'percentValueField',
                                    minValue : 0,
                                    allowDecimals : true,
                                    flex : 1,
                                    bind : {
                                        maxValue : '{maxValue}',
                                        value : '{record.value}',
                                        hidden : '{!isPercent}',
                                        disabled : '{isBalance}',
                                        readOnly : '{readOnly}'
                                    }
                                }
                            ]
                        },
                        {
                            xtype : 'container',
                            defaults : {
                                labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WMID_WIDTH
                            },
                            items : [
                                {
                                    xtype : 'criterion_code_detail_field',
                                    fieldLabel : i18n.gettext('Payment Type'),
                                    codeDataId : criterion.consts.Dict.PAYMENT_TYPE,
                                    bind : {
                                        value : '{record.paymentTypeCd}',
                                        readOnly : '{readOnly}',
                                        filterValues : {
                                            attribute : 'attribute1',
                                            value : 'true',
                                            strict : true
                                        }
                                    }
                                },
                                {
                                    xtype : 'textfield',
                                    fieldLabel : i18n.gettext('Description'),
                                    width : '100%',
                                    bind : {
                                        value : '{record.description}',
                                        readOnly : '{readOnly}'
                                    }
                                },
                                {
                                    xtype : 'tagfield',
                                    fieldLabel : i18n.gettext('Payroll Number'),
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
                    xtype : 'component',
                    autoEl : 'hr',
                    cls : 'criterion-horizontal-ruler'
                },
                {
                    xtype : 'container',

                    defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM,

                    layout : 'hbox',

                    plugins : [
                        'criterion_responsive_column'
                    ],

                    items : [
                        {
                            xtype : 'container',
                            defaults : {
                                labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WMID_WIDTH
                            },
                            items : [
                                {
                                    xtype : 'textfield',
                                    fieldLabel : i18n.gettext('Bank Name'),
                                    width : '100%',
                                    hidden : true,
                                    disabled : true,
                                    bind : {
                                        value : '{record.bankName}',
                                        readOnly : '{readOnly}',
                                        hidden : '{isUsePresets}',
                                        disabled : '{isUsePresets}'
                                    }
                                },
                                {
                                    xtype : 'textfield',
                                    fieldLabel : i18n.gettext('Routing Number'),
                                    afterLabelTextTpl : '<span class="info" style="display: inline-block"></span>',
                                    width : '100%',
                                    hidden : true,
                                    disabled : true,
                                    bind : {
                                        value : '{record.routingNumber}',
                                        readOnly : '{readOnly}',
                                        hidden : '{isUsePresets}',
                                        disabled : '{isUsePresets}'
                                    },
                                    listeners : {
                                        render : 'bankNumberFieldRender'
                                    }
                                },

                                // with presets
                                {
                                    xtype : 'criterion_code_detail_field',
                                    fieldLabel : i18n.gettext('Bank Name'),
                                    valueField : 'description',
                                    codeDataId : criterion.consts.Dict.BANK_ROUTING_NUMBER,
                                    hidden : true,
                                    uniqByField : 'description',
                                    disabled : true,
                                    bind : {
                                        value : '{record.bankName}',
                                        hidden : '{!isUsePresets}',
                                        disabled : '{!isUsePresets}'
                                    },
                                    allowBlank : false
                                },
                                {
                                    xtype : 'criterion_code_detail_field',
                                    fieldLabel : i18n.gettext('Routing Number'),
                                    codeDataId : criterion.consts.Dict.BANK_ROUTING_NUMBER,
                                    hidden : true,
                                    valueField : 'attribute1',
                                    displayField : 'attribute1',
                                    disabled : true,
                                    bind : {
                                        value : '{record.routingNumber}',
                                        disabled : '{!isUsePresets || !record.bankName}',
                                        hidden : '{!isUsePresets}',
                                        filterValues : {
                                            attribute : 'description',
                                            value : '{record.bankName}'
                                        }
                                    },
                                    allowBlank : false
                                },
                                {
                                    xtype : 'datefield',
                                    fieldLabel : i18n.gettext('Last Change to Account/Routing'),
                                    bind : '{record.lastAccountUpdated}',
                                    readOnly : true
                                }
                            ]
                        },
                        {
                            xtype : 'container',
                            defaults : {
                                labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WMID_WIDTH
                            },
                            items : [
                                {
                                    xtype : 'criterion_code_detail_field',
                                    fieldLabel : i18n.gettext('Account Type'),
                                    codeDataId : criterion.consts.Dict.ACCOUNT_TYPE,
                                    bind : {
                                        value : '{record.accountTypeCd}',
                                        readOnly : '{readOnly}'
                                    }
                                },
                                {
                                    xtype : 'textfield',
                                    fieldLabel : i18n.gettext('Account Number'),
                                    afterLabelTextTpl : '<span class="info" style="display: inline-block"></span>',
                                    width : '100%',
                                    bind : {
                                        value : '{record.accountNumber}',
                                        readOnly : '{readOnly}'
                                    },
                                    listeners : {
                                        render : 'bankNumberFieldRender'
                                    }
                                }
                            ]
                        }
                    ]
                }
            ];

            this.callParent(arguments);
        },

        loadRecord(record) {
            let me = this,
                vm = this.getViewModel();

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
    }
});

Ext.define('criterion.view.payroll.batch.ChangePayment', function() {

    return {

        alias : 'widget.criterion_payroll_batch_change_payment',

        extend : 'criterion.view.payroll.batch.BasePaymentAction',

        requires : [
            'criterion.controller.payroll.batch.ChangePayment',
            'criterion.store.payroll.payment.Deposits'
        ],

        controller : {
            type : 'criterion_payroll_batch_change_payment'
        },

        listeners : {
            show : 'handleShow'
        },

        viewModel : {
            data : {
                btnTitle : i18n.gettext('Change')
            },

            stores : {
                deposits : {
                    type : 'criterion_payroll_payment_deposits'
                }
            },

            formulas : {
                isChangeToACH : get => get('paymentType.selection.code') === criterion.Consts.PAYMENT_TYPE.PAID_BY_ACH
            }
        },

        title : i18n.gettext('Change Payment'),

        bodyPadding : 0,

        items : [
            {
                xtype : 'container',
                padding : 10,
                items : [
                    {
                        xtype : 'textfield',
                        fieldLabel : i18n.gettext('Payments Selected'),
                        disabled : true,
                        bind : {
                            value : '{numberOfPayrolls}'
                        }
                    },
                    {
                        xtype : 'criterion_code_detail_field',
                        reference : 'paymentType',
                        fieldLabel : i18n.gettext('Payment Type'),
                        codeDataId : criterion.consts.Dict.PAYMENT_TYPE,
                        allowBlank : false,
                        listeners : {
                            change : 'handleChangeType'
                        },
                        bind : {
                            filterValues : {
                                attribute : 'attribute1',
                                value : 'true',
                                strict : true
                            }
                        }
                    }
                ]
            },
            {
                xtype : 'criterion_gridpanel',

                scrollable : true,
                height : 200,
                hidden : true,

                bind : {
                    store : '{deposits}',
                    hidden : '{!isChangeToACH || !deposits.count}'
                },

                viewConfig : {
                    markDirty : false
                },

                columns : [
                    {
                        xtype : 'gridcolumn',
                        dataIndex : 'personName',
                        text : i18n.gettext('Employee Name'),
                        flex : 1
                    },
                    {
                        xtype : 'gridcolumn',
                        dataIndex : 'netPay',
                        text : i18n.gettext('Check Amount'),
                        width : 150
                    },
                    {
                        xtype : 'widgetcolumn',
                        text : i18n.gettext('ACH Account Name'),
                        dataIndex : 'bankAccountId',
                        flex : 1,
                        widget : {
                            xtype : 'combobox',
                            bind : {
                                store : '{record.achBankAccounts}'
                            },
                            forceSelection : true,
                            allowBlank : false,
                            autoSelect : true,
                            editable : false,
                            queryMode : 'local',
                            valueField : 'id',
                            displayField : 'nameAndNumber',
                            listeners : {
                                change : (cmp, value) => {
                                    cmp.getWidgetRecord().set(cmp.getWidgetColumn().dataIndex, value);
                                }
                            }
                        }
                    }
                ]
            }
        ]
    }
});

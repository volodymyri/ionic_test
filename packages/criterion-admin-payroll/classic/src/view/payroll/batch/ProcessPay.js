Ext.define('criterion.view.payroll.batch.ProcessPay', function() {

    const BATCH_STATUSES = criterion.Consts.BATCH_STATUSES,
          PAYMENT_PROCESS_ACTIONS = criterion.Consts.PAYMENT_PROCESS_ACTIONS;

    return {

        alias : 'widget.criterion_payroll_process_pay',

        extend : 'criterion.ux.Panel',

        requires : [
            'criterion.controller.payroll.batch.ProcessPay',
            'criterion.store.employer.BankAccounts',
            'criterion.store.payroll.payment.Deposits',
            'criterion.store.employer.payroll.Settings',
            'criterion.view.payroll.batch.Info'
        ],

        viewModel : {
            data : {
                batchRecord : null,
                summaryData : null,
                batchSummary : null
            },
            stores : {
                employerBankAccounts : {
                    type : 'employer_bank_accounts',
                    proxy : {
                        extraParams : {
                            employerId : '{batchRecord.employerId}'
                        }
                    }
                },
                payrollPaymentDeposits : {
                    type : 'criterion_payroll_payment_deposits',
                    pageSize : criterion.Consts.PAGE_SIZE.DEFAULT,
                    remoteSort : true,
                    proxy : {
                        extraParams : {
                            batchId : '{batchRecord.id}'
                        }
                    }
                },
                employerPayrollSettings : {
                    type : 'criterion_employer_payroll_settings',
                    proxy : {
                        extraParams : {
                            employerId : '{batchRecord.employerId}'
                        }
                    }
                }
            },
            formulas : {
                cycleText : function(data) {
                    return data('batchRecord.isOffCycle') ? i18n.gettext('Off Cycle') : i18n.gettext('On Cycle');
                },
                readOnlyMode : function(data) {
                    return (data('batchRecord.batchStatusCode') !== BATCH_STATUSES.PENDING_APPROVAL);
                },
                allowCompleteBtn : function(data) {
                    return [
                        BATCH_STATUSES.TO_BE_PAID,
                        BATCH_STATUSES.REVERSAL,
                        BATCH_STATUSES.PAID
                    ].indexOf(data('batchRecord.batchStatusCode')) !== -1 && data('batchRecord.canComplete');
                },
                allowActions : function(data) {
                    return [
                        BATCH_STATUSES.TO_BE_PAID,
                        BATCH_STATUSES.COMPLETE,
                        BATCH_STATUSES.REVERSAL,
                        BATCH_STATUSES.PAID
                    ].indexOf(data('batchRecord.batchStatusCode')) !== -1;
                }
            }
        },

        listeners : {
            scope : 'controller',
            show : 'handleShow',
            downloadACH : 'handleDownloadACH',
            generatePeriodic : 'handleGeneratePeriodic',
            printChecks : 'handlePrintChecks'
        },

        controller : {
            type : 'criterion_payroll_process_pay'
        },

        bodyPadding : 0,

        layout : 'border',

        dockedItems : [
            {
                dock : 'bottom',
                xtype : 'container',
                cls : 'x-panel-header-default',
                layout : 'hbox',
                items : [
                    {
                        flex : 1
                    },
                    {
                        xtype : 'button',
                        cls : 'criterion-btn-light',
                        text : i18n.gettext('Cancel'),
                        handler : 'handleCancel',
                        margin : '10 10 10 0'
                    },
                    {
                        xtype : 'button',
                        cls : 'criterion-btn-primary',
                        text : i18n.gettext('Complete Batch'),
                        handler : 'handleComplete',
                        margin : '10 10 10 0',
                        hidden : true,
                        bind : {
                            hidden : criterion.SecurityManager.getComplexSecurityFormula({
                                append : '!allowCompleteBtn ||',
                                rules : [
                                    {
                                        key : criterion.SecurityManager.HR_KEYS.PAY_PROCESSING_COMPLETE_BATCH,
                                        actName : criterion.SecurityManager.ACT,
                                        reverse : true
                                    }
                                ]
                            })
                        }
                    }
                ]
            }
        ],

        initComponent : function() {
            this.items = [
                {
                    xtype : 'panel',
                    layout : 'hbox',
                    region : 'north',
                    height : 110,
                    padding : '10 20 10 14',
                    items : [
                        {
                            xtype : 'container',
                            width : '30%',
                            layout : 'hbox',
                            items : [
                                {
                                    xtype : 'container',
                                    cls : 'values-panel-item',
                                    flex : 1,
                                    bind : {
                                        html : '<div class="values-panel-item-wrap"><div class="values-panel-item-value">{batchSummary.totalIncome:currency}</div><div class="values-panel-item-title">' + i18n.gettext('Gross Income') + '</div></div>'
                                    }
                                },
                                {
                                    xtype : 'container',
                                    cls : 'values-panel-item',
                                    flex : 1,
                                    bind : {
                                        html : '<div class="values-panel-item-wrap"><div class="values-panel-item-value">{batchSummary.totalEmployeeTax:currency}</div><div class="values-panel-item-title">' + i18n.gettext('Employee Taxes') + '</div></div>'
                                    }
                                }
                            ]
                        },
                        {
                            xtype : 'container',
                            layout : 'hbox',
                            responsiveConfig : criterion.Utils.createResponsiveConfig([
                                {
                                    rule : criterion.Consts.UI_CONFIG.RESPONSIVE.RULE.WIDER,
                                    config : {
                                        width : '59%'
                                    }
                                },
                                {
                                    rule : criterion.Consts.UI_CONFIG.RESPONSIVE.RULE.WIDE,
                                    config : {
                                        width : '70%'
                                    }
                                }
                            ]),
                            padding : '0 0 0 0',
                            items : [
                                {
                                    xtype : 'container',
                                    cls : 'values-panel-item',
                                    flex : 1,
                                    bind : {
                                        html : '<div class="values-panel-item-wrap"><div class="values-panel-item-value">{batchSummary.totalEmployeeDeductions:currency}</div><div class="values-panel-item-title">' + i18n.gettext('Employee Deductions') + '</div></div>'
                                    }
                                },
                                {
                                    xtype : 'container',
                                    cls : 'values-panel-item',
                                    flex : 1,
                                    bind : {
                                        html : '<div class="values-panel-item-wrap"><div class="values-panel-item-value">{batchSummary.totalEmployerTax:currency}</div><div class="values-panel-item-title">' + i18n.gettext('Employer Taxes') + '</div></div>'
                                    }
                                },
                                {
                                    xtype : 'container',
                                    cls : 'values-panel-item',
                                    flex : 1,
                                    bind : {
                                        html : '<div class="values-panel-item-wrap"><div class="values-panel-item-value">{batchSummary.totalEmployerDeductions:currency}</div><div class="values-panel-item-title">' + i18n.gettext('Employer Deductions') + '</div></div>'
                                    }
                                },
                                {
                                    xtype : 'container',
                                    cls : 'values-panel-item',
                                    flex : 1,
                                    bind : {
                                        html : '<div class="values-panel-item-wrap"><div class="values-panel-item-value">{summaryData.totalCost:currency}</div><div class="values-panel-item-title">' + i18n.gettext('Payroll Total') + '</div></div>'
                                    }
                                }
                            ]
                        },
                        {
                            xtype : 'container',
                            layout : 'hbox',
                            responsiveConfig : criterion.Utils.createResponsiveConfig([
                                {
                                    rule : criterion.Consts.UI_CONFIG.RESPONSIVE.RULE.WIDER,
                                    config : {
                                        width : '11%'
                                    }
                                },
                                {
                                    rule : criterion.Consts.UI_CONFIG.RESPONSIVE.RULE.WIDE,
                                    config : {
                                        width : 0
                                    }
                                }
                            ])
                        }
                    ]
                },

                {
                    xtype : 'panel',
                    region : 'west',
                    width : '35%',
                    layout : 'border',
                    margin : '0 0 20px 20px',
                    responsiveConfig : criterion.Utils.createResponsiveConfig([
                        {
                            rule : criterion.Consts.UI_CONFIG.RESPONSIVE.RULE.MTMEDIUM,
                            config : {
                                width : '35%'
                            }
                        },
                        {
                            rule : criterion.Consts.UI_CONFIG.RESPONSIVE.RULE.MEDIUM,
                            config : {
                                width : '50%'
                            }
                        }
                    ]),
                    items : [
                        {
                            xtype : 'label',
                            region : 'north',
                            cls : 'title-label',
                            margin : '10 0 20 5',
                            bind : {
                                text : '{cycleText}'
                            }
                        },
                        {
                            xtype : 'panel',
                            scrollable : 'vertical',
                            region : 'center',
                            cls : 'whitePanel box-shadow',
                            margin : 5,
                            items : [
                                {
                                    xtype : 'criterion_payroll_batch_info',
                                    scrollable : 'vertical',
                                    viewModel : {
                                        data : {
                                            isPayProcessing : true
                                        }
                                    },
                                    reference : 'batchInfo'
                                }
                            ]
                        }
                    ]
                },

                {
                    xtype : 'panel',
                    layout : 'border',
                    region : 'center',
                    padding : '0 27 0 10',

                    items : [
                        {
                            xtype : 'panel',
                            region : 'east',
                            responsiveConfig : criterion.Utils.createResponsiveConfig([
                                {
                                    rule : criterion.Consts.UI_CONFIG.RESPONSIVE.RULE.MTMEDIUM,
                                    config : {
                                        width : '17%'
                                    }
                                },
                                {
                                    rule : criterion.Consts.UI_CONFIG.RESPONSIVE.RULE.MEDIUM,
                                    config : {
                                        width : 0
                                    }
                                }
                            ])
                        },
                        {
                            xtype : 'panel',
                            layout : 'hbox',
                            region : 'north',
                            items : [
                                {
                                    xtype : 'label',
                                    margin : '10 0 20 5',
                                    cls : 'title-label',
                                    text : i18n.gettext('Payments')
                                },
                                {
                                    flex : 1
                                },
                                {
                                    xtype : 'combo',
                                    width : 250,
                                    reference : 'payProcessMenu',
                                    tpl : Ext.create('Ext.XTemplate',
                                        '<ul class="x-list-plain">' +
                                            '<tpl for=".">',
                                            '<li role="option" class="x-boundlist-item {[values.isFirstInGroup ? "combo-group-wrapper" : ""]}">',
                                                '{text}',
                                            '</li>',
                                            '</tpl>' +
                                        '</ul>'
                                    ),
                                    store : {
                                        proxy : {
                                            type : 'memory'
                                        },
                                        fields : ['text', 'action', 'isFirstInGroup'],
                                        data : [
                                            {
                                                text : i18n.gettext('Print Checks'),
                                                action : PAYMENT_PROCESS_ACTIONS.PRINT_CHECKS
                                            },
                                            {
                                                text : i18n.gettext('Generate ACH'),
                                                action : PAYMENT_PROCESS_ACTIONS.GENERATE_ACH
                                            },
                                            {
                                                text : i18n.gettext('Generate Ceridian Check'),
                                                action : PAYMENT_PROCESS_ACTIONS.GENERATE_CERIDIAN_CHECK
                                            },
                                            {
                                                text : i18n.gettext('Transmit to PTSC'),
                                                action : PAYMENT_PROCESS_ACTIONS.TRANSMIT_TO_PTSC,
                                                isFirstInGroup : 1
                                            },
                                            {
                                                text : i18n.gettext('Change Payment Type'),
                                                action : PAYMENT_PROCESS_ACTIONS.CHANGE_PAYMENT_TYPE,
                                                isFirstInGroup : 1
                                            },
                                            {
                                                text : i18n.gettext('Void Payment'),
                                                action : PAYMENT_PROCESS_ACTIONS.VOID_PAYMENT
                                            },
                                            {
                                                text : i18n.gettext('Reverse'),
                                                action : PAYMENT_PROCESS_ACTIONS.REVERSE
                                            }
                                        ]
                                    },
                                    hidden : true,
                                    bind : {
                                        hidden : criterion.SecurityManager.getComplexSecurityFormula({
                                            append : '!allowActions ||',
                                            rules : [
                                                {
                                                    key : criterion.SecurityManager.HR_KEYS.PAY_PROCESSING,
                                                    actName : criterion.SecurityManager.UPDATE,
                                                    reverse : true
                                                }
                                            ]
                                        })
                                    },
                                    listeners : {
                                        change : 'handleSelectAction'
                                    },
                                    sortByDisplayField : false,
                                    displayField : 'text',
                                    valueField : 'action',
                                    forceSelection : false,
                                    allowBlank : true,
                                    editable : false,
                                    emptyText : i18n.gettext('Process')
                                },
                                {
                                    responsiveConfig : criterion.Utils.createResponsiveConfig([
                                        {
                                            rule : criterion.Consts.UI_CONFIG.RESPONSIVE.RULE.MTMEDIUM,
                                            config : {
                                                width : '17%'
                                            }
                                        },
                                        {
                                            rule : criterion.Consts.UI_CONFIG.RESPONSIVE.RULE.MEDIUM,
                                            config : {
                                                width : 0
                                            }
                                        }
                                    ])
                                }
                            ]
                        },
                        {
                            xtype : 'criterion_gridpanel',
                            reference : 'payrollsGrid',
                            cls : 'box-shadow',
                            margin : '5 5 25 5',
                            region : 'center',
                            scrollable : true,

                            bind : {
                                store : '{payrollPaymentDeposits}'
                            },

                            selModel : {
                                selType : 'checkboxmodel',
                                showHeaderCheckbox : false,
                                listeners : {
                                    scope : 'controller',
                                    selectionchange : 'handlePayrollSelectionChange'
                                }
                            },

                            columns : [
                                {
                                    text : i18n.gettext('Employee'),
                                    dataIndex : 'personName',
                                    flex : 2,
                                    minWidth : 160
                                },
                                {
                                    text : i18n.gettext('Net Pay'),
                                    dataIndex : 'netPay',
                                    xtype : 'criterion_currencycolumn',
                                    flex : 1,
                                    minWidth : 130
                                },
                                {
                                    text : i18n.gettext('Payment Type'),
                                    dataIndex : 'paymentType',
                                    flex : 1,
                                    minWidth : 130
                                },
                                {
                                    text : i18n.gettext('Reference'),
                                    dataIndex : 'paymentReference',
                                    flex : 1,
                                    minWidth : 100
                                },
                                {
                                    xtype : 'booleancolumn',
                                    header : i18n.gettext('Status'),
                                    align : 'center',
                                    dataIndex : 'isPaid',
                                    trueText : 'Paid',
                                    falseText : 'Not Paid',
                                    flex : 1,
                                    minWidth : 120
                                }
                            ],
                            dockedItems : [
                                {
                                    xtype : 'criterion_toolbar_paging',
                                    dock : 'bottom',
                                    displayInfo : true,
                                    bind : {
                                        store : '{payrollPaymentDeposits}'
                                    }
                                }
                            ]
                        }
                    ]
                }
            ];

            this.callParent(arguments);

            this.lookup('batchInfo').add(
                {
                    xtype : 'component',
                    autoEl : 'hr',
                    cls : 'criterion-horizontal-ruler'
                },
                {
                    xtype : 'textfield',
                    fieldLabel : i18n.gettext('Number of Checks'),
                    disabled : true,
                    bind : {
                        value : '{summaryData.numberOfChecks:number("0")}'
                    }
                },
                {
                    xtype : 'textfield',
                    fieldLabel : i18n.gettext('ACH Payments'),
                    disabled : true,
                    bind : {
                        value : '{summaryData.numberOfDeposits:number("0")}'
                    }
                },
                {
                    xtype : 'component',
                    autoEl : 'hr',
                    cls : 'criterion-horizontal-ruler'
                },
                {
                    xtype : 'textfield',
                    fieldLabel : i18n.gettext('Amount (Checks)'),
                    disabled : true,
                    bind : {
                        value : '{summaryData.totalChecksAmount:currency}'
                    }
                },
                {
                    xtype : 'textfield',
                    fieldLabel : i18n.gettext('Amount (ACH)'),
                    disabled : true,
                    bind : {
                        value : '{summaryData.totalDepositsAmount:currency}'
                    }
                },
                {
                    xtype : 'textfield',
                    fieldLabel : i18n.gettext('Amount (Tax Filing)'),
                    disabled : true,
                    bind : {
                        value : '{summaryData.totalTaxes:currency}'
                    }
                },
                {
                    xtype : 'textfield',
                    fieldLabel : i18n.gettext('Total Amount'),
                    disabled : true,
                    bind : {
                        value : '{summaryData.totalCost:currency}'
                    }
                }
            )
        }

    }
});

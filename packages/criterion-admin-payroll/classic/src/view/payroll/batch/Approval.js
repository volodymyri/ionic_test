Ext.define('criterion.view.payroll.batch.Approval', function() {

    return {

        alias : 'widget.criterion_payroll_batch_approval',

        extend : 'criterion.ux.Panel',

        requires : [
            'criterion.controller.payroll.batch.Approval',
            'criterion.ux.grid.SummarizedGrid',
            'criterion.view.payroll.batch.Info'
        ],

        viewModel : {
            data : {
                batchRecord : null,
                batchSummary : null,
                totalCost : null,
                isHasAccessDownloadSummary : false
            },
            formulas : {
                approvalText : function(data) {
                    return data('batchRecord.isApproved') ? '<p class="statusText approved"><i class="icon"></i>' + i18n.gettext('Approved') + '</p>' : '<p class="statusText pending"><i class="icon"></i>' + i18n.gettext('Approval Pending') + '</p>';
                },
                totalCostFormatted : function(data) {
                    return criterion.LocalizationManager.currencyFormatter(data('totalCost'));
                }
            },
            stores : {
                incomes : {
                    type : 'store',
                    proxy : {
                        type : 'memory',
                        reader : {
                            type : 'json'
                        }
                    },
                    fields : [
                        {
                            name : 'name',
                            type : 'string'
                        },
                        {
                            name : 'amount',
                            type : 'float'
                        }
                    ]
                },
                employeeTaxes : {
                    type : 'store',
                    proxy : {
                        type : 'memory',
                        reader : {
                            type : 'json'
                        }
                    },
                    fields : [
                        {
                            name : 'taxName',
                            type : 'string'
                        },
                        {
                            name : 'taxAmount',
                            type : 'float'
                        }
                    ]
                },
                employeeDeductions : {
                    type : 'store',
                    proxy : {
                        type : 'memory',
                        reader : {
                            type : 'json'
                        }
                    },
                    fields : [
                        {
                            name : 'employeeDeductionName',
                            type : 'string',
                            convert : function(field, rec) {
                                return rec && rec.get('employerDeduction').description;
                            }
                        },
                        {
                            name : 'deductionAmount',
                            type : 'float'
                        }
                    ]
                },
                employerTaxes : {
                    type : 'store',
                    proxy : {
                        type : 'memory',
                        reader : {
                            type : 'json'
                        }
                    },
                    fields : [
                        {
                            name : 'taxName',
                            type : 'string'
                        },
                        {
                            name : 'taxAmount',
                            type : 'float'
                        }
                    ]
                },
                employerDeductions : {
                    type : 'store',
                    proxy : {
                        type : 'memory',
                        reader : {
                            type : 'json'
                        }
                    },
                    fields : [
                        {
                            name : 'employerDeductionName',
                            type : 'string',
                            convert : function(field, rec) {
                                return rec && rec.get('employerDeduction').description;
                            }
                        },
                        {
                            name : 'deductionAmount',
                            type : 'float'
                        }
                    ]
                }
            }
        },

        listeners : {
            scope : 'controller',
            activate : 'handleActivate'
        },

        controller : {
            type : 'criterion_payroll_batch_approval'
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
                        text : i18n.gettext('Previous'),
                        listeners : {
                            scope : 'controller',
                            click : 'handlePrevClick'
                        },
                        bind : {
                            hidden : '{batchRecord.isApproved}'
                        },
                        margin : '10 0 10 0'
                    },
                    {
                        xtype : 'button',
                        scale : 'small',
                        text : i18n.gettext('Approve'),
                        handler : 'onApproveClick',
                        bind : {
                            hidden : criterion.SecurityManager.getComplexSecurityFormula({
                                append : 'batchRecord.isApproved || !batchRecord.canApprove ||',
                                rules : [
                                    {
                                        key : criterion.SecurityManager.HR_KEYS.PAYROLL_BATCH,
                                        actName : criterion.SecurityManager.UPDATE,
                                        reverse : true
                                    }
                                ]
                            })
                        },
                        margin : 10
                    },
                    {
                        xtype : 'button',
                        scale : 'small',
                        text : i18n.gettext('Download Summary PDF'),
                        handler : 'onDownloadSummary',
                        hidden : true,
                        bind : {
                            hidden : '{!batchRecord.isApproved || !isHasAccessDownloadSummary}'
                        },
                        margin : 10
                    }
                ]
            }
        ],

        initComponent : function() {
            var vm = this.getViewModel();

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
                            padding : '0 2 0 0',
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
                                        html : '<div class="values-panel-item-wrap"><div class="values-panel-item-value">{totalCost:currency}</div><div class="values-panel-item-title">' + i18n.gettext('Payroll Total') + '</div></div>'
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
                    xtype : 'container',
                    region : 'west',
                    width : '30%',
                    scrollable : 'vertical',
                    items : [
                        {
                            xtype : 'criterion_payroll_batch_info',
                            cls : 'whitePanel',
                            padding : '0 2 20 20'
                        }
                    ]
                },

                {
                    xtype : 'container',
                    region : 'center',
                    scrollable : 'vertical',
                    padding : '0 20 0 0',
                    items : [
                        {
                            xtype : 'panel',
                            cls : 'approvalData',
                            reference : 'approvalData',
                            border : true,
                            layout : {
                                type : 'vbox',
                                align : 'stretch'
                            },
                            bodyPadding : 20,
                            padding : '0 0 20 10',

                            responsiveConfig : criterion.Utils.createResponsiveConfig([
                                {
                                    rule : criterion.Consts.UI_CONFIG.RESPONSIVE.RULE.WIDER,
                                    config : {
                                        width : '85%'
                                    }
                                },
                                {
                                    rule : criterion.Consts.UI_CONFIG.RESPONSIVE.RULE.WIDE,
                                    config : {
                                        width : '100%'
                                    }
                                }
                            ]),
                            items : [
                                {
                                    xtype : 'container',
                                    bind : {
                                        html : '{approvalText}'
                                    },
                                    style : {
                                        textAlign : 'center'
                                    }
                                },
                                {
                                    html : '<strong>' + i18n.gettext('Batch Summary') + '</strong>',
                                    margin : '0 0 20 0',
                                    style : {
                                        textAlign : 'center'
                                    }
                                },
                                {
                                    xtype : 'container',
                                    items : [
                                        {
                                            xtype : 'criterion_summarized_grid',

                                            title : i18n.gettext('Incomes'),
                                            bind : '{incomes}',

                                            columns : [
                                                {
                                                    xtype : 'gridcolumn',
                                                    dataIndex : 'name',
                                                    flex : 3,
                                                    summaryRenderer : function() {
                                                        return i18n.gettext('Total Income');
                                                    }
                                                },
                                                {
                                                    xtype : 'gridcolumn',
                                                    dataIndex : 'amount',
                                                    flex : 1,
                                                    renderer : criterion.LocalizationManager.currencyFormatter,
                                                    summaryRenderer : function() {
                                                        return criterion.LocalizationManager.currencyFormatter(vm.get('batchSummary.totalIncome'));
                                                    }
                                                }
                                            ]
                                        },
                                        {
                                            xtype : 'criterion_summarized_grid',

                                            title : i18n.gettext('Employee Taxes'),
                                            bind : '{employeeTaxes}',

                                            columns : [
                                                {
                                                    xtype : 'gridcolumn',
                                                    dataIndex : 'taxName',
                                                    flex : 3,
                                                    summaryRenderer : function() {
                                                        return i18n.gettext('Total Employee Tax');
                                                    }
                                                },
                                                {
                                                    xtype : 'gridcolumn',
                                                    dataIndex : 'taxAmount',
                                                    flex : 1,
                                                    renderer : criterion.LocalizationManager.currencyFormatter,
                                                    summaryRenderer : function() {
                                                        return criterion.LocalizationManager.currencyFormatter(vm.get('batchSummary.totalEmployeeTax'));
                                                    }
                                                }
                                            ]
                                        },
                                        {
                                            xtype : 'criterion_summarized_grid',

                                            title : i18n.gettext('Employee Deductions'),
                                            bind : '{employeeDeductions}',

                                            columns : [
                                                {
                                                    xtype : 'gridcolumn',
                                                    dataIndex : 'employeeDeductionName',
                                                    flex : 3,
                                                    summaryRenderer : function() {
                                                        return i18n.gettext('Total Employee Deduction');
                                                    }
                                                },
                                                {
                                                    xtype : 'gridcolumn',
                                                    dataIndex : 'deductionAmount',
                                                    flex : 1,
                                                    renderer : criterion.LocalizationManager.currencyFormatter,
                                                    summaryRenderer : function() {
                                                        return criterion.LocalizationManager.currencyFormatter(vm.get('batchSummary.totalEmployeeDeductions'));
                                                    }
                                                }
                                            ]
                                        },
                                        {
                                            xtype : 'criterion_summarized_grid',

                                            title : i18n.gettext('Employer Taxes'),
                                            bind : '{employerTaxes}',

                                            columns : [
                                                {
                                                    xtype : 'gridcolumn',
                                                    dataIndex : 'taxName',
                                                    flex : 3,
                                                    summaryRenderer : function() {
                                                        return i18n.gettext('Total Employer Tax');
                                                    }
                                                },
                                                {
                                                    xtype : 'gridcolumn',
                                                    dataIndex : 'taxAmount',
                                                    flex : 1,
                                                    renderer : criterion.LocalizationManager.currencyFormatter,
                                                    summaryRenderer : function() {
                                                        return criterion.LocalizationManager.currencyFormatter(vm.get('batchSummary.totalEmployerTax'));
                                                    }
                                                }
                                            ]
                                        },
                                        {
                                            xtype : 'criterion_summarized_grid',

                                            title : i18n.gettext('Employer Deductions'),
                                            bind : '{employerDeductions}',

                                            columns : [
                                                {
                                                    xtype : 'gridcolumn',
                                                    dataIndex : 'employerDeductionName',
                                                    flex : 3,
                                                    summaryRenderer : function() {
                                                        return i18n.gettext('Total Employer Deduction');
                                                    }
                                                },
                                                {
                                                    xtype : 'gridcolumn',
                                                    dataIndex : 'deductionAmount',
                                                    flex : 1,
                                                    renderer : criterion.LocalizationManager.currencyFormatter,
                                                    summaryRenderer : function() {
                                                        return criterion.LocalizationManager.currencyFormatter(vm.get('batchSummary.totalEmployerDeductions'));
                                                    }
                                                }
                                            ]
                                        },
                                        {
                                            xtype : 'container',
                                            layout : 'hbox',
                                            border : '0 0 1 0',
                                            style : {
                                                borderColor : '#CCC',
                                                borderStyle : 'dotted'
                                            },
                                            cls : 'criterion-bold-text',
                                            padding : '5 0 5 0',
                                            items : [
                                                {
                                                    html : i18n.gettext('Total Cost To Employer')
                                                },
                                                {
                                                    flex : 1
                                                },
                                                {
                                                    bind : {
                                                        html : '{totalCostFormatted}'
                                                    }
                                                }
                                            ]
                                        }
                                    ]
                                }

                            ]
                        }
                    ]
                }
            ];

            this.callParent(arguments);
        }
    }
});

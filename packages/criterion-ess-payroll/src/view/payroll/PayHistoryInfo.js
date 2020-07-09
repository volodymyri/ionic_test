Ext.define('criterion.view.ess.payroll.PayHistoryInfo', {

    alias : 'widget.criterion_selfservice_payroll_pay_history_info',

    extend : 'criterion.view.FormView',

    requires : [
        'criterion.controller.ess.payroll.PayHistoryInfo',
        'criterion.model.payroll.Income',
        'criterion.model.employee.Deduction',
        'criterion.model.employer.payroll.PayrollTotal'
    ],

    controller : {
        type : 'criterion_selfservice_payroll_pay_history_info'
    },

    viewModel : {
        data : {
            record : null,
            includeSSN : false,

            employeePayrollNotes : null,
            batchPayrollNotes : null,
            payrollNotes : null,

            incomePercent : '',
            taxesPercent : '',
            deductionsPercent : '',
            netPay : null
        },
        stores : {
            incomes : {
                type : 'array',
                model : 'criterion.model.payroll.Income'
            },
            taxes : {
                type : 'array',
                model : 'criterion.model.employer.payroll.PayrollTotal'
            },
            deductions : {
                type : 'array',
                model : 'criterion.model.employee.Deduction',
                filters : [{
                    property : 'isShowEmployee',
                    value : true
                }]
            },
            payrollInfoTotals : {
                type : 'array',
                fields : [
                    {
                        name : 'title',
                        type : 'string'
                    },
                    {
                        name : 'percent',
                        type : 'string'
                    },
                    {
                        name : 'amount',
                        type : 'float'
                    },
                    {
                        name : 'amountFormatted',
                        type : 'string'
                    }
                ]
            },
            payrollNotes : {
                type : 'array',
                fields : [
                    {
                        name : 'text',
                        type : 'string'
                    },
                    {
                        name : 'subText',
                        type : 'string'
                    }
                ]
            }
        },

        formulas : {
            getNotes : function(data) {
                return Ext.Array.clean([
                    data('employeePayrollNotes'),
                    data('batchPayrollNotes'),
                    data('payrollNotes')
                ]).join('<br />');
            }
        }
    },

    noButtons : true,

    dockedItems : [
        {
            xtype : 'toolbar',
            dock : 'top',
            cls : 'criterion-ess-panel-toolbar',
            padding : '2 20 0 0',

            items : [
                {
                    xtype : 'component',

                    cls : 'plain-header-title',
                    margin : '7 0 0 0',
                    bind : {
                        html : '{record.payDate:date("' + criterion.consts.Api.TEXTUAL_MONTH_DATE_FORMAT + '")}'
                    }
                },
                '->',
                {
                    xtype : 'button',
                    text : i18n.gettext('Download PDF'),
                    handler : 'onDownloadReport'
                },
                {
                    xtype : 'button',
                    cls : 'criterion-btn-glyph-only',
                    glyph : criterion.consts.Glyph['ios7-more'],
                    scale : 'medium',
                    listeners : {
                        click : function(cmp) {
                            return !cmp._menu;
                        }
                    },
                    handler : function(cmp) {
                        let vm = this.up('criterion_selfservice_payroll_pay_history_info').getViewModel(),
                            cmpBox = cmp.getBox(),
                            menu = new Ext.menu.Menu({
                                cls : 'popup-options',

                                bodyPadding : '5 20 15 10',

                                padding : 0,

                                width : 280,

                                shadow : false,

                                listeners : {
                                    hide : function() {
                                        cmp._menu.destroy();
                                        cmp._menu = null;
                                    }
                                },

                                items : [
                                    {
                                        xtype : 'toggleslidefield',
                                        fieldLabel : i18n.gettext('Download report with SSN'),
                                        labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDER_WIDTH,
                                        margin : '5 0 0 0',
                                        value : vm.get('includeSSN'),
                                        handler : function(toggle, value) {
                                            vm.set('includeSSN', value);

                                            Ext.defer(function() {
                                                menu.getEl().fadeOut({
                                                    callback : function() {
                                                        menu.hide();
                                                    }
                                                });
                                            }, 300);
                                        }
                                    }
                                ]
                            });

                        cmp._menu = menu;
                        menu.showAt([cmpBox.right - 278, cmpBox.bottom + 10], true);
                    }
                }
            ]
        },
        {
            xtype : 'toolbar',
            dock : 'bottom',
            padding : '19 0 25',
            cls : 'criterion-ess-panel-toolbar',

            items : [
                '->',
                {
                    xtype : 'button',
                    text : i18n.gettext('Back'),
                    ui : 'light',
                    listeners : {
                        click : 'handleCancelClick'
                    }
                }
            ]
        }
    ],

    padding : '20 25 0 25',

    bodyPadding : 0,

    items : [
        {
            xtype : 'polar',

            reference : 'chart',

            ui : 'clean',

            frame : true,

            height : 220,

            margin : 0,

            innerPadding : 5,

            background : '#F9F9FD',

            bind : {
                store : '{payrollInfoTotals}'
            },

            legend : {
                type : 'dom',
                docked : 'left',
                userCls : 'pay-chart-legend',
                style : {
                    backgroundColor : '#F9F9FD',
                    overflowY : 'hidden'
                },
                toggleable : false
            },

            series : [
                {
                    type : 'criterion_pie',
                    angleField : 'amount',
                    donut : 75,
                    rotation : 120,
                    legendField : 'title',
                    background : '#F9F9FD',
                    label : {
                        field : 'percent',
                        display : 'inside',
                        fontWeight : 'bold',
                        fontSize : 10,
                        color : '#ffffff'
                    },
                    highlight : true,
                    colors : ['#29CFCF', '#FF4975', '#FFB118'],
                    renderer : () => {
                        return {
                            strokeStyle : 'none'
                        };
                    }
                },
                {
                    type : 'pie',
                    angleField : 'amount',
                    donut : 75,
                    rotation : 120,
                    background : '#F9F9FD',
                    label : {
                        field : 'amountFormatted',
                        display : 'outside',
                        fontWeight : 'bold',
                        color : '#343C4F',
                        calloutLine : {
                            length : 35
                        }
                    },
                    highlight : false,
                    showInLegend : false,
                    renderer : () => {
                        return {
                            strokeStyle : 'none',
                            fillStyle : 'none'
                        };
                    }
                }
            ]
        },
        {
            xtype : 'component',

            cls : 'plain-header-title',
            margin : '37 0 0 0',
            html : i18n.gettext('Payments Detail')
        },
        {
            xtype : 'container',

            layout : {
                type : 'hbox'
            },

            defaults : {
                xtype : 'criterion_gridpanel',

                flex : 1,

                height : 'auto',

                cls : 'criterion-ess-panel criterion-grid-panel-simple-list',

                padding : '10 10 0 0',

                listeners : {
                    afterrender : function() {
                        let headerIconCls = this.headerIconCls,
                            el;

                        if (!headerIconCls) {
                            return;
                        }

                        el = this.getView().headerCt.getHeaderAtIndex(0).getEl();

                        el.insertFirst({
                            tag : 'span',
                            class : 'column-header-icon ' + headerIconCls
                        });
                    }
                }
            },

            items : [
                {
                    bind : {
                        store : '{payrollNotes}'
                    },
                    headerIconCls : 'pay-notes-icon',
                    columns : [
                        {
                            text : i18n.gettext('Pay Notes'),
                            dataIndex : 'text',
                            flex : 1,
                            renderer : function(value, meta, rec) {
                                return value + ' --- ' + rec.get('subText');
                            }
                        }
                    ]
                },
                {
                    bind : {
                        store : '{incomes}'
                    },
                    headerIconCls : 'incomes-icon',
                    columns : [
                        {
                            text : i18n.gettext('Income'),
                            dataIndex : 'name',
                            flex : 1
                        },
                        {
                            dataIndex : 'amount',
                            renderer : criterion.LocalizationManager.currencyFormatter,
                            width : 120
                        }
                    ]
                },
                {
                    bind : {
                        store : '{taxes}'
                    },
                    headerIconCls : 'taxes-icon',
                    columns : [
                        {
                            text : i18n.gettext('Tax'),
                            dataIndex : 'name',
                            flex : 1
                        },
                        {
                            bind : {
                                text : '{taxesPercent}'
                            },
                            dataIndex : 'amount',
                            renderer : criterion.LocalizationManager.currencyFormatter,
                            width : 120
                        }
                    ]
                },
                {
                    bind : {
                        store : '{deductions}'
                    },

                    padding : '10 0 0 10',

                    headerIconCls : 'deductions-icon',

                    columns : [
                        {
                            text : i18n.gettext('Deduction'),
                            dataIndex : 'name',
                            flex : 1
                        },
                        {
                            bind : {
                                text : '{deductionsPercent}'
                            },
                            dataIndex : 'deductionAmount',
                            renderer : criterion.LocalizationManager.currencyFormatter,
                            width : 120
                        }
                    ]
                }
            ]
        }
    ],

    loadRecord : function(record) {
        var me = this,
            payrollId = record.getId(),
            vm = me.getViewModel(),
            incomes = vm.getStore('incomes'),
            deductions = vm.getStore('deductions'),
            taxes = vm.getStore('taxes'),
            payrollNotes = vm.getStore('payrollNotes'),
            payrollInfoTotals = vm.getStore('payrollInfoTotals'),
            employeePayrollNotesText, batchPayrollNotesText, payrollNotesText,
            netPay, taxesTotal, deductionsTotal, totalSum,
            incomePercent, taxesPercent, deductionsPercent,
            incomePercentFormatted, taxesPercentFormatted, deductionsPercentFormatted;

        Ext.create('Ext.Component', {
            renderTo : me.lookup('chart').down('legend').getEl(),

            cls : 'plain-header-title',
            margin : '7 0 0 0',
            bind : {
                html : '<div class="gross-pay">' + Ext.util.Format.currency(record.get('grossIncomeTotal')) + '</div>' +
                    '<div class="gross-pay-sub">' + i18n.gettext('Gross Pay') + '</div>'
            }
        });

        me.setLoading(true);
        criterion.Api.requestWithPromise({
            url : criterion.consts.Api.API.PAYROLL_DETAILS,
            params : {
                payrollId : payrollId
            },
            method : 'GET'
        }).then(function(response) {
            employeePayrollNotesText = response['employeePayrollNotes'];
            batchPayrollNotesText = response['payroll']['batchPayrollNotes'];
            payrollNotesText = response['payroll']['payrollNotes'];

            incomes.loadData(response.payrollIncomes);
            deductions.loadData(Ext.Array.filter(response.payrollDeductIns, item => item['isEmployee']));
            taxes.loadData(response.employeeTaxes);

            netPay = response['payroll']['netPay'];
            taxesTotal = taxes.sum('amount');
            deductionsTotal = deductions.sum('deductionAmount');
            totalSum = netPay + taxesTotal + deductionsTotal;
            incomePercent = parseFloat((netPay / totalSum).toFixed(4));
            taxesPercent = parseFloat((taxesTotal / totalSum).toFixed(4));
            deductionsPercent = 1 - incomePercent - taxesPercent;
            incomePercentFormatted = Ext.util.Format.percent(incomePercent, '0.');
            taxesPercentFormatted = Ext.util.Format.percent(taxesPercent, '0.');
            deductionsPercentFormatted = Ext.util.Format.percent(deductionsPercent, '0.');

            payrollInfoTotals.loadData([
                {
                    title : i18n.gettext('Net Pay'),
                    percent : incomePercentFormatted,
                    amount : netPay,
                    amountFormatted : criterion.LocalizationManager.currencyFormatter(netPay)
                },
                {
                    title : i18n.gettext('Taxes'),
                    percent : taxesPercentFormatted,
                    amount : taxesTotal,
                    amountFormatted : criterion.LocalizationManager.currencyFormatter(taxesTotal)
                },
                {
                    title : i18n.gettext('Deductions'),
                    percent : deductionsPercentFormatted,
                    amount : deductionsTotal,
                    amountFormatted : criterion.LocalizationManager.currencyFormatter(deductionsTotal)
                }
            ]);

            payrollNotes.removeAll();

            if (employeePayrollNotesText) {
                payrollNotes.loadData([
                    {
                        text : employeePayrollNotesText,
                        subText : i18n.gettext('Employee Record')
                    }
                ], true);
            }

            if (batchPayrollNotesText) {
                payrollNotes.loadData([
                    {
                        text : batchPayrollNotesText,
                        subText : i18n.gettext('Payroll Batch')
                    }
                ], true);
            }

            if (payrollNotesText) {
                payrollNotes.loadData([
                    {
                        text : payrollNotesText,
                        subText : i18n.gettext('Payroll Entries')
                    }
                ], true);
            }

            vm.set({
                incomePercent : incomePercentFormatted,
                grossPay : netPay + taxesTotal + deductionsTotal,
                taxesPercent : taxesPercentFormatted,
                deductionsPercent : deductionsPercentFormatted,
            });

        }).always(function() {
            me.setLoading(false);
        });

        me.callParent(arguments);
    }
});


Ext.define('ess.view.payroll.PayHistory', function() {

    return {

        alias : 'widget.ess_modern_payroll_pay_history',

        extend : 'Ext.Container',

        requires : [
            'ess.controller.payroll.PayHistory',
            'criterion.store.Payrolls',
            'ess.view.payroll.PayHistoryInfo',
            'criterion.chart.PolarChart'
        ],

        controller : {
            type : 'ess_modern_payroll_pay_history'
        },

        listeners : {
            painted : 'handlePainted'
        },

        viewModel : {
            data : {
                payHistoryExpanded : false,
                nextPayDate : null
            },

            stores : {
                payrolls : {
                    type : 'criterion_payrolls',
                    remoteSort : true,
                    autoSync : false
                },
                payDateYears : {
                    fields : ['text', 'value']
                },
                payrollTotals : {
                    fields : [
                        {
                            name : 'title',
                            type : 'string'
                        },
                        {
                            name : 'amount',
                            type : 'float'
                        }
                    ]
                }
            },
            formulas : {
                hasPayrollData : {
                    bind : {
                        bindTo : '{payrolls}',
                        deep : true
                    },
                    get : function(store) {
                        return !!store.count();
                    }
                },
                payrollsLoaded : {
                    bind : {
                        bindTo : '{payrolls}',
                        deep : true
                    },
                    get : function(store) {
                        return store.isLoaded();
                    }
                },

                grossPay : {
                    bind : {
                        bindTo : '{payrolls}',
                        deep : true
                    },
                    get : function(store) {
                        return store.sum('grossIncomeTotal');
                    }
                },
                payrollTotals : {
                    bind : {
                        bindTo : '{payrolls}',
                        deep : true
                    },
                    get : function(store) {
                        let employeeTaxTotal = store.sum('employeeTaxTotal'),
                            employeeDeductionTotal = store.sum('employeeDeductionTotal'),
                            netPay = store.sum('netPay'),
                            grossIncomeTotal = store.sum('grossIncomeTotal');

                        return [
                            {
                                title : 'Net Pay',
                                percent : Ext.util.Format.percent(netPay / grossIncomeTotal, '0.##'),
                                amount : netPay,
                                amountFormatted : criterion.LocalizationManager.currencyFormatter(netPay)
                            },
                            {
                                title : 'Taxes',
                                percent : Ext.util.Format.percent(employeeTaxTotal / grossIncomeTotal, '0.##'),
                                amount : employeeTaxTotal,
                                amountFormatted : criterion.LocalizationManager.currencyFormatter(employeeTaxTotal)
                            },
                            {
                                title : 'Deductions',
                                percent : Ext.util.Format.percent(employeeDeductionTotal / grossIncomeTotal, '0.##'),
                                amount : employeeDeductionTotal,
                                amountFormatted : criterion.LocalizationManager.currencyFormatter(employeeDeductionTotal)
                            }
                        ];
                    }
                },
                expandCollapseIcon : function(get) {
                    return get('payHistoryExpanded') ? 'md-icon-keyboard-arrow-down' : 'md-icon-keyboard-arrow-up';
                }
            }
        },

        padding : 0,

        height : '100%',

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        cls : 'ess-pay-history light-grey-bg',

        items : [
            {
                xtype : 'component',

                cls : 'payroll-no-data light-grey-bg',

                hidden : true,

                bind : {
                    hidden : '{hasPayrollData}'
                },

                html : '<div class="no-data-image"></div>' +
                    '<div class="no-data-title">There is no data to display</div>' +
                    '<div class="no-data-text">The payment history will begin after making the first payment.</div>'
            },
            {
                xtype : 'container',

                hidden : true,

                bind : {
                    hidden : '{!hasPayrollData}'
                },

                items : [
                    {
                        xtype : 'container',

                        layout : {
                            type : 'hbox'
                        },

                        bind : {
                            hidden : '{payHistoryExpanded}'
                        },

                        userCls : 'light-grey-bg',

                        items : [
                            {
                                xtype : 'container',

                                layout : 'vbox',

                                margin : '26 0 0 16',

                                items : [
                                    {
                                        xtype : 'component',
                                        bind : {
                                            html : '<span class="gross-pay-text">{grossPay:currency}</span>'
                                        }
                                    },
                                    {
                                        xtype : 'component',
                                        bind : {
                                            html : '<span class="gross-pay-sub-text">Gross Pay</span>'
                                        }
                                    }
                                ]
                            },
                            {
                                xtype : 'component',
                                flex : 1
                            },
                            {
                                xtype : 'container',

                                layout : 'vbox',

                                margin : '26 16 0 0',

                                items : [
                                    {
                                        xtype : 'combobox',
                                        reference : 'payDateYearsCombo',
                                        queryMode : 'local',
                                        editable : false,
                                        forceSelection : true,
                                        maxWidth : 150,
                                        bind : {
                                            store : '{payDateYears}'
                                        },
                                        displayField : 'text',
                                        valueField : 'value',
                                        listeners : {
                                            change : 'onSelectedYearChange'
                                        }
                                    },
                                    {
                                        xtype : 'component',
                                        flex : 1
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        xtype : 'criterion_polar',

                        width : '100%',

                        margin : 0,

                        innerPadding : 5,

                        background : criterion.consts.Colors.B_GRAY,

                        responsiveConfig : {
                            landscape : {
                                height : 0
                            },
                            portrait : {
                                height : Ext.getBody().getHeight() / 3
                            }
                        },

                        bind : {
                            store : '{payrollTotals}',
                            hidden : '{payHistoryExpanded}'
                        },

                        series : [
                            {
                                type : 'criterion_pie',
                                angleField : 'amount',
                                donut : 70,
                                rotation : 120,
                                legendField : 'title',
                                background : criterion.consts.Colors.B_GRAY,
                                label : {
                                    field : 'percent',
                                    display : 'inside',
                                    fontSize : criterion.Consts.UI_DEFAULTS.TOUCH_DEVICE_LOW_HEIGHT ? 6 : 9,
                                    fontWeight : 'bold',
                                    color : criterion.consts.Colors.WHITE
                                },
                                highlight : true,
                                colors : criterion.consts.Colors.CHART_COLORS,
                                renderer : () => {
                                    return {
                                        strokeStyle : 'none'
                                    };
                                }
                            },
                            {
                                type : 'pie',
                                angleField : 'amount',
                                donut : 70,
                                rotation : 120,
                                background : criterion.consts.Colors.B_GRAY,
                                label : {
                                    field : 'amountFormatted',
                                    display : 'outside',
                                    fontSize : criterion.Consts.UI_DEFAULTS.TOUCH_DEVICE_LOW_HEIGHT ? 10 : 12,
                                    fontWeight : 'bold',
                                    color : criterion.consts.Colors.BLACK,
                                    calloutLine : {
                                        length : 20
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
                    }
                ]
            },
            {
                xtype : 'component',

                flex : 1,

                bind : {
                    hidden : '{hasPayrollData}'
                }
            },
            {
                xtype : 'panel',

                scrollable : true,

                ui : 'rounded-corner',

                margin : '10 0',

                bind : {
                    hidden : '{!hasPayrollData && !nextPayDate}',
                    flex : '{!hasPayrollData ? 2 : 1}'
                },

                items : [
                    {
                        xtype : 'toolbar',

                        ui : 'rounded-corner',

                        items : [
                            {
                                xtype : 'component',

                                html : 'Payments',

                                margin : '0 0 0 16'
                            },
                            '->',
                            {
                                xtype : 'button',

                                bind : {
                                    iconCls : '{expandCollapseIcon} grey-color',
                                    hidden : '{!hasPayrollData && !!nextPayDate}'
                                },

                                margin : '0 16 0 0',

                                handler : 'handleTapFullScreenButton'
                            }
                        ]
                    },
                    {
                        xtype : 'component',

                        cls : 'ess-dataview-two-col-table',

                        margin : '0 16',

                        bind : {
                            hidden : '{!nextPayDate}',
                            html : '<table class="highlighted-dataview-item dataview-item">' +
                                '<tr>' +
                                '<td class="label-text">Next Pay Date:</td>' +
                                '<td class="value-text">{nextPayDate:date("' + criterion.consts.Api.TEXTUAL_MONTH_DATE_FORMAT + '")}</td>' +
                                '</tr>' +
                                '</table>'
                        }
                    },
                    {
                        xtype : 'dataview',

                        reference : 'payHistoryGrid',

                        bind : {
                            store : '{payrolls}'
                        },

                        cls : 'ess-dataview-two-col-table',

                        margin : '0 16',

                        itemTpl : '<table class="dataview-item">' +
                            '<tr>' +
                            '<td class="label-text">{payDate:date("' + criterion.consts.Api.TEXTUAL_MONTH_DATE_FORMAT + '")}</td>' +
                            '<td class="value-text">{netPay:currency}</td>' +
                            '<td rowspan="2" class="details-cell">' +
                            '<span class="details-arrow x-font-icon md-icon-keyboard-arrow-right"></span>' +
                            '</td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td class="sub-label-text">Pay Date</td>' +
                            '<td class="sub-value-text">Net Pay</td>' +
                            '</tr>' +
                            '</table>',

                        listeners : {
                            childtap : function handleAction(cmp, loc) {
                                var record = loc.record,
                                    main = this.up('ess_modern_payroll'),
                                    form = main.down('criterion_payroll_pay_history_info');

                                form.getViewModel().set('record', record);
                                form.loadRecord(record);
                                main.getLayout().setAnimation({
                                        type : 'slide',
                                        direction : 'left'
                                    }
                                );
                                main.setActiveItem(form);
                                main.getViewModel().set({
                                    title : Ext.Date.format(record.get('payDate'), criterion.consts.Api.DATE_FORMAT_US),
                                    detailsMode : true
                                });
                            }
                        }
                    }
                ]
            }
        ]
    };
});


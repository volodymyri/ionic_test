Ext.define('criterion.view.ess.payroll.PayHistory', {

    alias : 'widget.criterion_selfservice_payroll_pay_history',

    extend : 'criterion.view.GridView',

    requires : [
        'criterion.controller.ess.payroll.PayHistory',
        'criterion.store.Payrolls',
        'criterion.view.ess.payroll.PayHistoryInfo',
        'Ext.chart.PolarChart',
        'criterion.chart.series.Pie',
        'Ext.chart.interactions.ItemHighlight'
    ],

    viewModel : {
        data : {
            nextPayDate : null,
            showSSN : false
        },
        stores : {
            payrolls : {
                type : 'criterion_payrolls',
                autoSync : false
            },
            payDateYears : {
                fields : ['text', 'value']
            }
        },
        formulas : {
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
                            title : i18n.gettext('Net Pay'),
                            percent : Ext.util.Format.percent(netPay / grossIncomeTotal, '0.'),
                            amount : netPay,
                            amountFormatted : criterion.LocalizationManager.currencyFormatter(netPay)
                        },
                        {
                            title : i18n.gettext('Taxes'),
                            percent : Ext.util.Format.percent(employeeTaxTotal / grossIncomeTotal, '0.'),
                            amount : employeeTaxTotal,
                            amountFormatted : criterion.LocalizationManager.currencyFormatter(employeeTaxTotal)
                        },
                        {
                            title : i18n.gettext('Deductions'),
                            percent : Ext.util.Format.percent(employeeDeductionTotal / grossIncomeTotal, '0.'),
                            amount : employeeDeductionTotal,
                            amountFormatted : criterion.LocalizationManager.currencyFormatter(employeeDeductionTotal)
                        }
                    ];
                }
            }
        }
    },

    listeners : {
        viewaction : 'onAttachmentView'
    },

    controller : {
        type : 'criterion_selfservice_payroll_pay_history',

        editor : {
            xtype : 'criterion_selfservice_payroll_pay_history_info',
            plugins : [
                {
                    ptype : 'criterion_sidebar'
                }
            ]
        }
    },

    tbar : null,

    bind : {
        store : '{payrolls}'
    },

    scrollable : true,

    header : {

        title : {
            height : 0
        },

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        padding : '20 25 30 25',

        items : [
            {
                xtype : 'container',

                layout : {
                    type : 'hbox',
                    align : 'top'
                },

                items : [
                    {
                        xtype : 'component',

                        cls : 'plain-header-title',
                        margin : '7 0 0 0',
                        html : i18n.gettext('Pay History')
                    },
                    {
                        xtype : 'tbfill'
                    },
                    {
                        xtype : 'button',
                        cls : 'criterion-btn-glyph-only',
                        glyph : criterion.consts.Glyph['ios7-more'],
                        scale : 'medium',
                        listeners : {
                            click : 'handleBeforeShowOptionsClick'
                        },
                        handler : 'handleShowOptionsClick'
                    },
                    {
                        xtype : 'tbspacer'
                    },
                    {
                        xtype : 'button',
                        reference : 'refreshButton',
                        cls : 'criterion-btn-glyph-only',
                        glyph : criterion.consts.Glyph['ios7-refresh-empty'],
                        scale : 'medium',
                        listeners : {
                            click : 'handleRefreshClick'
                        }
                    }
                ]
            },
            {
                xtype : 'container',

                layout : {
                    type : 'hbox',
                    align : 'top'
                },

                items : [
                    {
                        xtype : 'polar',

                        ui : 'clean',

                        frame : true,

                        height : 220,

                        flex : 2,

                        margin : '0 0 0 0',

                        innerPadding : 5,

                        background : '#F9F9FD',

                        bind : {
                            store : '{payrollTotals}'
                        },

                        legend : {
                            type : 'dom',
                            docked : 'left',
                            userCls : 'pay-chart-legend',
                            style : {
                                backgroundColor : '#F9F9FD'
                            },
                            toggleable : false,
                            tpl : new Ext.XTemplate(
                                '<div class="', Ext.baseCSSPrefix, 'legend-inner">', // for IE8 vertical centering
                                '<div class="gross-pay">{[this.grossPay()]}</div>',
                                '<div class="gross-pay-sub">', i18n.gettext('Gross Pay'), '</div>',
                                '<div class="', Ext.baseCSSPrefix, 'legend-container">',
                                '<tpl for=".">',
                                '<div class="', Ext.baseCSSPrefix, 'legend-item">',
                                '<span ',
                                'class="', Ext.baseCSSPrefix, 'legend-item-marker {[ values.disabled ? Ext.baseCSSPrefix + \'legend-item-inactive\' : \'\' ]}" ',
                                'style="background:{mark};">',
                                '</span>{name}',
                                '</div>',
                                '</tpl>',
                                '</div>',
                                '</div>',
                                {
                                    grossPay : function() {
                                        return Ext.util.Format.currency(this.owner.chart.store.sum('amount'));
                                    }
                                }
                            )
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
                        xtype : 'toolbar',

                        height : '100%',

                        vertical : true,

                        margin : '26 16 0 0',

                        items : [
                            {
                                xtype : 'combobox',
                                reference : 'payDateYearsCombo',
                                cls : 'round-border-combo',
                                queryMode : 'local',
                                editable : false,
                                forceSelection : true,
                                width : 220,
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
                                xtype : 'tbfill'
                            },
                            {
                                xtype : 'component',

                                cls : 'next-pay-date',

                                bind : {
                                    hidden : '{!nextPayDate}',
                                    html : Ext.String.format('<span class="title">{0}</span>{1}', i18n.gettext('Next Pay Date:'), '{nextPayDate:date("' + criterion.consts.Api.TEXTUAL_MONTH_DATE_FORMAT + '")}')
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    },

    columns : [
        {
            xtype : 'datecolumn',
            text : i18n.gettext('Pay Date'),
            dataIndex : 'payDate',
            width : 150
        },
        {
            xtype : 'gridcolumn',
            text : i18n.gettext('Gross Pay'),
            dataIndex : 'grossIncomeTotal',
            flex : 1,
            renderer : criterion.LocalizationManager.currencyFormatter
        },
        {
            xtype : 'gridcolumn',
            text : i18n.gettext('Taxes'),
            dataIndex : 'employeeTaxTotal',
            flex : 1,
            renderer : criterion.LocalizationManager.currencyFormatter
        },
        {
            xtype : 'gridcolumn',
            text : i18n.gettext('Deductions'),
            dataIndex : 'employeeDeductionTotal',
            flex : 1,
            renderer : criterion.LocalizationManager.currencyFormatter
        },
        {
            xtype : 'gridcolumn',
            text : i18n.gettext('Net Pay'),
            dataIndex : 'netPay',
            flex : 1,
            renderer : criterion.LocalizationManager.currencyFormatter
        },
        {
            xtype : 'criterion_widgetcolumn',
            width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH,
            text : i18n.gettext('PDF'),
            widget : {
                xtype : 'button',
                margin : '5 0 0 0',
                tooltip : i18n.gettext('Download'),
                glyph : criterion.consts.Glyph['ios7-download-outline'],
                ui : 'glyph',
                handler : 'onAttachmentDownload',
                dataIndex : 'payDate'
            }
        }
    ]

});


Ext.define('ess.view.payroll.PayHistoryInfo', function() {

    return {

        alias : 'widget.criterion_payroll_pay_history_info',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.model.payroll.Income',
            'criterion.model.employer.payroll.PayrollTotal',
            'criterion.model.employee.Deduction'
        ],

        viewModel : {
            data : {
                record : null,
                showPayNotes : true,
                showIncomes : true,
                showTaxes : true,
                showDeductions : true,
                showActionPanel : false,
                incomePercent : '',
                taxesPercent : '',
                deductionsPercent : '',
                payDetailsExpanded : false,
                showSSN : false,
                payNotesExists : false,
                grossPay : null,
                payNotesCount : 0
            },
            stores : {
                incomes : {
                    type : 'array',
                    model : 'criterion.model.payroll.Income'
                },
                employeeTaxes : {
                    type : 'array',
                    fields : [
                        {
                            name : 'name',
                            type : 'string'
                        },
                        {
                            name : 'amount',
                            type : 'float'
                        },
                        {
                            name : 'ytd',
                            type : 'float'
                        }
                    ]
                },
                deductions : {
                    type : 'array',
                    model : 'criterion.model.employee.Deduction'
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
                            type : 'float'
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
                }
            },
            formulas : {
                clsPayNotes : function(data) {
                    return data('showPayNotes') ? 'fa-chevron-up' : 'fa-chevron-down';
                },
                clsIncome : function(data) {
                    return data('showIncomes') ? 'fa-chevron-up' : 'fa-chevron-down';
                },

                clsTax : function(data) {
                    return data('showTaxes') ? 'fa-chevron-up' : 'fa-chevron-down';
                },

                clsDeduction : function(data) {
                    return data('showDeductions') ? 'fa-chevron-up' : 'fa-chevron-down';
                },

                expandCollapseIcon : function(get) {
                    return get('payDetailsExpanded') ? 'md-icon-keyboard-arrow-down' : 'md-icon-keyboard-arrow-up';
                }
            }
        },

        cls : 'ess-pay-history ess-pay-history-info',

        height : '100%',

        padding : 0,

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        referenceHolder : true,

        listeners : {
            downloadPayrollReport : function() {
                let vm = this.getViewModel(),
                    payDate = Ext.Date.format(vm.get('record.payDate'), criterion.consts.Api.DATE_FORMAT),
                    showSSN = vm.get('showSSN');

                window.open(criterion.Api.getSecureResourceUrl(
                    Ext.util.Format.format(criterion.consts.Api.API.EMPLOYEE_DOWNLOAD_PAY_CHECK_REPORT, payDate, showSSN, vm.get('record.id'))
                ), window.Cordova ? '_system' : '_blank');
            },
            showDownloadSettings : function() {
                let vm = this.getViewModel();

                Ext.Viewport.setMenu(
                    {
                        items : [
                            {
                                xtype : 'togglefield',
                                label : i18n.gettext('Download report with SSN'),
                                labelAlign : 'left',
                                flex : 1,
                                labelWidth : '80%',
                                value : vm.get('showSSN'),
                                listeners : {
                                    change : (cmp, value) => {
                                        vm.set('showSSN', value);
                                    }
                                }
                            }
                        ]
                    },
                    {
                        side : 'bottom',
                        cover : true
                    }
                );

                Ext.Viewport.showMenu('bottom');
            }
        },

        userCls : 'light-grey-bg',

        items : [
            {
                xtype : 'container',

                layout : 'vbox',

                userCls : 'light-grey-bg',

                padding : '26 0 0 16',

                bind : {
                    hidden : '{payDetailsExpanded}'
                },

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
                xtype : 'polar',

                width : '100%',

                height : Ext.getBody().getHeight() / 3,
                downloadServerUrl : '-',

                margin : '0 0 0 0',

                innerPadding : 5,

                background : '#F9F9FD',

                userCls : 'light-grey-bg',

                bind : {
                    store : '{payrollInfoTotals}',
                    hidden : '{payDetailsExpanded}'
                },

                legend : {
                    type : 'dom',
                    docked : 'bottom',
                    userCls : 'pay-chart-legend',
                    toggleable : false
                },

                series : [
                    {
                        type : 'criterion_pie',
                        angleField : 'amount',
                        donut : 70,
                        rotation : 120,
                        legendField : 'title',
                        background : '#F9F9FD',
                        label : {
                            field : 'percent',
                            display : 'inside',
                            fontSize : criterion.Consts.UI_DEFAULTS.TOUCH_DEVICE_LOW_HEIGHT ? 6 : 9,
                            fontWeight : 'bold',
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
                        donut : 70,
                        rotation : 120,
                        background : '#F9F9FD',
                        label : {
                            field : 'amountFormatted',
                            display : 'outside',
                            fontSize : criterion.Consts.UI_DEFAULTS.TOUCH_DEVICE_LOW_HEIGHT ? 10 : 12,
                            fontWeight : 'bold',
                            color : '#343C4F',
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
            },
            {
                xtype : 'panel',

                scrollable : true,

                ui : 'rounded-corner',

                margin : '10 0',

                bodyPadding : '0 16',

                flex : 1,

                items : [
                    {
                        xtype : 'toolbar',

                        ui : 'rounded-corner',

                        items : [
                            {
                                xtype : 'component',

                                html : 'Payments Detail'
                            },
                            '->',
                            {
                                xtype : 'button',

                                itemId : 'fullScreenButton',

                                bind : {
                                    iconCls : '{expandCollapseIcon} grey-color'
                                }
                            }
                        ]
                    },
                    {
                        xtype : 'container',

                        cls : 'dataview-item',

                        bind : {
                            hidden : '{!payNotesExists}'
                        },

                        items : [
                            {
                                xtype : 'component',
                                cls : 'info-block-title',
                                itemId : 'payNotesHeader',
                                bind : {
                                    html : '<span class="pay-notes-icon"></span><span class="title">Pay Notes</span><span class="title-right">{payNotesCount}</span><i class="x-fa {clsPayNotes}"></i>'
                                },
                                padding : '6 0',
                                margin : '6 0 0'
                            },
                            {
                                xtype : 'dataview',

                                cls : 'info-block-wrapper',

                                bind : {
                                    store : '{payrollNotes}',
                                    hidden : '{!showPayNotes}'
                                },
                                itemTpl : '<table class="info-block pay-notes">' +
                                    '<tr>' +
                                    '<td class="info-block-name">{text}</td>' +
                                    '</tr>' +
                                    '<tr>' +
                                    '<td class="info-block-sub">{subText}</td>' +
                                    '</tr>' +
                                    '</table>',
                                scrollable : false,
                                padding : '12 0 0'
                            }
                        ]
                    },
                    {
                        xtype : 'container',

                        cls : 'dataview-item',

                        items : [
                            {
                                xtype : 'component',
                                cls : 'info-block-title',
                                itemId : 'incomeHeader',
                                bind : {
                                    html : '<span class="incomes-icon"></span><span class="title">Income</span><span class="title-right">&nbsp;</span><i class="x-fa {clsIncome}"></i>',
                                },
                                padding : '10 0',
                                margin : '10 0 0 0'
                            },
                            {
                                xtype : 'dataview',

                                cls : 'info-block-wrapper',

                                bind : {
                                    store : '{incomes}',
                                    hidden : '{!showIncomes}'
                                },
                                itemTpl : '<table class="info-block"><tr>' +
                                    '<td class="info-block-name">{name}</td>' +
                                    '<td class="info-block-value">{amount:currency}</td>' +
                                    '</tr></table>',
                                scrollable : false,
                                padding : '10 0'
                            }
                        ]
                    },
                    {
                        xtype : 'container',

                        cls : 'dataview-item',

                        items : [
                            {
                                xtype : 'component',
                                cls : 'info-block-title',
                                bind : {
                                    html : '<span class="taxes-icon"></span><span class="title">Tax</span><span class="title-right">{taxesPercent}</span><i class="x-fa {clsTax}"></i>'
                                },
                                itemId : 'taxHeader',
                                padding : '10 0',
                                margin : '10 0 0 0'
                            },
                            {
                                xtype : 'dataview',

                                cls : 'info-block-wrapper no-border-top',

                                bind : {
                                    store : '{employeeTaxes}',
                                    hidden : '{!showTaxes}'
                                },
                                itemTpl : '<table class="info-block"><tr>' +
                                    '<td class="info-block-name">{name}</td>' +
                                    '<td class="info-block-value">{amount:currency}</td>' +
                                    '</tr></table>',
                                scrollable : false,
                                padding : '0 0 10 0'
                            }
                        ]
                    },
                    {
                        xtype : 'container',

                        cls : 'dataview-item',

                        items : [
                            {
                                xtype : 'component',
                                cls : 'info-block-title',
                                bind : {
                                    html : '<span class="deductions-icon"></span><span class="title">Deduction</span><span class="title-right">{deductionsPercent}</span><i class="x-fa {clsDeduction}"></i>'
                                },
                                itemId : 'deductionHeader',
                                margin : '10 0 0 0'
                            },
                            {
                                xtype : 'dataview',

                                cls : 'info-block-wrapper',

                                bind : {
                                    store : '{deductions}',
                                    hidden : '{!showDeductions}'
                                },
                                itemTpl : '<table class="info-block"><tr>' +
                                    '<td class="info-block-name">{name}</td>' +
                                    '<td class="info-block-value">{deductionAmount:currency}</td>' +
                                    '</tr></table>',
                                scrollable : false,
                                padding : '10 0',
                                margin : '0 0 30 0'
                            }
                        ]
                    }
                ]
            }
        ],

        initialize : function() {
            var vm = this.getViewModel();

            this.callParent(arguments);

            function getCallback(modificator) {
                return function() {
                    var val = vm.get(modificator);
                    vm.set(modificator, !val);
                }
            }

            this.down('#incomeHeader').el.on({
                tap : getCallback('showIncomes')
            });
            this.down('#taxHeader').el.on({
                tap : getCallback('showTaxes')
            });
            this.down('#deductionHeader').el.on({
                tap : getCallback('showDeductions')
            });
            this.down('#payNotesHeader').el.on({
                tap : getCallback('showPayNotes')
            });
            this.down('#fullScreenButton').on({
                tap : getCallback('payDetailsExpanded')
            });
        },

        loadRecord : function(record) {
            var me = this,
                payrollId = record.getId(),
                vm = me.getViewModel(),
                incomes = vm.getStore('incomes'),
                deductions = vm.getStore('deductions'),
                employeeTaxes = vm.getStore('employeeTaxes'),
                payrollInfoTotals = vm.getStore('payrollInfoTotals'),
                payrollNotes = vm.getStore('payrollNotes'),
                netPay, taxesTotal, deductionsTotal, totalSum,
                incomePercent, taxesPercent, deductionsPercent,
                incomePercentFormatted, taxesPercentFormatted, deductionsPercentFormatted,
                employeePayrollNotesText, batchPayrollNotesText, payrollNotesText;

            me.setLoading(true);

            criterion.Api.requestWithPromise({
                url : criterion.consts.Api.API.PAYROLL_DETAILS,
                params : {
                    payrollId : payrollId
                },
                method : 'GET'
            }).then(function(response) {
                incomes.loadData(response.payrollIncomes);
                deductions.loadData(Ext.Array.filter(response.payrollDeductIns, item => item['isEmployee']));
                employeeTaxes.loadData(response.employeeTaxes);

                netPay = response['payroll']['netPay'];
                taxesTotal = employeeTaxes.sum('amount');
                deductionsTotal = deductions.sum('deductionAmount');
                totalSum = netPay + taxesTotal + deductionsTotal;
                incomePercent = parseFloat((netPay / totalSum).toFixed(4));
                taxesPercent = parseFloat((taxesTotal / totalSum).toFixed(4));
                deductionsPercent = 1 - incomePercent - taxesPercent;

                incomePercentFormatted = Ext.util.Format.percent(incomePercent, '0.##');
                taxesPercentFormatted = Ext.util.Format.percent(taxesPercent, '0.##');
                deductionsPercentFormatted = Ext.util.Format.percent(deductionsPercent, '0.##');

                employeePayrollNotesText = response['employeePayrollNotes'];
                batchPayrollNotesText = response['payroll']['batchPayrollNotes'];
                payrollNotesText = response['payroll']['payrollNotes'];

                payrollInfoTotals.loadData([
                    {
                        title : 'Net Pay',
                        percent : incomePercentFormatted,
                        amount : netPay,
                        amountFormatted : criterion.LocalizationManager.currencyFormatter(netPay)
                    },
                    {
                        title : 'Taxes',
                        percent : taxesPercentFormatted,
                        amount : taxesTotal,
                        amountFormatted : criterion.LocalizationManager.currencyFormatter(taxesTotal)
                    },
                    {
                        title : 'Deductions',
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
                            subText : 'Employee Record'
                        }
                    ], true);
                }

                if (batchPayrollNotesText) {
                    payrollNotes.loadData([
                        {
                            text : batchPayrollNotesText,
                            subText : 'Payroll Batch'
                        }
                    ], true);
                }

                if (payrollNotesText) {
                    payrollNotes.loadData([
                        {
                            text : payrollNotesText,
                            subText : 'Payroll Entries'
                        }
                    ], true);
                }

                vm.set({
                    incomePercent : incomePercentFormatted,
                    grossPay : netPay + taxesTotal + deductionsTotal,
                    taxesPercent : taxesPercentFormatted,
                    deductionsPercent : deductionsPercentFormatted,
                    payNotesExists : !!employeePayrollNotesText || !!batchPayrollNotesText || !!payrollNotesText,
                    payNotesCount : +!!employeePayrollNotesText + +!!batchPayrollNotesText + +!!payrollNotesText
                })
            }).always(function() {
                me.setLoading(false);
            });

            me.callParent(arguments);
        }
    };
});



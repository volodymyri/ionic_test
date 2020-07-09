Ext.define('criterion.view.payroll.batch.PayrollEntry', function() {

    const BATCH_STATUSES = criterion.Consts.BATCH_STATUSES;

    return {

        alias : 'widget.criterion_payroll_batch_payrollentry',

        extend : 'criterion.ux.Panel',

        requires : [
            'criterion.controller.payroll.batch.PayrollEntry',
            'criterion.store.employer.payroll.BatchDetails',
            'criterion.store.employer.payrollBatch.IncomeLists',
            'criterion.view.payroll.batch.payrollEntry.Details',
            'criterion.ux.TransferButton',
            'Ext.grid.filters.Filters'
        ],

        viewModel : {
            data : {
                batchRecord : null,
                searchPersonResult : null,
                disableButtons : true,
                showExtraColumns : false,
                isCalculated : false,
                countSelectionDetail : 0
            },
            stores : {
                payrolls : {
                    type : 'criterion_employer_payroll_batch_details'
                },
                batchIncomes : {
                    model : 'criterion.model.employer.payroll.BatchIncome'
                },
                payrollBatchIncomeLists : {
                    type : 'criterion_employer_payroll_batch_income_lists'
                }
            },
            formulas : {
                viewDetailTitle : get => {
                    let countSelectionDetail = get('countSelectionDetail');

                    return i18n.gettext('View') + ` ${countSelectionDetail} ` + i18n.ngettext('Record', 'Records', countSelectionDetail);
                },
                extraColumnsTitle : get => get('showExtraColumns') ? i18n.gettext('Hide Income Columns') : i18n.gettext('Show Income Columns'),
                readOnlyMode : get => get('batchRecord.isCalculationInProgress') || (get('batchRecord.batchStatusCode') !== BATCH_STATUSES.PENDING_APPROVAL)
            }
        },

        listeners : {
            scope : 'controller',
            show : 'onShow'
        },

        controller : {
            type : 'criterion_payroll_batch_payrollentry'
        },

        layout : 'fit',

        bodyPadding : 0,

        dockedItems : [
            {
                dock : 'bottom',
                xtype : 'container',
                cls : 'x-panel-header-default',
                layout : 'hbox',
                defaults : {
                    minWidth : 100
                },
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
                        margin : '10 0 10 0'
                    },
                    {
                        xtype : 'button',
                        scale : 'small',
                        text : i18n.gettext('Next'),
                        listeners : {
                            scope : 'controller',
                            click : 'handleNextClick'
                        },
                        disabled : true,
                        bind : {
                            disabled : '{!isCalculated}'
                        },
                        margin : 10
                    }
                ]
            },
            {
                dock : 'top',
                xtype : 'container',
                layout : {
                    type : 'hbox'
                },
                items : [
                    {
                        xtype : 'button',
                        text : i18n.gettext('Add Employee'),
                        cls : 'criterion-btn-feature',
                        listeners : {
                            click : 'handleSelectEmployees'
                        },
                        hidden : true,
                        bind : {
                            hidden : criterion.SecurityManager.getComplexSecurityFormula({
                                append : 'readOnlyMode ||',
                                rules : [
                                    {
                                        key : criterion.SecurityManager.HR_KEYS.PAYROLL_BATCH_ADD_EMPLOYEE,
                                        actName : criterion.SecurityManager.ACT,
                                        reverse : true
                                    }
                                ]
                            })
                        },
                        margin : '15 0 15 10'
                    },
                    {
                        xtype : 'criterion_splitbutton',
                        text : i18n.gettext('Manage Incomes'),
                        cls : 'criterion-btn-feature',
                        listeners : {
                            click : 'handleIncomeManage'
                        },
                        hidden : true,
                        bind : {
                            hidden : criterion.SecurityManager.getComplexSecurityFormula({
                                append : 'readOnlyMode ||',
                                rules : [
                                    {
                                        key : criterion.SecurityManager.HR_KEYS.PAYROLL_BATCH_MANAGE_INCOMES,
                                        actName : criterion.SecurityManager.ACT,
                                        reverse : true
                                    }
                                ]
                            })
                        },
                        margin : '15 0 15 20',
                        menu : [
                            {
                                bind : {
                                    text : '{extraColumnsTitle}'
                                },
                                handler : 'onToggleExtraColumns'
                            }
                        ]
                    },
                    {
                        xtype : 'button',
                        text : i18n.gettext('Calculate'),
                        cls : 'criterion-btn-feature',
                        margin : '15 0 15 20',
                        hidden : true,
                        bind : {
                            hidden : criterion.SecurityManager.getComplexSecurityFormula({
                                append : 'readOnlyMode ||',
                                rules : [
                                    {
                                        key : criterion.SecurityManager.HR_KEYS.PAYROLL_BATCH_CALCULATE,
                                        actName : criterion.SecurityManager.ACT,
                                        reverse : true
                                    }
                                ]
                            })
                        },
                        listeners : {
                            click : 'handleCalculateClick'
                        }
                    },
                    {
                        xtype : 'button',
                        reference : 'details',
                        cls : 'criterion-btn-feature',
                        listeners : {
                            click : 'handleViewDetailsClick'
                        },
                        bind : {
                            text : '{viewDetailTitle}',
                            disabled : '{disableButtons}',
                            hidden : criterion.SecurityManager.getComplexSecurityFormula({
                                append : 'countSelectionDetail < 1 ||',
                                rules : [
                                    {
                                        key : criterion.SecurityManager.HR_KEYS.PAYROLL_BATCH_DETAILS,
                                        actName : criterion.SecurityManager.READ,
                                        reverse : true
                                    }
                                ]
                            })
                        },
                        hidden : true,
                        margin : '15 0 15 20'
                    },
                    {
                        xtype : 'tbfill'
                    },
                    {
                        xtype : 'component',
                        html : i18n.gettext('Payroll batch is being processed and cannot be changed.'),
                        cls : 'bold',
                        margin : '25 0 0 0',
                        hidden : true,
                        bind : {
                            hidden : '{!batchRecord.isCalculationInProgress}'
                        }
                    },
                    {
                        xtype: 'tbfill'
                    },
                    {
                        xtype : 'button',
                        text : i18n.gettext('Import'),
                        cls : 'criterion-btn-feature',
                        margin : '15 0 15 20',
                        hidden : true,
                        bind : {
                            hidden : criterion.SecurityManager.getComplexSecurityFormula({
                                append : 'readOnlyMode ||',
                                rules : [
                                    {
                                        key : criterion.SecurityManager.HR_KEYS.PAYROLL_BATCH_IMPORT,
                                        actName : criterion.SecurityManager.ACT,
                                        reverse : true
                                    }
                                ]
                            })
                        },
                        listeners : {
                            click : 'handleImportClick'
                        }
                    },
                    {
                        xtype : 'criterion_transfer_button',
                        text : i18n.gettext('Export'),
                        cls : 'criterion-btn-feature',
                        margin : '15 10 15 20',
                        transferAlias : 'payroll_batch_export',
                        hidden : true,
                        bind : {
                            parameters : {
                                batchId : '{batchRecord.id}',
                                outputFile : 'Payroll Batch {batchRecord.name}.xls'
                            },
                            hidden : criterion.SecurityManager.getComplexSecurityFormula({
                                append : 'batchRecord.isCalculationInProgress ||',
                                rules : [
                                    {
                                        key : criterion.SecurityManager.HR_KEYS.PAYROLL_BATCH_EXPORT,
                                        actName : criterion.SecurityManager.ACT,
                                        reverse : true
                                    }
                                ]
                            })
                        }
                    },
                    {
                        xtype : 'button',
                        scale : 'medium',
                        margin : '17 5 15 0',
                        cls : 'criterion-btn-transparent',
                        enableToggle : true,
                        glyph : criterion.consts.Glyph['calculator'],
                        tooltip : i18n.gettext('Show Summary'),
                        handler : 'handleShowSummary'
                    }
                ]
            }
        ],

        items : [
            {
                xtype : 'criterion_gridpanel',
                cls : 'widgets-grid',
                reference : 'grid',
                layout : 'fit',

                border : '1 0 0 0',

                plugins : [
                    'gridfilters'
                ],

                stateId : 'payrollEntry',
                stateful : true,

                listeners : {
                    scope : 'controller',
                    beforecellclick : 'handleViewDetail',
                    removeaction : 'remove'
                },

                viewConfig : {
                    markDirty : false,

                    getRowClass : function(record) {
                        return record.get('isActive') ? '' : 'inactive-entry';
                    }
                },

                disableGrouping : true,

                selModel : {
                    selType : 'checkboxmodel',
                    checkOnly : true,
                    mode : 'MULTI',
                    listeners : {
                        scope : 'controller',
                        selectionchange : 'onSelectionDetails'
                    }
                },

                tbar : null,
                dockedItems : {
                    xtype : 'criterion_toolbar_paging',
                    reference : 'pagingToolbar',
                    dock : 'bottom',
                    displayInfo : true,
                    allowLoadAll : false,
                    totalText : '{0} ' + i18n.gettext('employees'),

                    allowAutoLoad : true,
                    stateId : 'payrollEntry',
                    stateful : true
                },

                bufferedRenderer : false,

                columns : {
                    defaults : {
                        width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH
                    },
                    items : []
                }
            }
        ],

        constructGrid : function(store, incomeColumns) {
            let grid = this.lookupReference('grid'),
                gridView = grid.getView();

            grid.reconfigure(store, this.getColumnsCfg(store, incomeColumns));
            grid.reconfigure();
            this.getViewModel().set('disableButtons', !store.count());

            // autosize columns Employee, Title, Rate
            gridView.autoSizeColumn(1);
            gridView.autoSizeColumn(2);
            gridView.autoSizeColumn(3);

            grid.getSelectionModel().deselectAll();
        },

        getColumnsCfg : function(store, incomeColumns) {
            let incomeColumnsLocal = Ext.clone(incomeColumns) || [],
                basicColumns = [
                    {
                        text : i18n.gettext('Employee'),
                        dataIndex : 'personName',
                        editor : false,
                        sorter : {
                            property : 'personName',
                            transform : Ext.util.Format.lowercase
                        },
                        summaryType : 'count',
                        summaryRenderer : function(value) {
                            return Ext.String.format(i18n.ngettext('{0} employee', '{0} employees', value), value);
                        },
                        filter : 'string'
                    },
                    {
                        text : i18n.gettext('Employee Number'),
                        dataIndex : 'employeeNumber',
                        editor : false,
                        sorter : {
                            property : 'employeeNumber',
                            transform : value => parseInt(value, 10) || Number.MAX_VALUE
                        },
                        summaryType : Ext.emptyFn,
                        filter : 'string'
                    },
                    {
                        text : i18n.gettext('Title'),
                        dataIndex : 'assignment',
                        sorter : {
                            property : 'assignment',
                            transform : Ext.util.Format.lowercase
                        },
                        editor : false,
                        summaryType : Ext.emptyFn
                    },
                    {
                        text : i18n.gettext('Rate'),
                        dataIndex : 'rate',
                        xtype : 'numbercolumn',
                        renderer : function(value, metaData, record) {
                            let rateFrequencyRecord = criterion.CodeDataManager.getCodeDetailRecord('id', record.get('rateFrequency'), criterion.consts.Dict.RATE_UNIT);

                            return criterion.LocalizationManager.currencyFormatter(value) + ' (' + (rateFrequencyRecord && rateFrequencyRecord.get('description')) + ')'
                        },
                        summaryType : Ext.emptyFn
                    },
                    {
                        text : i18n.gettext('Gross Pay'),
                        dataIndex : 'grossIncomeTotal',
                        xtype : 'criterion_currencycolumn',
                        flex : 1,
                        summaryType : 'sum',
                        summaryRenderer : criterion.LocalizationManager.currencyFormatter
                    },
                    {
                        text : i18n.gettext('Taxes'),
                        dataIndex : 'employeeTaxTotal',
                        xtype : 'criterion_currencycolumn',
                        flex : 1,
                        summaryType : 'sum',
                        summaryRenderer : criterion.LocalizationManager.currencyFormatter,
                        renderer : function(value, metaData, record) {
                            if (record.get('isCalculated')) {
                                return Ext.util.Format.currency(value)
                            }

                            return '...'
                        }
                    },
                    {
                        text : i18n.gettext('Deductions'),
                        dataIndex : 'employeeDeductionTotal',
                        xtype : 'criterion_currencycolumn',
                        flex : 1,
                        summaryType : 'sum',
                        summaryRenderer : criterion.LocalizationManager.currencyFormatter
                    },
                    {
                        text : i18n.gettext('Net'),
                        dataIndex : 'net',
                        xtype : 'criterion_currencycolumn',
                        flex : 1,
                        summaryType : 'sum',
                        summaryRenderer : criterion.LocalizationManager.currencyFormatter
                    },
                    {
                        xtype : 'criterion_actioncolumn',
                        width : criterion.Consts.UI_DEFAULTS.ACTION_COL_ITEM_WIDTH,
                        align : 'right',
                        items : [
                            {
                                glyph : criterion.consts.Glyph['ios7-trash-outline'],
                                tooltip : i18n.gettext('Delete'),
                                action : 'removeaction',
                                getClass : function(value, metaData) {
                                    metaData.style = 'padding-right: 10px;';

                                    return '';
                                },
                                permissionAction : function(v, cellValues, record, i, k, e, view) {
                                    return !view.up('criterion_payroll_batch_payrollentry').getViewModel().get('readOnlyMode');
                                }
                            }
                        ]
                    }
                ],
                nonCashSum = 0;

            store.each(function(rec) {
                nonCashSum += rec.get('nonCashTotal');
            });
            if (nonCashSum > 0) {
                basicColumns.splice(3, 0, {
                    text : i18n.gettext('Non Cash'),
                    dataIndex : 'nonCashTotal',
                    xtype : 'criterion_currencycolumn',
                    editor : false,
                    summaryType : 'sum',
                    summaryRenderer : criterion.LocalizationManager.currencyFormatter
                });
            }

            Array.prototype.splice.apply(basicColumns, [3, 0].concat(incomeColumnsLocal));

            return basicColumns;
        }
    }
});

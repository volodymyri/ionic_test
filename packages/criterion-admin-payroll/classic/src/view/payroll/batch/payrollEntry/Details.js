Ext.define('criterion.view.payroll.batch.payrollEntry.Details', function() {

    function onCustomValueWidgetAttach(index) {
        return function(column, widget, record) {
            let vm = column.up('criterion_payroll_batch_payroll_entry_details').getViewModel(),
                customValueConfig = vm.getStore('customData').getById(index),
                isReadOnlyMode = vm.get('readOnlyMode'),
                count = record.innerIncomes().count();

            if (!customValueConfig) {
                return;
            }

            widget.setCustomValueConfig(customValueConfig);

            if (count !== 1) {
                widget.setViewMode();
            } else {
                widget.setDisabled(isReadOnlyMode)
            }
        }
    }

    function onCustomValueWidgetAttachToSubGrid(index) {
        return function(column, widget, record) {
            let vm = column.up('criterion_payroll_batch_payroll_entry_details').getViewModel(),
                customValueConfig = vm.getStore('customData').getById(index),
                isReadOnlyMode = vm.get('readOnlyMode');

            if (!customValueConfig) {
                return;
            }

            widget.setCustomValueConfig(customValueConfig);
            widget.setDisabled(isReadOnlyMode);
        }
    }

    return {

        alias : 'widget.criterion_payroll_batch_payroll_entry_details',

        extend : 'criterion.ux.Panel',

        requires : [
            'criterion.controller.payroll.batch.payrollEntry.Details',
            'criterion.model.payroll.Income',
            'criterion.model.payroll.SummaryIncome',
            'criterion.model.employer.payroll.PayrollTotal',
            'criterion.model.employer.payroll.Tax',
            'criterion.model.employer.payroll.Deduction',
            'criterion.store.payroll.AssignmentsAvailable',
            'criterion.store.payroll.TasksAvailable',
            'criterion.store.payroll.AvailableProjects',
            'criterion.store.employee.WorkLocations',
            'criterion.store.workLocation.Areas',
            'criterion.view.payroll.batch.payrollEntry.AddIncome',
            'criterion.view.payroll.batch.payrollEntry.details.CustomValueWidget',
            'criterion.ux.grid.plugin.RowWidgetSync',
            'criterion.ux.form.HighPrecisionField'
        ],

        scrollable : 'vertical',
        closable : true,

        cls : 'criterion-fullscreen-popup criterion-payroll-batch-payroll-entry-details',

        plugins : [
            {
                ptype : 'criterion_sidebar',
                width : '100%'
            }
        ],

        config : {
            employees : []
        },

        controller : {
            type : 'criterion_payroll_batch_payroll_entry_details'
        },

        listeners : {
            scope : 'controller',
            show : 'handleShow'
        },

        viewModel : {
            data : {
                currentIndex : 0,
                employees : [],
                personName : null,
                personNumber : null,
                payDate : null,
                labelWorkLocation : null,
                labelWorkArea : null,
                labelAssignment : null,
                labelTask : null,
                labelProject : null,

                isShowWorkLocation : false,
                isShowWorkArea : false,
                isShowAssignment : false,
                isShowTasks : false,
                isShowProject : false,

                isShowWorkLocationOverride : false,
                isShowAssignmentOverride : false,
                isShowWorkAreaOverride : false,
                isShowTasksOverride : false,
                isShowProjectOverride : false,

                employeePayrollNotes : null,
                payrollNotes : null,

                payrollSetting : null
            },

            stores : {
                payrollIncomes : {
                    type : 'array',
                    model : 'criterion.model.payroll.Income'
                },
                payrollSummaryIncomes : {
                    type : 'store',
                    proxy : {
                        type : 'memory',
                        reader : {
                            type : 'json'
                        }
                    },
                    model : 'criterion.model.payroll.SummaryIncome',
                    sorters : [{
                        property : 'name',
                        direction : 'ASC'
                    }]
                },
                customData : {
                    type : 'store',
                    proxy : {
                        type : 'memory',
                        reader : {
                            type : 'json'
                        }
                    },
                    model : 'criterion.model.CustomData'
                },
                payrollTotals : {
                    type : 'array',
                    model : 'criterion.model.employer.payroll.PayrollTotal'
                },
                employerTaxes : {
                    type : 'array',
                    model : 'criterion.model.employer.payroll.Tax'
                },
                employeeTaxes : {
                    type : 'array',
                    model : 'criterion.model.employer.payroll.Tax'
                },
                deductions : {
                    type : 'array',
                    model : 'criterion.model.employer.payroll.Deduction'
                },
                employeeTaxesAndDeductions : {
                    type : 'array',
                    fields : ['name', 'amount', 'ytd']
                },
                employerTaxesAndDeductions : {
                    type : 'array',
                    fields : ['name', 'amount', 'ytd']
                },
                assignments : {
                    type : 'criterion_payroll_assignments_available'
                },
                tasks : {
                    type : 'criterion_payroll_tasks_available'
                },
                projects : {
                    type : 'criterion_payroll_available_projects'
                },
                employeeWorkLocations : {
                    type : 'criterion_employee_work_locations'
                },
                workLocationAreas : {
                    type : 'work_location_areas'
                }
            },

            formulas : {
                hasLeft : data => data('currentIndex') !== 0,
                hasRight : data => data('currentIndex') < (data('employees').length - 1),
                hideNotesBtn : data => data('readOnlyMode') && !(data('employeePayrollNotes') || data('payrollNotes')),
                notesBtnIconCls : data => data('employeePayrollNotes') || data('payrollNotes') ? 'notes-icon-details filled' : 'notes-icon-details',

                isShowWorkLocationCalc : data => data('isShowWorkLocationOverride') === null ? data('isShowWorkLocation') : data('isShowWorkLocationOverride'),
                isShowWorkAreaCalc : data => data('isShowWorkAreaOverride') === null ? data('isShowWorkArea') : data('isShowWorkAreaOverride'),
                isShowAssignmentCalc : data => data('isShowAssignmentOverride') === null ? data('isShowAssignment') : data('isShowAssignmentOverride'),
                isShowTasksCalc : data => data('isShowTasksOverride') === null ? data('isShowTasks') : data('isShowTasksOverride'),
                isShowProjectCalc : data => data('isShowProjectOverride') === null ? data('isShowProject') : data('isShowProjectOverride')
            }
        },

        header : {
            cls : 'criterion-fullscreen-header',
            items : [
                {
                    xtype : 'toolbar',
                    padding : 0,
                    margin : '0 20 0 0',
                    items : [
                        {
                            cls : 'criterion-btn-light',
                            glyph : criterion.consts.Glyph['chevron-left'],
                            text : i18n.gettext('Prev'),
                            iconAlign : 'left',
                            scale : 'small',
                            margin : '0 10 0 10',
                            hidden : true,
                            bind : {
                                hidden : '{!hasLeft}'
                            },
                            tooltip : i18n.gettext('Previous employee'),
                            listeners : {
                                click : 'handleLeftEmployeeSwitch'
                            }
                        },
                        {
                            xtype : 'tbtext',
                            flex : 1,
                            cls : 'person',
                            bind : {
                                html : '<span class="personName">{personName}</span><span class="personNumber">#{personNumber}</span>'
                            }
                        },
                        {
                            xtype : 'button',
                            cls : 'criterion-btn-light',
                            glyph : criterion.consts.Glyph['chevron-right'],
                            text : i18n.gettext('Next'),
                            iconAlign : 'right',
                            scale : 'small',
                            margin : '0 10 0 10',
                            hidden : true,
                            bind : {
                                hidden : '{!hasRight}'
                            },
                            tooltip : i18n.gettext('Next employee'),
                            listeners : {
                                click : 'handleRightEmployeeSwitch'
                            }
                        }
                    ]
                }
            ]
        },

        bind : {
            title : i18n.gettext('Employee Payroll Entry Details')
        },

        buttons : {
            padding : 10,

            items : [
                {
                    xtype : 'button',
                    text : i18n.gettext('Cancel'),
                    cls : 'criterion-btn-light',
                    reference : 'cancelBtn',
                    scale : 'small',
                    handler : 'handleCancel'
                },
                {
                    xtype : 'button',
                    text : i18n.gettext('Save'),
                    reference : 'saveBtn',
                    scale : 'small',
                    handler : 'handleSave',
                    hidden : true,
                    bind : {
                        hidden : criterion.SecurityManager.getComplexSecurityFormula({
                            append : 'readOnlyMode ||',
                            rules : [
                                {
                                    key : criterion.SecurityManager.HR_KEYS.PAYROLL_BATCH_DETAILS,
                                    actName : criterion.SecurityManager.UPDATE,
                                    reverse : true
                                }
                            ]
                        })
                    }
                }
            ]
        },

        initComponent : function() {

            this.items = [
                {
                    layout : {
                        type : 'hbox',
                        align : 'end'
                    },

                    border : true,
                    bodyStyle : {
                        'border-width' : '0 0 1px 0 !important'
                    },

                    defaults : {
                        margin : '10 0 20 20'
                    },

                    items : [
                        {
                            xtype : 'textfield',
                            fieldLabel : i18n.gettext('Rate'),
                            labelAlign : 'top',
                            bind : {
                                value : '{payRate}'
                            },
                            disabled : true
                        },
                        {
                            xtype : 'datefield',
                            fieldLabel : i18n.gettext('Pay Date'),
                            labelAlign : 'top',
                            bind : {
                                value : '{payDate}'
                            },
                            disabled : true
                        },
                        {
                            xtype : 'button',
                            text : i18n.gettext('Calculate'),
                            cls : 'criterion-btn-feature',
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
                            text : i18n.gettext('Gross Up'),
                            cls : 'criterion-btn-feature',
                            hidden : true,
                            bind : {
                                hidden : criterion.SecurityManager.getComplexSecurityFormula({
                                    append : 'readOnlyMode ||',
                                    rules : [
                                        {
                                            key : criterion.SecurityManager.HR_KEYS.PAYROLL_BATCH_DETAILS,
                                            actName : criterion.SecurityManager.UPDATE,
                                            reverse : true
                                        }
                                    ]
                                })
                            },
                            listeners : {
                                click : 'handleGrossUp'
                            }
                        },

                        {
                            xtype : 'button',
                            cls : 'criterion-btn-feature',
                            glyph : criterion.consts.Glyph['chatbox'],
                            tooltip : i18n.gettext('Notes'),
                            handler : 'onShowNotes',
                            hidden : true,
                            bind : {
                                hidden : '{hideNotesBtn}',
                                iconCls : '{notesBtnIconCls}'
                            }
                        }
                    ]
                },

                {
                    xtype : 'container',
                    reference : 'incomeListContainer',
                    padding : 20,
                    layout : {
                        type : 'vbox',
                        align : 'stretch'
                    },
                    items : []
                },

                {
                    xtype : 'container',
                    padding : 20,
                    layout : {
                        type : 'hbox',
                        align : 'stretch'
                    },
                    items : [
                        {
                            xtype : 'criterion_gridpanel',
                            title : i18n.gettext('Employee Paid Taxes and Deductions'),
                            reference : 'employeeTaxesAndDeductionsGrid',
                            flex : 1,
                            margin : '10 10 10 0',
                            height : 'auto',
                            border : true,
                            trackMouseOver : false,
                            selModel : null,
                            selType : null,

                            viewConfig : {
                                getRowClass : function(record, rowIndex, rowParams, store) {
                                    return record.get('isOverride') ? 'row-override' : '';
                                }
                            },

                            bind : {
                                store : '{employeeTaxesAndDeductions}'
                            },

                            columns : [
                                {
                                    xtype : 'gridcolumn',
                                    text : i18n.gettext('Title'),
                                    dataIndex : 'name',
                                    flex : 1
                                },
                                {
                                    xtype : 'widgetcolumn',
                                    text : i18n.gettext('Amount'),
                                    dataIndex : 'amount',
                                    align : 'right',
                                    width : 150,
                                    onWidgetAttach : function(column, widget, rec) {
                                        let isTax = rec.get('taxId'),
                                            isReadOnlyMode = column.up('criterion_payroll_batch_payroll_entry_details').getViewModel().get('readOnlyMode');

                                        widget.setDisabled(isReadOnlyMode || (isTax && !rec.get('canEdit')));
                                    },
                                    widget : {
                                        xtype : 'criterion_currencyfield',
                                        listeners : {
                                            scope : 'controller',
                                            blur : 'updateRecordFromWidget'
                                        }
                                    }
                                },
                                {
                                    xtype : 'criterion_currencycolumn',
                                    text : i18n.gettext('YTD'),
                                    dataIndex : 'ytd',
                                    width : 150
                                }
                            ]
                        },
                        {
                            xtype : 'criterion_gridpanel',
                            title : i18n.gettext('Company Paid Taxes and Deductions'),
                            reference : 'employerTaxesAndDeductionsGrid',
                            flex : 1,
                            margin : 10,
                            height : 'auto',
                            border : true,
                            trackMouseOver : false,
                            selModel : null,
                            selType : null,

                            viewConfig : {
                                getRowClass : function(record, rowIndex, rowParams, store) {
                                    return record.get('isOverride') ? 'row-override' : '';
                                }
                            },

                            bind : {
                                store : '{employerTaxesAndDeductions}'
                            },

                            columns : [
                                {
                                    xtype : 'gridcolumn',
                                    text : i18n.gettext('Title'),
                                    dataIndex : 'name',
                                    flex : 1
                                },
                                {
                                    xtype : 'widgetcolumn',
                                    text : i18n.gettext('Amount'),
                                    dataIndex : 'amount',
                                    align : 'right',
                                    width : 150,
                                    onWidgetAttach : function(column, widget, rec) {
                                        let isTax = rec.get('taxId'),
                                            isReadOnlyMode = column.up('criterion_payroll_batch_payroll_entry_details').getViewModel().get('readOnlyMode');

                                        widget.setDisabled(isReadOnlyMode || (isTax && !rec.get('canEdit')));
                                    },
                                    widget : {
                                        xtype : 'criterion_currencyfield',
                                        listeners : {
                                            scope : 'controller',
                                            blur : 'updateRecordFromWidget'
                                        }
                                    }
                                },
                                {
                                    xtype : 'criterion_currencycolumn',
                                    text : i18n.gettext('YTD'),
                                    dataIndex : 'ytd',
                                    width : 150
                                }
                            ]
                        },
                        {
                            xtype : 'criterion_gridpanel',
                            title : i18n.gettext('Payroll Totals'),
                            reference : 'payrollTotalsGrid',
                            flex : 1,
                            margin : '10 20 10 10',
                            height : 'auto',
                            border : true,
                            trackMouseOver : false,
                            selType : null,

                            bind : {
                                store : '{payrollTotals}'
                            },

                            columns : [
                                {
                                    xtype : 'gridcolumn',
                                    text : i18n.gettext('Title'),
                                    dataIndex : 'name',
                                    flex : 1
                                },
                                {
                                    xtype : 'criterion_currencycolumn',
                                    text : i18n.gettext('Amount'),
                                    dataIndex : 'amount',
                                    align : 'right',
                                    width : 150
                                },
                                {
                                    xtype : 'criterion_currencycolumn',
                                    text : i18n.gettext('YTD'),
                                    dataIndex : 'ytd',
                                    width : 150
                                }
                            ]
                        }
                    ]
                }
            ];

            this.callParent(arguments);
        },

        clearIncomeListItems : function() {
            this.down('[reference=incomeListContainer]').removeAll();
        },

        getCustomFieldColumnConfig : function(index, forSubGrid) {
            let vm = this.getViewModel(),
                label = vm.get('customData_' + index + '_label'),
                enabled = !vm.get('customData_' + index + '_isHidden');

            return enabled ? {
                xtype : 'widgetcolumn',
                dataIndex : 'customValue' + index,
                sortable : false,
                menuDisabled : true,
                hideable : false,
                editable : false,
                ignore : true,
                width : 150,
                text : label,
                widget : {
                    xtype : 'criterion_payroll_batch_payroll_entry_details_custom_value_widget',
                    listeners : {
                        scope : 'controller',
                        blur : (!forSubGrid ? 'updateRecordFromCustomValueWidget' : 'updateRecordSubGridFromCustomValueWidget')
                    }
                },
                onWidgetAttach : (!forSubGrid ? onCustomValueWidgetAttach(index) : onCustomValueWidgetAttachToSubGrid(index))
            } : null;
        },

        addIncomeListItems : function() {
            let container = this.down('[reference=incomeListContainer]'),
                vm = container.lookupViewModel();

            container.removeAll();
            container.add({
                xtype : 'container',
                layout : 'hbox',
                flex : 1,
                items : [
                    {
                        xtype : 'component',
                        html : i18n.gettext('Income List'),
                        cls : 'panelTitle'
                    },
                    {
                        flex : 1
                    },
                    {
                        xtype : 'button',
                        cls : 'criterion-btn-like-link',
                        text : i18n.gettext('Add'),
                        scale : 'small',
                        width : 140,
                        bind : {
                            hidden : criterion.SecurityManager.getComplexSecurityFormula({
                                append : 'readOnlyMode ||',
                                rules : [
                                    {
                                        key : criterion.SecurityManager.HR_KEYS.PAYROLL_BATCH_DETAILS,
                                        actName : criterion.SecurityManager.UPDATE,
                                        reverse : true
                                    }
                                ]
                            })
                        },
                        listeners : {
                            click : 'handleAddIncome'
                        }
                    }
                ]
            });

            container.add({
                xtype : 'criterion_gridpanel',
                reference : 'payrollIncomesGrid',
                selType : null,
                border : true,
                flex : 1,
                margin : '0 20 0 0',
                bind : {
                    store : '{payrollSummaryIncomes}'
                },
                viewConfig : {
                    markDirty : false,
                    getRowClass : function(record, rowIndex, rowParams, store) {
                        return record.get('isFixedRate') && record.get('adjustedRate') === null ? 'row-rate-override' : '';
                    }
                },
                listeners : {
                    scope : 'controller',
                    removeaction : 'removeSummaryPayrollIncome',
                    columnhide : 'onPayrollIncomeColumnHide',
                    columnshow : 'onPayrollIncomeColumnShow'
                },

                columns : Ext.Array.clean([
                    {
                        xtype : 'gridcolumn',
                        text : i18n.gettext('Income'),
                        dataIndex : 'name',
                        hideable : false,
                        menuDisabled : true,
                        flex : 1
                    },
                    {
                        xtype : 'gridcolumn',
                        text : vm.get('labelAssignment'),
                        bind : {
                            hidden : '{!isShowAssignmentCalc}'
                        },
                        dataIndex : 'title',
                        flex : 1
                    },
                    {
                        xtype : 'gridcolumn',
                        text : vm.get('labelWorkLocation'),
                        bind : {
                            hidden : '{!isShowWorkLocationCalc}'
                        },
                        dataIndex : 'employerWorkLocation',
                        flex : 1
                    },
                    {
                        xtype : 'gridcolumn',
                        text : vm.get('labelWorkArea'),
                        bind : {
                            hidden : '{!isShowWorkAreaCalc}'
                        },
                        dataIndex : 'workLocationArea',
                        flex : 1
                    },
                    {
                        xtype : 'gridcolumn',
                        dataIndex : 'projectName',
                        width : criterion.Consts.UI_DEFAULTS.COL_ITEM_WIDTH,
                        text : vm.get('labelProject'),
                        bind : {
                            hidden : '{!isShowProjectCalc}'
                        }
                    },
                    {
                        xtype : 'gridcolumn',
                        dataIndex : 'employeeTask',
                        width : criterion.Consts.UI_DEFAULTS.COL_ITEM_WIDTH,
                        text : vm.get('labelTask'),
                        bind : {
                            hidden : '{!isShowTasksCalc}'
                        }
                    },

                    this.getCustomFieldColumnConfig(1),
                    this.getCustomFieldColumnConfig(2),
                    this.getCustomFieldColumnConfig(3),
                    this.getCustomFieldColumnConfig(4),

                    {
                        xtype : 'criterion_widget_multi_type_column',
                        text : i18n.gettext('Rate'),
                        dataIndex : 'rate',
                        align : 'right',
                        width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH,
                        hideable : false,
                        widget : {
                            xtype : 'component',
                            multiXtype : function(record) {
                                return record.get('method') !== criterion.Consts.INCOME_CALC_METHOD.FORMULA ? 'criterion_currencyfield' : 'criterion_percentagefield';
                            },
                            isRatePrecision : true,
                            decimalPrecision : 6,
                            listeners : {
                                scope : 'controller',
                                blur : 'updateRecordFromWidget'
                            }
                        },
                        tdCls : 'rate-cell',
                        onWidgetAttach : function(column, widget, record) {
                            let isReadOnlyMode = column.up('criterion_payroll_batch_payroll_entry_details').getViewModel().get('readOnlyMode');

                            widget.setDisabled(
                                isReadOnlyMode ||
                                record.innerIncomes().count() !== 1 ||
                                !record.get('canEditRate')
                            )
                        }
                    },
                    {
                        xtype : 'criterion_widget_multi_type_column',
                        text : i18n.gettext('Hours / Units / FTE'),
                        dataIndex : 'hours',
                        align : 'right',
                        width : 180,
                        hideable : false,
                        widget : {
                            xtype : 'criterion_form_high_precision_field',
                            namePrecision : 'hoursPrecision',
                            listeners : {
                                scope : 'controller',
                                blur : 'updateRecordFromWidget'
                            }
                        },
                        onWidgetAttach : function(column, widget, record) {
                            let isReadOnlyMode = column.up('criterion_payroll_batch_payroll_entry_details').getViewModel().get('readOnlyMode');

                            widget.setDisabled(
                                isReadOnlyMode ||
                                record.innerIncomes().count() !== 1 ||
                                [
                                    criterion.Consts.INCOME_CALC_METHOD.HOURLY,
                                    criterion.Consts.INCOME_CALC_METHOD.UNIT,
                                    criterion.Consts.INCOME_CALC_METHOD.FTE
                                ].indexOf(record.get('method')) === -1
                            )
                        }
                    },
                    {
                        xtype : 'widgetcolumn',
                        text : i18n.gettext('Amount'),
                        dataIndex : 'amount',
                        align : 'right',
                        width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH,
                        hideable : false,
                        widget : {
                            xtype : 'criterion_currencyfield',
                            listeners : {
                                scope : 'controller',
                                blur : 'updateRecordFromWidget'
                            }
                        },
                        onWidgetAttach : function(column, widget, record) {
                            let isReadOnlyMode = column.up('criterion_payroll_batch_payroll_entry_details').getViewModel().get('readOnlyMode');

                            widget.setDisabled(
                                isReadOnlyMode ||
                                record.innerIncomes().count() !== 1 ||
                                record.get('method') !== criterion.Consts.INCOME_CALC_METHOD.AMOUNT
                            )
                        }
                    },
                    {
                        xtype : 'widgetcolumn',
                        dataIndex : 'workWeek',
                        align : 'right',
                        width : 0,
                        text : i18n.gettext('Work Week'),
                        bind : {
                            width : '{payrollSetting.isSplitByWeek ? "' + criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH + '" : 0}'
                        },
                        widget : {
                            xtype : 'numberfield',
                            listeners : {
                                scope : 'controller',
                                blur : 'updateRecordFromWidget'
                            }
                        },
                        onWidgetAttach : function(column, widget, record) {
                            let vm = column.up('criterion_payroll_batch_payroll_entry_details').getViewModel(),
                                isReadOnlyMode = vm.get('readOnlyMode');

                            widget.setDisabled(
                                isReadOnlyMode ||
                                record.innerIncomes().count() !== 1 ||
                                !vm.get('payrollSetting.isSplitByWeek')
                            )
                        }
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
                                    return !view.up('criterion_payroll_batch_payroll_entry_details').getViewModel().get('readOnlyMode') &&
                                        criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.PAYROLL_BATCH_DETAILS, criterion.SecurityManager.UPDATE)();
                                }
                            }
                        ]
                    }
                ]),

                plugins : [
                    {
                        ptype : 'criterion_row_widget_sync',
                        allowExpander : function(record) {
                            return record.innerIncomes().count() !== 1;
                        },
                        widget : {
                            xtype : 'grid',
                            autoLoad : true,
                            scrollable : false,
                            bind : {
                                store : '{record.innerIncomes}'
                            },
                            listeners : {
                                scope : 'controller',
                                removeaction : 'removePayrollIncome'
                            },
                            viewConfig : {
                                markDirty : false,
                                getRowClass : function(record, rowIndex, rowParams, store) {
                                    return record.get('isFixedRate') && record.get('adjustedRate') === null ? 'row-rate-override' : '';
                                }
                            },
                            border : false,
                            cls : 'sub-grid',
                            hideHeaders : true,
                            columns : Ext.Array.clean([
                                {
                                    xtype : 'gridcolumn',
                                    dataIndex : '__internalWidthSync__',
                                    sortable : false,
                                    menuDisabled : true,
                                    resizable : false,
                                    width : criterion.Consts.UI_DEFAULTS.COL_ITEM_WIDTH
                                },
                                {
                                    xtype : 'gridcolumn',
                                    text : i18n.gettext('Location'),
                                    dataIndex : 'employerWorkLocation',
                                    sortable : false,
                                    resizable : false,
                                    menuDisabled : true
                                },
                                {
                                    xtype : 'gridcolumn',
                                    text : i18n.gettext('Area'),
                                    dataIndex : 'workLocationArea',
                                    sortable : false,
                                    resizable : false,
                                    menuDisabled : true
                                },
                                {
                                    xtype : 'gridcolumn',
                                    dataIndex : 'projectName',
                                    text : i18n.gettext('Project'),
                                    sortable : false,
                                    resizable : false,
                                    menuDisabled : true
                                },
                                {
                                    xtype : 'gridcolumn',
                                    text : i18n.gettext('Task'),
                                    dataIndex : 'employeeTask',
                                    sortable : false,
                                    menuDisabled : true,
                                    resizable : false
                                },

                                this.getCustomFieldColumnConfig(1, true),
                                this.getCustomFieldColumnConfig(2, true),
                                this.getCustomFieldColumnConfig(3, true),
                                this.getCustomFieldColumnConfig(4, true),

                                {
                                    xtype : 'criterion_widget_multi_type_column',
                                    text : i18n.gettext('Rate'),
                                    dataIndex : 'rate',
                                    align : 'right',
                                    sortable : false,
                                    resizable : false,
                                    menuDisabled : true,
                                    tdCls : 'rate-cell',
                                    widget : {
                                        xtype : 'component',
                                        multiXtype : function(record) {
                                            return record.get('method') !== criterion.Consts.INCOME_CALC_METHOD.FORMULA ? 'criterion_currencyfield' : 'criterion_percentagefield';
                                        },
                                        isRatePrecision : true,
                                        decimalPrecision : 6,
                                        listeners : {
                                            scope : 'controller',
                                            blur : 'updateRecordSubGridFromWidget'
                                        }
                                    },
                                    onWidgetAttach : function(column, widget, record) {
                                        let isReadOnlyMode = column.up('criterion_payroll_batch_payroll_entry_details').getViewModel().get('readOnlyMode');

                                        widget.setDisabled(
                                            isReadOnlyMode ||
                                            !record.get('canEditRate')
                                        )
                                    }
                                },
                                {
                                    xtype : 'widgetcolumn',
                                    text : i18n.gettext('Hours / Units / FTE'),
                                    dataIndex : 'hours',
                                    align : 'right',
                                    sortable : false,
                                    resizable : false,
                                    menuDisabled : true,
                                    widget : {
                                        xtype : 'criterion_form_high_precision_field',
                                        namePrecision : 'hoursPrecision',
                                        listeners : {
                                            scope : 'controller',
                                            blur : 'updateRecordSubGridFromWidget'
                                        }
                                    },
                                    onWidgetAttach : function(column, widget, record) {
                                        let isReadOnlyMode = column.up('criterion_payroll_batch_payroll_entry_details').getViewModel().get('readOnlyMode');

                                        widget.setDisabled(
                                            isReadOnlyMode ||
                                            [
                                                criterion.Consts.INCOME_CALC_METHOD.HOURLY,
                                                criterion.Consts.INCOME_CALC_METHOD.UNIT,
                                                criterion.Consts.INCOME_CALC_METHOD.FTE
                                            ].indexOf(record.get('method')) === -1
                                        )
                                    }
                                },
                                {
                                    xtype : 'widgetcolumn',
                                    text : i18n.gettext('Amount'),
                                    dataIndex : 'amount',
                                    align : 'right',
                                    sortable : false,
                                    menuDisabled : true,
                                    widget : {
                                        xtype : 'criterion_currencyfield',
                                        listeners : {
                                            scope : 'controller',
                                            blur : 'updateRecordSubGridFromWidget'
                                        }
                                    },
                                    onWidgetAttach : function(column, widget, record) {
                                        let isReadOnlyMode = column.up('criterion_payroll_batch_payroll_entry_details').getViewModel().get('readOnlyMode');

                                        widget.setDisabled(
                                            isReadOnlyMode ||
                                            record.get('method') !== criterion.Consts.INCOME_CALC_METHOD.AMOUNT
                                        )
                                    }
                                },
                                {
                                    xtype : 'widgetcolumn',
                                    dataIndex : 'workWeek',
                                    align : 'right',
                                    width : 0,
                                    text : i18n.gettext('Work Week'),
                                    sortable : false,
                                    bind : {
                                        width : '{payrollSetting.isSplitByWeek ? "' + criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH + '" : 0}'
                                    },
                                    widget : {
                                        xtype : 'numberfield',
                                        listeners : {
                                            scope : 'controller',
                                            blur : 'updateRecordSubGridFromWidget'
                                        }
                                    },
                                    onWidgetAttach : function(column, widget, record) {
                                        let vm = column.up('criterion_payroll_batch_payroll_entry_details').getViewModel(),
                                            isReadOnlyMode = vm.get('readOnlyMode');

                                        widget.setDisabled(
                                            isReadOnlyMode ||
                                            !vm.get('payrollSetting.isSplitByWeek')
                                        )
                                    }
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
                                                return !view.up('criterion_payroll_batch_payroll_entry_details').getViewModel().get('readOnlyMode');
                                            }
                                        }
                                    ]
                                }
                            ])
                        }
                    }
                ]
            });
        }
    }
});

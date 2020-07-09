Ext.define('criterion.view.payroll.Batches', function() {

    return {
        alias : 'widget.criterion_payroll_batches',

        extend : 'criterion.ux.form.Panel',

        requires : [
            'criterion.controller.payroll.Batches',
            'criterion.store.employer.payroll.Batches',
            'criterion.ux.form.field.EmployerCombo',
            'criterion.ux.grid.PanelExtended',
            'criterion.store.employer.payroll.payrollSchedule.PayrollPeriods',

            'Ext.grid.filters.Filters',
            'criterion.ux.grid.filters.filter.CodeData'
        ],

        viewModel : {
            data : {
                isStatusComplete : false
            },
            stores : {
                currentBatches : {
                    type : 'criterion_employer_payroll_batches',
                    pageSize : criterion.Consts.PAGE_SIZE.DEFAULT,
                    remoteFilter : true,
                    remoteSort : true,
                    sorters : [
                        {
                            property : 'payDate',
                            direction : 'DESC'
                        }
                    ]
                },
                payPeriods : {
                    type : 'criterion_employer_payroll_payroll_schedule_payroll_periods'
                }
            }
        },

        controller : {
            type : 'criterion_payroll_batches'
        },

        listeners : {
            scope : 'controller',
            activate : 'handleActivate'
        },

        title : i18n.gettext('Payroll Maintenance'),

        layout : 'border',
        bodyPadding : 0,

        plugins : {
            ptype : 'criterion_lazyitems'
        },

        initComponent : function() {
            var me = this;

            this.callParent(arguments);

            me.getPlugin('criterionLazyItems').
                items = [
                {
                    xtype : 'panel',

                    listeners : {
                        search : 'onSearch'
                    },
                    layout : {
                        type : 'vbox',
                        align : 'stretch'
                    },

                    region : 'west',
                    cls : 'criterion-side-panel',
                    width : 300,

                    items : [
                        {
                            layout : 'hbox',
                            cls : 'criterion-side-field',
                            padding : '26 20',

                            items : [
                                {
                                    xtype : 'button',
                                    text : i18n.gettext('Add Batch'),
                                    width: '100%',
                                    textAlign : 'left',
                                    listeners : {
                                        click : 'onBatchAdd'
                                    },
                                    hidden : true,
                                    bind : {
                                        hidden : criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.PAYROLL_BATCH, criterion.SecurityManager.CREATE, true)
                                    },
                                    cls: 'criterion-btn-side-add'
                                }
                            ]
                        },
                        {
                            xtype : 'form',
                            reference : 'searchForm',

                            defaults : {
                                labelWidth : 150,
                                labelAlign : 'top',
                                width : '100%',
                                cls : 'criterion-side-field'
                            },

                            items : [
                                {
                                    xtype : 'criterion_employer_combo',
                                    fieldLabel : i18n.gettext('Employer'),
                                    name : 'employerId',
                                    allowBlank : true,
                                    listeners : {
                                        change : 'handleSearchComboChange'
                                    },
                                    listConfig : {
                                        cls : 'criterion-side-list',
                                        shadow : false
                                    }
                                },
                                {
                                    xtype : 'textfield',
                                    fieldLabel : i18n.gettext('Batch name'),
                                    name : 'name',
                                    enableKeyEvents : true,
                                    listeners : {
                                        keypress : 'onKeyPress'
                                    }
                                },
                                {
                                    xtype : 'datefield',
                                    fieldLabel : i18n.gettext('Pay Date'),
                                    name : 'payDate',
                                    submitFormat : criterion.consts.Api.DATE_FORMAT,
                                    enableKeyEvents : true,
                                    listeners : {
                                        keypress : 'onKeyPress'
                                    }
                                },
                                {
                                    xtype : 'numberfield',
                                    fieldLabel : i18n.gettext('Period Number'),
                                    name : 'periodNumber',
                                    enableKeyEvents : true,
                                    listeners : {
                                        keypress : 'onKeyPress'
                                    }
                                },
                                {
                                    xtype : 'combobox',
                                    fieldLabel : i18n.gettext('Status'),
                                    store : Ext.create('Ext.data.Store', {
                                        fields : ['text', 'value'],
                                        data : [
                                            {
                                                text : i18n.gettext('All'),
                                                value : null
                                            },
                                            {
                                                text : i18n.gettext('Completed'),
                                                value : 'true'
                                            },
                                            {
                                                text : i18n.gettext('Pending'),
                                                value : 'false'
                                            }
                                        ]
                                    }),
                                    name : 'showComplete',
                                    valueField : 'value',
                                    emptyText : i18n.gettext('Active'),
                                    value : 'false',
                                    editable : false,
                                    sortByDisplayField : false,
                                    listeners : {
                                        change : 'handleSearchComboChange'
                                    },
                                    listConfig : {
                                        cls : 'criterion-side-list',
                                        shadow : false
                                    }
                                }
                            ]
                        },
                        {
                            layout : 'hbox',
                            padding : 20,
                            items : [
                                {
                                    flex : 1
                                },
                                {
                                    xtype : 'button',
                                    text : i18n.gettext('Search'),
                                    cls : 'criterion-btn-primary',
                                    listeners : {
                                        click : 'onSearch'
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype : 'panel',
                    layout : 'fit',
                    region : 'center',
                    bodyPadding : 0,

                    items : [
                        {
                            xtype : 'criterion_gridpanel_extended',
                            reference : 'payrollGrid',

                            scrollable : true,

                            rowEditing : false,
                            useDefaultActionColumn : true,
                            useDefaultTbar : false,

                            bind : {
                                store : '{currentBatches}'
                            },

                            plugins : ['gridfilters'],

                            listeners : {
                                editaction : 'onBatchEdit',
                                removeaction : 'onBatchRemove'
                            },

                            dockedItems : {
                                xtype : 'criterion_toolbar_paging',
                                dock : 'bottom',
                                displayInfo : true,
                                bind : {
                                    store : '{currentBatches}'
                                }
                            },

                            columns : [
                                {
                                    xtype : 'gridcolumn',
                                    text : i18n.gettext('Batch name'),
                                    dataIndex : 'name',
                                    flex : 1,
                                    filter : true
                                },
                                {
                                    xtype : 'datecolumn',
                                    text : i18n.gettext('Pay Date'),
                                    dataIndex : 'payDate',
                                    flex : 1
                                },
                                {
                                    xtype : 'gridcolumn',
                                    text : i18n.gettext('Period Number'),
                                    dataIndex : 'payrollPeriodId',
                                    flex : 1,
                                    renderer: function(value, meta) {
                                        var store = me.getViewModel().getStore('payPeriods'),
                                            payPeriodRecord;

                                        if (store) {
                                            payPeriodRecord = store.getById(value);
                                        }

                                        return store && payPeriodRecord ? payPeriodRecord.get('number') : ''
                                    }
                                },
                                {
                                    xtype : 'criterion_codedatacolumn',
                                    text : i18n.gettext('Batch Status'),
                                    flex : 1,
                                    dataIndex : 'batchStatusCd',
                                    codeDataId : criterion.consts.Dict.BATCH_STATUS,
                                    filter : {
                                        type : 'codedata'
                                    }
                                }
                            ]
                        }
                    ]
                }
            ];
        }
    };
});

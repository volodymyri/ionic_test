Ext.define('criterion.view.payroll.PayProcessing', function() {

    var BATCH_AGGREGATED_STATUSES = criterion.Consts.BATCH_AGGREGATED_STATUSES;

    return {

        alias : 'widget.criterion_payroll_pay_processing',

        extend : 'criterion.ux.tab.Panel',

        cls : 'criterion-tabpanel',

        requires : [
            'criterion.controller.payroll.PayProcessing',
            'criterion.store.employer.payroll.Batches',
            'criterion.store.employer.payroll.Years',
            'criterion.ux.form.field.EmployerCombo',
            'criterion.view.payroll.batch.ProcessPay',
            'criterion.view.payroll.FilingGrid',
            'criterion.ux.grid.PanelExtended',
            'criterion.view.payroll.payProcessing.GLExport',
            'criterion.view.payroll.payProcessing.TWNExport'
        ],

        viewModel : {
            data : {
                isSingleEmployer : true,
                currentYear : (new Date()).getFullYear()
            },
            stores : {
                currentBatches : {
                    type : 'criterion_employer_payroll_batches',
                    pageSize : criterion.Consts.PAGE_SIZE.DEFAULT,
                    remoteSort : true
                },
                years : {
                    type : 'criterion_employer_payroll_years'
                }
            }
        },

        controller : {
            type : 'criterion_payroll_pay_processing'
        },

        listeners : {
            scope : 'controller',
            tabChange : 'onTabChange',
            activate : 'handleActivate'
        },

        title : i18n.gettext('Pay Processing'),

        minTabWidth : 300,

        bodyPadding : 0,

        plugins : [
            {
                ptype : 'criterion_security_items',
                secureByDefault : true
            }
        ],

        items : [
            {
                xtype : 'panel',
                title : i18n.gettext('Pay Batch'),

                itemId : 'payBatch',

                layout : {
                    type : 'vbox',
                    align : 'stretch'
                },
                bodyPadding : 0,

                items : [
                    {
                        xtype : 'container',
                        reference : 'cardContainer',
                        layout : {
                            type : 'card'
                        },
                        flex : 1,

                        items : [
                            {
                                xtype : 'criterion_gridpanel_extended',
                                reference : 'grid',
                                itemId : 'grid',

                                rowEditing : false,
                                useDefaultActionColumn : false,
                                useDefaultTbar : false,

                                bind : {
                                    store : '{currentBatches}'
                                },

                                listeners : {
                                    editaction : 'onPayProcess'
                                },

                                dockedItems : [
                                    {
                                        xtype : 'container',
                                        dock : 'top',
                                        layout : 'hbox',
                                        padding : 25,
                                        items : [
                                            {
                                                xtype : 'criterion_employer_combo',
                                                fieldLabel : i18n.gettext('Employer'),
                                                reference : 'employerCombo',
                                                allowBlank : true,
                                                bind : {
                                                    hidden : '{isSingleEmployer}',
                                                    disabled : '{isSingleEmployer}'
                                                },
                                                listeners : {
                                                    change : 'handleSearch'
                                                }
                                            },
                                            {
                                                xtype : 'combobox',
                                                fieldLabel : i18n.gettext('Status'),
                                                reference : 'statusCombo',
                                                margin : '0 0 0 20',
                                                labelWidth : 60,
                                                sortByDisplayField : false,
                                                editable : false,
                                                store : Ext.create('Ext.data.Store', {
                                                    fields : ['text', 'value'],
                                                    data : [
                                                        {
                                                            text : i18n.gettext('Open'),
                                                            value : BATCH_AGGREGATED_STATUSES.OPEN
                                                        },
                                                        {
                                                            text : i18n.gettext('Completed'),
                                                            value : BATCH_AGGREGATED_STATUSES.COMPLETED
                                                        }
                                                    ]
                                                }),
                                                value : BATCH_AGGREGATED_STATUSES.OPEN,
                                                displayField : 'text',
                                                valueField : 'value',
                                                queryMode : 'local',
                                                forceSelection : true,
                                                autoSelect : true,
                                                listeners : {
                                                    change : 'handleSearch'
                                                }
                                            },
                                            {
                                                flex : 1
                                            }
                                        ]
                                    },
                                    {
                                        xtype : 'criterion_toolbar_paging',
                                        dock : 'bottom',
                                        displayInfo : true,
                                        bind : {
                                            store : '{currentBatches}'
                                        }
                                    }
                                ],

                                columns : [
                                    {
                                        xtype : 'gridcolumn',
                                        text : i18n.gettext('Employer'),
                                        dataIndex : 'employerLegalName',
                                        sortable : false,
                                        flex : 1,
                                        bind : {
                                            hidden : '{isSingleEmployer}'
                                        }
                                    },
                                    {
                                        xtype : 'gridcolumn',
                                        text : i18n.gettext('Batch Name'),
                                        dataIndex : 'name',
                                        flex : 1
                                    },
                                    {
                                        xtype : 'datecolumn',
                                        text : i18n.gettext('Pay Date'),
                                        dataIndex : 'payDate',
                                        flex : 1
                                    },
                                    {
                                        xtype : 'criterion_codedatacolumn',
                                        dataIndex : 'batchStatusCd',
                                        codeDataId : criterion.consts.Dict.BATCH_STATUS,
                                        text : i18n.gettext('Status'),
                                        unselectedText : '',
                                        flex : 1
                                    }
                                ]
                            },
                            {
                                xtype : 'criterion_payroll_process_pay',
                                reference : 'processPay',
                                itemId : 'processPay'
                            }
                        ]
                    }
                ]
            },
            {
                xtype : 'criterion_payroll_filing_grid',
                title : i18n.gettext('Tax Filing & Payments'),
                itemId : 'taxFiling',
                securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.PAY_PROCESSING_TAX_FILING_PAYMENTS, criterion.SecurityManager.READ)
            },
            {
                xtype : 'criterion_payroll_pay_processing_gl_export',
                title : i18n.gettext('General Ledger'),
                itemId : 'generalLedger',
                securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.PAY_PROCESSING_GENERAL_LEDGER, criterion.SecurityManager.READ)
            }
            /* CR-9479 Remove TWN Export. We can comment out the code and add it back when it is fully tested.
            {
                xtype : 'criterion_payroll_pay_processing_twn_export',
                title : i18n.gettext('TWN Export'),
                itemId : 'export'
            }*/
        ]
    };
});

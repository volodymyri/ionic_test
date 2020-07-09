Ext.define('criterion.view.payroll.FilingGrid', function() {

    var TAX_FILING_TYPES = criterion.Consts.TAX_FILING_TYPES;

    return {

        alias : 'widget.criterion_payroll_filing_grid',

        extend : 'criterion.view.GridView',

        requires : [
            'criterion.controller.payroll.FilingGrid',
            'criterion.store.payroll.batch.TransmissionFiles'
        ],

        viewModel : {
            data : {
                isSingleEmployer : true,
                currentYear : (new Date()).getFullYear()
            },
            stores : {
                transmissionFiles : {
                    type : 'criterion_payroll_transmission_files',
                    pageSize : criterion.Consts.PAGE_SIZE.DEFAULT
                }
            },
            formulas : {
                isPeriod : {
                    bind : {
                        bindTo : '{generateType}',
                        deep : true
                    },
                    get : function(generateType) {
                        return generateType.selection.get('value') === TAX_FILING_TYPES.PERIOD;
                    }
                },
                isQuarter : {
                    bind : {
                        bindTo : '{generateType}',
                        deep : true
                    },
                    get : function(generateType) {
                        return generateType.selection.get('value') === TAX_FILING_TYPES.QUARTER;
                    }
                }
            }
        },

        bind : {
            store : '{transmissionFiles}'
        },

        controller : {
            type : 'criterion_payroll_filing_grid'
        },

        tbar : null,

        listeners : {
            downloadAction : 'handleDownloadAction'
        },

        dockedItems : [
            {
                xtype : 'panel',
                dock : 'top',
                header : {
                    title : i18n.gettext('TAX FILING'),
                    items : [
                        {
                            flex : 1
                        },
                        {
                            xtype : 'button',
                            reference : 'generateButton',
                            text : i18n.gettext('Generate'),
                            cls : 'criterion-btn-primary',
                            margin : '0 20 0 0',
                            listeners : {
                                click : 'handleGenerate'
                            },
                            hidden : true,
                            bind : {
                                hidden : criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.PAY_PROCESSING_TAX_FILING_PAYMENTS_GENERATE, criterion.SecurityManager.ACT, true)
                            }
                        }
                    ]
                }
            },

            {
                xtype : 'panel',
                dock : 'top',
                layout : 'hbox',
                defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM,
                bodyPadding : 0,
                plugins : [
                    'criterion_responsive_column'
                ],
                items : [
                    {
                        xtype : 'container',
                        items : [
                            {
                                xtype : 'criterion_employer_combo',
                                fieldLabel : i18n.gettext('Employer'),
                                labelWidth : 95,
                                allowBlank : true,
                                name : 'employerId',
                                reference : 'employerCombo',
                                bind : '{employerId}',
                                listeners : {
                                    change : 'handleSearch'
                                }
                            },
                            {
                                xtype : 'combobox',
                                fieldLabel : i18n.gettext('Type'),
                                labelWidth : 95,
                                reference : 'generateType',
                                sortByDisplayField : false,
                                editable : false,
                                store : Ext.create('Ext.data.Store', {
                                    fields : ['text', 'value'],
                                    data : [
                                        {
                                            text : i18n.gettext('Period'), value : TAX_FILING_TYPES.PERIOD
                                        },
                                        {
                                            text : i18n.gettext('Quarter'), value : TAX_FILING_TYPES.QUARTER
                                        },
                                        {
                                            text : i18n.gettext('Year'), value : TAX_FILING_TYPES.ANNUAL
                                        }
                                    ]
                                }),
                                value : TAX_FILING_TYPES.PERIOD,
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
                                xtype : 'component'
                            }
                        ]
                    },
                    {
                        xtype : 'container',
                        items : [
                            {
                                xtype : 'combobox',
                                reference : 'yearCombo',
                                fieldLabel : i18n.gettext('Year'),
                                labelWidth : 95,
                                bind : {
                                    store : '{years}',
                                    value : '{currentYear}'
                                },
                                displayField : 'year',
                                queryMode : 'local',
                                forceSelection : true,
                                editable : false,
                                listeners : {
                                    change : 'handleSearch'
                                }
                            },
                            {
                                xtype : 'fieldcontainer',
                                layout : 'hbox',
                                fieldLabel : i18n.gettext('Pay Date'),
                                labelWidth : 70,
                                hidden : true,
                                bind : {
                                    hidden : '{!isPeriod}'
                                },
                                items : [
                                    {
                                        xtype : 'datefield',
                                        fieldLabel : i18n.gettext(' '),
                                        labelWidth : 25,
                                        name : 'startDate',
                                        reference : 'startDate',
                                        hidden : true,
                                        flex : 1,
                                        bind : {
                                            disabled : '{!isPeriod}',
                                            hidden : '{!isPeriod}'
                                        }
                                    },
                                    {
                                        xtype : 'datefield',
                                        fieldLabel : i18n.gettext('To'),
                                        name : 'endDate',
                                        reference : 'endDate',
                                        labelWidth : 25,
                                        margin : '0 0 0 10',
                                        flex : 1,
                                        hidden : true,
                                        bind : {
                                            disabled : '{!isPeriod}',
                                            hidden : '{!isPeriod}'
                                        }
                                    }
                                ]
                            },

                            {
                                xtype : 'container',
                                layout : 'hbox',
                                margin : '10 0 20 0',
                                items : [
                                    {
                                        xtype : 'component',
                                        flex : 1
                                    },
                                    {
                                        xtype : 'button',
                                        cls : 'criterion-btn-primary',
                                        text : i18n.gettext('Search'),
                                        handler : 'handleSearch',
                                        width : 120
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },

            {
                xtype : 'criterion_toolbar_paging',
                dock : 'bottom',
                displayInfo : true,
                bind : {
                    store : '{transmissionFiles}'
                }
            }
        ],

        initComponent : function() {
            this.columns = [
                {
                    xtype : 'gridcolumn',
                    text : i18n.gettext('Employer'),
                    dataIndex : 'employerName',
                    flex : 1,
                    hidden : true,
                    menuDisabled : true,
                    bind : {
                        hidden : '{isSingleEmployer}'
                    }
                },
                {
                    xtype : 'gridcolumn',
                    text : i18n.gettext('Batch Name'),
                    dataIndex : 'batchName',
                    flex : 2,
                    hidden : true,
                    menuDisabled : true,
                    bind : {
                        hidden : '{!isPeriod}'
                    }
                },
                {
                    xtype : 'gridcolumn',
                    text : i18n.gettext('Year'),
                    dataIndex : 'year',
                    width : 100,
                    hidden : true,
                    menuDisabled : true,
                    bind : {
                        hidden : '{isPeriod}'
                    }
                },
                {
                    xtype : 'gridcolumn',
                    text : i18n.gettext('Quarter'),
                    dataIndex : 'quarter',
                    flex : 1,
                    hidden : true,
                    menuDisabled : true,
                    bind : {
                        hidden : '{!isQuarter}'
                    }
                },
                {
                    xtype : 'datecolumn',
                    text : i18n.gettext('Pay Date'),
                    dataIndex : 'payDate',
                    width : 150,
                    hidden : true,
                    menuDisabled : true,
                    bind : {
                        hidden : '{!isPeriod}'
                    }
                },
                {
                    xtype : 'gridcolumn',
                    text : i18n.gettext('Type'),
                    dataIndex : 'fileType',
                    flex : 1,
                    menuDisabled : true
                },
                {
                    xtype : 'datecolumn',
                    text : i18n.gettext('Create Date'),
                    dataIndex : 'createDate',
                    menuDisabled : true,
                    width : 150
                },
                {
                    xtype : 'criterion_actioncolumn',
                    width : criterion.Consts.UI_DEFAULTS.ACTION_COL_ITEM_WIDTH,
                    items : [
                        {
                            glyph : criterion.consts.Glyph['ios7-download-outline'],
                            tooltip : i18n.gettext('Download'),
                            action : 'downloadAction'
                        }
                    ]
                }
            ];

            this.callParent(arguments);
        }
    }
});

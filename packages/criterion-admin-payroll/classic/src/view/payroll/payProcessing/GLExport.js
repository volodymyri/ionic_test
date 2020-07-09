Ext.define('criterion.view.payroll.payProcessing.GLExport', function() {

    const BATCH_AGGREGATED_STATUSES = criterion.Consts.BATCH_AGGREGATED_STATUSES;

    return {
        alias : 'widget.criterion_payroll_pay_processing_gl_export',

        extend : 'criterion.ux.grid.PanelExtended',

        requires : [
            'criterion.store.employer.payroll.Batches',
            'criterion.controller.payroll.payProcessing.GLExport',
            'criterion.store.employer.GLSetups',
            'criterion.store.app.GlExport'
        ],

        viewModel : {
            data : {
                gLSetupRecord : null,
                employerId : null,
                currentYear : (new Date()).getFullYear()
            },
            stores : {
                batchesForExport : {
                    type : 'criterion_employer_payroll_batches',
                    sorters : [{
                        property : 'payDate',
                        direction : 'DESC'
                    }]
                },
                gLSetup : {
                    type : 'employer_gl_setups'
                },
                glExportApps : {
                    type : 'criterion_app_gl_export'
                }
            }
        },

        controller : {
            type : 'criterion_payroll_pay_processing_gl_export'
        },

        cls : 'criterion-grid-centred',

        reference : 'glExportGrid',

        rowEditing : false,
        useDefaultActionColumn : false,
        useDefaultTbar : false,

        bind : {
            store : '{batchesForExport}'
        },

        listeners : {
            scope : 'controller',
            activate : 'handleActivate',
            previewAction : 'handlePreview',
            removeAction : 'handleRemove'
        },

        dockedItems : [
            {
                xtype : 'panel',
                dock : 'top',
                header : {
                    title : i18n.gettext('GENERAL LEDGER')
                },
                layout : {
                    type : 'hbox',
                    align : 'stretch'
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
                                listeners : {
                                    change : 'handleEmployerChange'
                                },
                                bind : '{employerId}'
                            },
                            {
                                xtype : 'textfield',
                                bind : {
                                    value : '{gLSetupRecord.name}'
                                },
                                fieldLabel : i18n.gettext('GL Interface'),
                                labelWidth : 95,
                                readOnly : true
                            },
                            {
                                xtype : 'combobox',
                                fieldLabel : i18n.gettext('Status'),
                                reference : 'statusCombo',
                                labelWidth : 95,
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
                                value : BATCH_AGGREGATED_STATUSES.COMPLETED,
                                displayField : 'text',
                                valueField : 'value',
                                queryMode : 'local',
                                forceSelection : true,
                                autoSelect : true,
                                listeners : {
                                    change : 'handleSearch'
                                }
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
                                items : [
                                    {
                                        xtype : 'datefield',
                                        fieldLabel : i18n.gettext(' '),
                                        labelWidth : 25,
                                        name : 'startDate',
                                        reference : 'startDate',
                                        flex : 1
                                    },
                                    {
                                        xtype : 'datefield',
                                        fieldLabel : i18n.gettext('To'),
                                        name : 'endDate',
                                        reference : 'endDate',
                                        labelWidth : 25,
                                        margin : '0 0 0 10',
                                        flex : 1
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
            }
        ],

        columns : [
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Employer'),
                dataIndex : 'employerName',
                flex : 1
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Batch Name'),
                dataIndex : 'name',
                flex : 2
            },
            {
                xtype : 'datecolumn',
                text : i18n.gettext('Pay Date'),
                dataIndex : 'payDate',
                flex : 1
            },
            {
                xtype : 'criterion_widgetcolumn',
                width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH,
                sortable : false,
                menuDisabled : true,
                align : 'center',
                widget : {
                    xtype : 'button',
                    cls : 'criterion-btn-transparent',
                    overCls : 'criterion-btn-primary',
                    width : 100,
                    padding : 5,
                    handler : 'handleExport',
                    listeners : {
                        mouseover : function(button) {
                            button.removeCls('criterion-btn-transparent');
                        },
                        mouseout : function(button) {
                            button.addCls('criterion-btn-transparent');
                        }
                    }
                },
                onWidgetAttach : function(column, widget, record) {
                    let vm = widget.lookupViewModel(),
                        employerId = record.get('employerId'),
                        glsStore = vm.getStore('gLSetup'),
                        glExportApps = vm.getStore('glExportApps'),
                        recIndx,
                        gLSetupRecord,
                        glExportAppRecord,
                        appId,
                        text = i18n.gettext('Download');

                    recIndx = glsStore.findExact('employerId', employerId);

                    if (recIndx !== -1) {
                        gLSetupRecord = glsStore.getAt(recIndx);
                        appId = gLSetupRecord && gLSetupRecord.get('appId');
                        glExportAppRecord = glExportApps.getById(appId ? appId : criterion.Consts.GL_INTERFACE_EXPORT_TYPE_FILE_ID);

                        if (glExportAppRecord) {
                            if (record.get('isExported')) {
                                widget.setUserCls('link-visited');
                            }

                            if (glExportAppRecord.getId() === criterion.Consts.GL_INTERFACE_EXPORT_TYPE_FILE_ID) {
                                text = i18n.gettext('Download');
                                if (!criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.PAY_PROCESSING_GENERAL_LEDGER_DOWNLOAD, criterion.SecurityManager.ACT)()) {
                                    widget.setUserCls('x-hidden');
                                }
                            } else {
                                text = i18n.gettext('Transmit');
                                if (!criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.PAY_PROCESSING_GENERAL_LEDGER_TRANSMIT, criterion.SecurityManager.ACT)()) {
                                    widget.setUserCls('x-hidden');
                                }
                            }
                            widget.glExportAppRecord = glExportAppRecord;
                        }
                    }
                    widget.setText(text);
                }
            },
            {
                xtype : 'criterion_actioncolumn',
                width : criterion.Consts.UI_DEFAULTS.ACTION_COL_ITEM_WIDTH,
                items : [
                    {
                        glyph : criterion.consts.Glyph['ios7-trash-outline'],
                        tooltip : i18n.gettext('Clear Data'),
                        text : '',
                        action : 'removeaction',
                        getClass : function(value, metaData, record) {
                            return record.get('isExported') ? '' : 'x-hidden'
                        }
                    }
                ]
            }
        ]
    };

});

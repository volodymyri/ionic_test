Ext.define('criterion.view.settings.system.workflow.Track', function() {

    const WORKFLOW_TYPE_CODE = criterion.Consts.WORKFLOW_TYPE_CODE;

    return {
        alias : 'widget.criterion_settings_workflow_track',

        extend : 'criterion.view.FormView',

        cls : 'criterion-settings-workflow-track',

        requires : [
            'criterion.controller.settings.system.workflow.Track',
            'Ext.grid.plugin.RowWidget',
            'criterion.store.workflow.Transactions'
        ],

        controller : {
            type : 'criterion_settings_workflow_track'
        },

        listeners : {
            show : 'handleActivate'
        },

        viewModel : {
            stores : {
                transactions : {
                    type : 'criterion_workflow_transactions',
                    proxy : {
                        extraParams : {
                            workflowId : '{wfRecord.id}'
                        }
                    }
                }
            },

            formulas : {
                objectColumnName : data => {
                    switch (data('wfRecord.workflowTypeCode')) {
                        case WORKFLOW_TYPE_CODE.TIMESHEET:
                            return i18n.gettext('Timesheet Info');

                        case WORKFLOW_TYPE_CODE.TIME_OFF:
                            return i18n.gettext('Time Off Info');

                        case WORKFLOW_TYPE_CODE.EMPLOYEE_REVIEW:
                            return i18n.gettext('Performance Review Info');
                    }

                    return '';
                },
                showObjectColumn : data => Ext.Array.indexOf([WORKFLOW_TYPE_CODE.TIMESHEET, WORKFLOW_TYPE_CODE.TIME_OFF, WORKFLOW_TYPE_CODE.EMPLOYEE_REVIEW], data('wfRecord.workflowTypeCode')) !== -1,
                isFormWorkflow : data => data('wfRecord.workflowTypeCode') === WORKFLOW_TYPE_CODE.FORM,
                employeeFieldLabel : data => data('isFormWorkflow') ? i18n.gettext('Employee / Form') : i18n.gettext('Employee')
            }
        },

        bodyPadding : 0,

        plugins : [
            {
                ptype : 'criterion_sidebar',
                height : 'auto',
                width : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_WIDTH
            }
        ],

        setButtonConfig : function() {
            this.buttons = [
                {
                    xtype : 'button',
                    text : i18n.gettext('Purge Completed Logs'),
                    cls : 'criterion-btn-remove',
                    listeners : {
                        click : 'handlePurgeCompletedLogs'
                    }
                },
                '->',
                {
                    xtype : 'button',
                    cls : 'criterion-btn-light',
                    text : i18n.gettext('Back'),
                    listeners : {
                        click : 'handleBack'
                    }
                }
            ];
        },

        items : [
            {
                layout : 'hbox',

                bodyPadding : '15 10',

                items : [
                    {
                        xtype : 'textfield',
                        reference : 'workflow',
                        fieldLabel : i18n.gettext('Workflow'),
                        name : 'name',
                        readOnly : true,
                        labelWidth : 70,
                        margin : '0 20 0 0',
                        bind : {
                            value : '{wfRecord.name}'
                        }
                    },
                    {
                        xtype : 'criterion_code_detail_field',
                        codeDataId : criterion.consts.Dict.WORKFLOW,
                        fieldLabel : i18n.gettext('Type'),
                        name : 'workflowTypeCd',
                        readOnly : true,
                        labelWidth : 60,
                        margin : '0 20 0 0',
                        bind : {
                            value : '{wfRecord.workflowTypeCd}'
                        }
                    },
                    {
                        xtype : 'textfield',
                        reference : 'employeeName',
                        checkChangeBuffer : 1000,
                        labelWidth : 130,
                        listeners : {
                            change : 'handleEmployeeNameChange'
                        },
                        bind : {
                            fieldLabel : '{employeeFieldLabel}'
                        }
                    },
                    {
                        xtype : 'component',
                        flex : 1
                    },
                    {
                        xtype : 'button',
                        tooltip : i18n.gettext('Download'),
                        cls : ['criterion-btn-transparent', 'ios7-download-outline'],
                        glyph : criterion.consts.Glyph['ios7-download-outline'],
                        hidden : true,
                        width : 50,
                        bind : {
                            hidden : '{!isFormWorkflow}'
                        },
                        listeners : {
                            click : 'handleDownloadReport'
                        }
                    }
                ],

                items_ : [
                    {
                        items : [
                            {
                                xtype : 'textfield',
                                reference : 'workflow',
                                fieldLabel : i18n.gettext('Workflow'),
                                name : 'name',
                                readOnly : true,
                                bind : {
                                    value : '{wfRecord.name}'
                                }
                            }
                        ]
                    },
                    {
                        items : [
                            {
                                xtype : 'criterion_code_detail_field',
                                codeDataId : criterion.consts.Dict.WORKFLOW,
                                fieldLabel : i18n.gettext('Type'),
                                name : 'workflowTypeCd',
                                readOnly : true,
                                bind : {
                                    value : '{wfRecord.workflowTypeCd}'
                                }
                            }
                        ]
                    },
                    {
                        items : [
                            {
                                xtype : 'textfield',
                                reference : 'employeeName',
                                checkChangeBuffer : 1000,
                                listeners : {
                                    change : 'handleEmployeeNameChange'
                                },
                                bind : {
                                    fieldLabel : '{employeeFieldLabel}'
                                }
                            }
                        ]
                    }
                ]
            },
            {
                xtype : 'criterion_gridpanel',
                flex : 1,

                bind : {
                    store : '{transactions}'
                },

                columns : [
                    {
                        xtype : 'gridcolumn',
                        text : i18n.gettext('ID'),
                        dataIndex : 'id',
                        width : criterion.Consts.UI_DEFAULTS.COL_ITEM_WIDTH
                    },
                    {
                        xtype : 'gridcolumn',
                        text : i18n.gettext('Initiator'),
                        dataIndex : 'initiator',
                        sortable : false,
                        flex : 1
                    },
                    {
                        xtype : 'gridcolumn',
                        hidden : true,
                        encodeHtml : false,
                        bind : {
                            text : '{objectColumnName}',
                            hidden : '{!showObjectColumn}'
                        },
                        sortable : false,
                        renderer : 'renderObjectColumn',
                        flex : 2
                    },
                    {
                        xtype : 'gridcolumn',
                        text : i18n.gettext('Form'),
                        hidden : true,
                        bind : {
                            hidden : '{!isFormWorkflow}'
                        },
                        dataIndex : 'formName',
                        sortable : false,
                        flex : 1
                    },
                    {
                        xtype : 'datecolumn',
                        text : i18n.gettext('Date / Time'),
                        format : criterion.consts.Api.DATE_AND_TIME_FORMAT,
                        lazyDTFormat : true,
                        dataIndex : 'date',
                        width : 200
                    }
                ],

                plugins : [
                    {
                        ptype : 'rowwidget',
                        widget : {
                            xtype : 'grid',
                            autoLoad : true,
                            bind : {
                                store : '{record.steps}'
                            },
                            cls : 'step-grid',
                            columns : [
                                {
                                    text : i18n.gettext('Step'),
                                    dataIndex : 'stepNumber',
                                    width : 80
                                },
                                {
                                    text : i18n.gettext('Performer'),
                                    dataIndex : 'performer',
                                    flex : 1
                                },
                                {
                                    text : i18n.gettext('Action'),
                                    dataIndex : 'action',
                                    flex : 1
                                },

                                {
                                    text : i18n.gettext('Assigned<br />Employee'),
                                    dataIndex : 'assignedEmployeeName',
                                    flex : 1
                                },
                                {
                                    text : i18n.gettext('Completed/Rejected<br />By Employee'),
                                    dataIndex : 'executedEmployeeName',
                                    flex : 1
                                },
                                {
                                    text : i18n.gettext('Comment'),
                                    dataIndex : 'comment',
                                    flex : 1
                                },
                                {
                                    xtype : 'datecolumn',
                                    width : 200,
                                    text : i18n.gettext('Date / Time'),
                                    format : criterion.consts.Api.DATE_AND_TIME_FORMAT,
                                    lazyDTFormat : true,
                                    dataIndex : 'date'
                                },
                                {
                                    xtype : 'criterion_actioncolumn',
                                    width : criterion.Consts.UI_DEFAULTS.ACTION_COL_ITEM_WIDTH * 3.5,
                                    dataIndex : 'isActiveInWorkflow',
                                    items : [
                                        {
                                            glyph : criterion.consts.Glyph['checkmark-circled'],
                                            text : '',
                                            tooltip : i18n.gettext('Complete'),
                                            action : 'approve',
                                            dataIndex : 'isActiveInWorkflow',
                                            getClass : function(value, metaData, record) {
                                                return (!record || !record.get('isActiveInWorkflow')) ? 'x-hidden' : 'complete-btn';
                                            },
                                            isActionDisabled : function(view, rowIndex, colIndex, item, record) {
                                                return !record || !record.get('isActiveInWorkflow');
                                            }
                                        },
                                        {
                                            glyph : criterion.consts.Glyph['close-circled'],
                                            text : '',
                                            action : 'reject',
                                            tooltip : i18n.gettext('Reject'),
                                            dataIndex : 'isActiveInWorkflow',
                                            getClass : function(value, metaData, record) {
                                                return (!record || !(record.get('isActiveInWorkflow') || record.get('isApprovedTimesheet'))) ? 'x-hidden' : 'reject-btn';
                                            },
                                            isActionDisabled : function(view, rowIndex, colIndex, item, record) {
                                                return !record || !(record.get('isActiveInWorkflow') || record.get('isApprovedTimesheet'));
                                            }
                                        },
                                        {
                                            glyph : criterion.consts.Glyph['ios7-undo-outline'],
                                            text : '',
                                            action : 'recall',
                                            tooltip : i18n.gettext('Recall'),
                                            dataIndex : 'canRecall',
                                            getClass : function(value, metaData, record) {
                                                return (!record || !record.get('canRecall')) ? 'x-hidden' : 'recall-btn';
                                            },
                                            isActionDisabled : function(view, rowIndex, colIndex, item, record) {
                                                return !record || !record.get('canRecall');
                                            }
                                        },
                                        {
                                            glyph : criterion.consts.Glyph['person'],
                                            text : '',
                                            action : 'delegate',
                                            tooltip : i18n.gettext('Delegate'),
                                            dataIndex : 'isActiveInWorkflow',
                                            getClass : function(value, metaData, record) {
                                                return (!record || !record.get('isActiveInWorkflow')) ? 'x-hidden' : 'delegate-btn';
                                            },
                                            isActionDisabled : function(view, rowIndex, colIndex, item, record) {
                                                return !record || !record.get('isActiveInWorkflow');
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
                    }
                ],

                dockedItems : {
                    xtype : 'criterion_toolbar_paging',
                    dock : 'bottom',
                    displayInfo : true,
                    allowAutoLoad : true,
                    allowLoadAll : false,

                    stateId : 'workflowTransactionsGrid',
                    stateful : true
                }

            }
        ]
    };

});

Ext.define('criterion.view.ess.dashboard.Main', function() {

    const CUSTOM_FIELD_ROW_HEIGHT = criterion.Consts.UI_DEFAULTS.CUSTOM_FIELD_ROW_HEIGHT,
        CUSTOM_FIELDS_FORM_NONSCROLLABLE_HEIGHT = criterion.Consts.UI_DEFAULTS.CUSTOM_FIELDS_FORM_NONSCROLLABLE_HEIGHT;

    let hasWorkflowContainer = false,
        timesheetHeader = {
            padding : '0 0 25 0',

            title : {
                height : 0
            },

            layout : {
                type : 'vbox',
                align : 'stretch'
            },

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

                            bind : {
                                html : '{workflowLog.workflowTypeDescription}'
                            }
                        },
                        {
                            xtype : 'component',

                            bind : {
                                html : '<span class="criterion-team-member-name">{workflowLog.employeeName}</span> ' +
                                    '<span class="criterion-team-member-info">({workflowLog.actualData.assignmentTitle})</span>'
                            }
                        },
                        {
                            xtype : 'tbfill'
                        },
                        {
                            xtype : 'button',
                            enableToggle : true,
                            glyph : criterion.consts.Glyph['stats-bars'],
                            ui : 'glyph',
                            toggleHandler : 'onToggleDetails',
                            hidden : true,
                            bind : {
                                hidden : '{isAggregateTimesheet}'
                            }
                        },
                        {
                            xtype : 'tbspacer'
                        },
                        {
                            xtype : 'button',
                            ui : 'secondary',
                            text : i18n.gettext('Summary'),
                            handler : 'onShowSummary',
                            hidden : true,
                            bind : {
                                hidden : '{isAggregateTimesheet}'
                            }
                        }
                    ]
                },
                {
                    xtype : 'toolbar',

                    layout : {
                        type : 'hbox'
                    },

                    padding : 0,

                    bind : {
                        hidden : '{hideDescription}'
                    },

                    items : [
                        {
                            xtype : 'component',

                            bind : {
                                html : '<span class="item-label">Period:</span> {timesheetRecord.startDate:date("' + criterion.consts.Api.SHOW_DATE_FORMAT + '")} &mdash; {timesheetRecord.endDate:date("' + criterion.consts.Api.SHOW_DATE_FORMAT + '")}'
                            }
                        },
                        {
                            xtype : 'tbseparator'
                        },
                        {
                            xtype : 'component',

                            bind : {
                                html : '<span class="item-label">Request Date:</span> {workflowLog.actionTime:date("' + criterion.consts.Api.SHOW_DATE_FORMAT + '")}'
                            }
                        },
                        {
                            xtype : 'tbseparator'
                        },
                        {
                            xtype : 'component',

                            bind : {
                                html : '<span class="item-label">Action Time:</span> {workflowLog.actionTime:date("' + criterion.consts.Api.SHOW_TIME_FORMAT + '")}'
                            }
                        }
                    ]
                },
                {
                    xtype : 'toolbar',

                    layout : {
                        type : 'hbox'
                    },

                    padding : '15 0 0 0',

                    items : [
                        {
                            xtype : 'component',

                            bind : {
                                html : '<span class="item-label">Notes:</span> {workflowLog.actualData.notes}&nbsp;'
                            }
                        }
                    ]
                }
            ]
        };

    return {

        alias : 'widget.criterion_selfservice_dashboard_main',

        extend : 'Ext.container.Container',

        requires : [
            'criterion.vm.ess.dashboard.Main',
            'criterion.store.workflowLogs.PendingLogs',
            'criterion.controller.ess.dashboard.Main',
            'criterion.view.employee.timesheet.Horizontal',
            'criterion.view.employee.timesheet.Vertical',
            'criterion.view.employee.timesheet.Aggregate',
            'criterion.view.ess.community.Stream',
            'criterion.view.ess.dashboard.TaskComments',
            'criterion.view.ess.dashboard.ReviewForm',
            'Ext.layout.container.Table',
            'criterion.view.ess.dashboard.CompareGridColumn',
            'criterion.view.ess.dashboard.workflow.Assignment',
            'criterion.view.ess.dashboard.workflow.Position',
            'criterion.view.ess.dashboard.workflow.CustomFields',
            'criterion.view.ess.dashboard.workflow.EmployeeBenefit',
            'criterion.view.ess.dashboard.EmployeeHireForm',
            'criterion.ux.form.FillableWebForm',
            'criterion.view.ess.CommentsPopup',
            'criterion.view.ess.dashboard.WorkflowItemToolbar'
        ],

        viewModel : 'criterion_ess_dashboard_main',

        controller : {
            type : 'criterion_selfservice_dashboard_main'
        },

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        scrollable : false,

        referenceHolder : true,

        cls : 'criterion-selfservice-dashboard-main overflow-visible',

        items : [],

        fillWorkflowContainer() {
            if (hasWorkflowContainer) {
                return;
            }

            hasWorkflowContainer = true;
            this.add(
                {
                    xtype : 'container',

                    padding : 0,

                    margin : 0,

                    hidden : true,

                    bind : {
                        hidden : '{hideWorkflow}'
                    },

                    layout : 'fit',

                    flex : 1,

                    scrollable : false,

                    items : [
                        {
                            xtype : 'panel',

                            ui : 'clean',

                            reference : 'contentPanel',

                            padding : 0,

                            layout : {
                                type : 'vbox',
                                align : 'stretch',
                                pack : 'start'
                            },

                            cls : 'criterion-ess-panel',

                            frame : true,

                            items : [
                                // TimeOff
                                {
                                    xtype : 'criterion_gridpanel',

                                    bind : {
                                        hidden : '{!isTimeoff}',
                                        store : '{timeoffDetails}'
                                    },

                                    hidden : true,

                                    frame : true,

                                    padding : 0,

                                    header : {
                                        padding : '0 0 25 0',

                                        title : {
                                            height : 0
                                        },

                                        layout : {
                                            type : 'vbox',
                                            align : 'stretch'
                                        },

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

                                                        bind : {
                                                            html : '{workflowLog.workflowTypeDescription}'
                                                        }
                                                    },
                                                    {
                                                        xtype : 'component',

                                                        bind : {
                                                            html : '<span class="criterion-team-member-name">{workflowLog.employeeName}</span>'
                                                        }
                                                    }
                                                ]
                                            },
                                            {
                                                xtype : 'toolbar',

                                                layout : {
                                                    type : 'hbox',
                                                    align : 'stretch'
                                                },

                                                padding : 0,

                                                items : [
                                                    {
                                                        xtype : 'component',

                                                        bind : {
                                                            html : '<span class="item-label">Request Type:</span> {requestTypeText}&nbsp;'
                                                        }
                                                    },
                                                    {
                                                        xtype : 'tbseparator'
                                                    },
                                                    {
                                                        xtype : 'component',

                                                        bind : {
                                                            html : '<span class="item-label">Time Off Type:</span> {timeOffType}&nbsp;'
                                                        }
                                                    },
                                                    {
                                                        xtype : 'tbseparator'
                                                    },
                                                    {
                                                        xtype : 'component',

                                                        bind : {
                                                            html : '<span class="item-label">Request Date:</span> {workflowLog.actionTime:date("' + criterion.consts.Api.SHOW_DATE_FORMAT + '")}&nbsp;'
                                                        }
                                                    },
                                                    {
                                                        xtype : 'tbseparator'
                                                    },
                                                    {
                                                        xtype : 'component',

                                                        bind : {
                                                            html : '<span class="item-label">Action Time:</span> {workflowLog.actionTime:date("' + criterion.consts.Api.SHOW_TIME_FORMAT + '")}&nbsp;'
                                                        }
                                                    },
                                                    {
                                                        xtype : 'tbseparator'
                                                    },
                                                    {
                                                        xtype : 'component',

                                                        bind : {
                                                            html : '<span class="item-label">Accrued:</span> {workflowLog.actualData.accrued:employerAmountPrecision} {units}&nbsp;'
                                                        }
                                                    },
                                                    {
                                                        xtype : 'tbseparator'
                                                    },
                                                    {
                                                        xtype : 'component',

                                                        bind : {
                                                            html : '<span class="item-label">Used:</span> {workflowLog.actualData.used:employerAmountPrecision} {units}&nbsp;'
                                                        }
                                                    },
                                                    {
                                                        xtype : 'tbseparator'
                                                    },
                                                    {
                                                        xtype : 'component',

                                                        bind : {
                                                            html : '<span class="item-label">Net:</span> {workflowLog.actualData.net:employerAmountPrecision} {units}&nbsp;'
                                                        }
                                                    }
                                                ]
                                            },
                                            {
                                                xtype : 'toolbar',

                                                layout : {
                                                    type : 'hbox'
                                                },

                                                padding : '15 0 0 0',

                                                items : [
                                                    {
                                                        xtype : 'component',

                                                        bind : {
                                                            html : '<span class="item-label">Notes:</span> {workflowLog.actualData.notes}&nbsp;'
                                                        }
                                                    },

                                                    {
                                                        xtype : 'component',
                                                        bind : {
                                                            hidden : '{!workflowLog.actualData.attachmentId}',
                                                            html : '<span class="item-label">Document:</span> {workflowLog.actualData.attachmentName}'
                                                        }
                                                    },
                                                    {
                                                        xtype : 'button',
                                                        glyph : criterion.consts.Glyph['ios7-download-outline'],
                                                        tooltip : i18n.gettext('Download'),
                                                        ui : 'act',
                                                        handler : 'handleDownloadAttachedFile',
                                                        bind : {
                                                            hidden : '{!workflowLog.actualData.attachmentId}'
                                                        }
                                                    }
                                                ]
                                            }
                                        ]
                                    },

                                    tbar : {
                                        xtype : 'criterion_selfservice_dashboard_workflow_item_toolbar'
                                    },

                                    columns : [
                                        {
                                            xtype : 'datecolumn',
                                            text : i18n.gettext('Absence Date'),
                                            dataIndex : 'timeOffDate',
                                            flex : 1
                                        },
                                        {
                                            xtype : 'timecolumn',
                                            text : i18n.gettext('Start Time'),
                                            dataIndex : 'timeOffDate',
                                            flex : 1,
                                            renderer : function(val, o, rec) {
                                                return rec.get('isFullDay') ? '' : (Ext.util.Format.dateRenderer(criterion.consts.Api.TIME_FORMAT_US)(val));
                                            }
                                        },
                                        {
                                            xtype : 'gridcolumn',
                                            text : i18n.gettext('Duration'),
                                            dataIndex : 'duration',
                                            width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH,
                                            renderer : function(val) {
                                                return Ext.isString(val) ? val : criterion.Utils.minutesToTimeStr(val);
                                            }
                                        }
                                    ]
                                },

                                // Position Workflow Header
                                {
                                    xtype : 'criterion_selfservice_workflow_position',
                                    reference : 'positionForm',
                                    hidden : true,
                                    bind : {
                                        hidden : '{!isPosition || isDeleteRequest}'
                                    },

                                    scrollable : false,

                                    padding : 0,

                                    frame : true,

                                    header : {

                                        padding : '0 0 25 0',

                                        title : {
                                            height : 0
                                        },

                                        layout : {
                                            type : 'vbox',
                                            align : 'stretch'
                                        },

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

                                                        bind : {
                                                            html : '{workflowLog.workflowTypeDescription}'
                                                        }
                                                    },
                                                    {
                                                        xtype : 'component',

                                                        bind : {
                                                            html : '<span class="criterion-team-member-name">{workflowLog.actualData.title}</span>'
                                                        }
                                                    }
                                                ]
                                            },
                                            {
                                                xtype : 'toolbar',

                                                layout : {
                                                    type : 'hbox'
                                                },

                                                padding : 0,

                                                items : [
                                                    {
                                                        xtype : 'component',

                                                        bind : {
                                                            html : '<span class="item-label">Action:</span> {requestActionTypeText}&nbsp;'
                                                        }
                                                    },
                                                    {
                                                        xtype : 'tbseparator'
                                                    },
                                                    {
                                                        xtype : 'component',

                                                        bind : {
                                                            html : '<span class="item-label">Request Date:</span> {workflowLog.actionTime:date("' + criterion.consts.Api.SHOW_DATE_FORMAT + '")}&nbsp;'
                                                        }
                                                    },
                                                    {
                                                        xtype : 'tbseparator'
                                                    },
                                                    {
                                                        xtype : 'component',

                                                        bind : {
                                                            html : '<span class="item-label">Action Time:</span> {workflowLog.actionTime:date("' + criterion.consts.Api.SHOW_TIME_FORMAT + '")}&nbsp;'
                                                        }
                                                    }
                                                ]
                                            }
                                        ]
                                    },

                                    tbar : {
                                        xtype : 'criterion_selfservice_dashboard_workflow_item_toolbar'
                                    }
                                },

                                // Compare grid
                                {
                                    xtype : 'criterion_gridpanel',

                                    bind : {
                                        store : '{compareChanges}',
                                        hidden : '{!isCompareGrid || !compareGridCount}'
                                    },

                                    frame : true,
                                    padding : 0,

                                    header : {
                                        padding : '0 0 25 0',
                                        title : {
                                            height : 0
                                        },
                                        layout : {
                                            type : 'vbox',
                                            align : 'stretch'
                                        },

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

                                                        bind : {
                                                            html : '{workflowLog.workflowTypeDescription}'
                                                        }
                                                    },
                                                    {
                                                        xtype : 'component',

                                                        bind : {
                                                            html : '<span class="criterion-team-member-name">{workflowLog.employeeName}</span>'
                                                        }
                                                    }
                                                ]
                                            },
                                            {
                                                xtype : 'toolbar',

                                                layout : {
                                                    type : 'hbox'
                                                },

                                                padding : 0,

                                                bind : {
                                                    hidden : '{hideDescription}'
                                                },

                                                items : [
                                                    // dependents and contacts only
                                                    {
                                                        xtype : 'component',

                                                        hidden : true,

                                                        bind : {
                                                            html : '<span class="item-label">Contact:</span> {workflowLog.actualData.firstName} {workflowLog.actualData.lastName}&nbsp;',
                                                            hidden : '{!isDependentsContacts}'
                                                        }
                                                    },
                                                    {
                                                        xtype : 'tbseparator',

                                                        bind : {
                                                            hidden : '{!isDependentsContacts}'
                                                        }
                                                    },
                                                    // end of dependents and contacts only

                                                    // tax only
                                                    {
                                                        xtype : 'component',

                                                        hidden : true,

                                                        bind : {
                                                            html : '<span class="item-label">Tax Name:</span> {workflowLog.actualData.taxName}&nbsp;',
                                                            hidden : '{!isEmployeeTax}'
                                                        }
                                                    },
                                                    {
                                                        xtype : 'tbseparator',

                                                        bind : {
                                                            hidden : '{!isEmployeeTax}'
                                                        }
                                                    },
                                                    //end of tax only
                                                    {
                                                        xtype : 'component',
                                                        hidden : true,
                                                        bind : {
                                                            html : '<span class="item-label">Action:</span> {requestActionTypeText}&nbsp;',
                                                            hidden : '{hideRequestType}'
                                                        }
                                                    },
                                                    {
                                                        xtype : 'tbseparator',
                                                        hidden : true,
                                                        bind : {
                                                            hidden : '{hideRequestType}'
                                                        }
                                                    },
                                                    {
                                                        xtype : 'component',

                                                        bind : {
                                                            html : '<span class="item-label">Request Date:</span> {workflowLog.actionTime:date("' + criterion.consts.Api.SHOW_DATE_FORMAT + '")}&nbsp;'
                                                        }
                                                    },
                                                    {
                                                        xtype : 'tbseparator'
                                                    },
                                                    {
                                                        xtype : 'component',

                                                        bind : {
                                                            html : '<span class="item-label">Action Time:</span> {workflowLog.actionTime:date("' + criterion.consts.Api.SHOW_TIME_FORMAT + '")}&nbsp;'
                                                        }
                                                    }
                                                ]
                                            }
                                        ]
                                    },

                                    hidden : true,

                                    tbar : {
                                        xtype : 'criterion_selfservice_dashboard_workflow_item_toolbar'
                                    },

                                    listeners : {
                                        cellmousedown : function(grid, td, cellIndex, record, tr, rowIndex, e) {
                                            if (e.target.className === 'showBtn') {
                                                let cell = Ext.fly(td);

                                                cell.addCls('show-value');
                                            }

                                        },
                                        cellmouseup : function(grid, td, cellIndex, record, tr, rowIndex, e) {
                                            let cell = Ext.fly(td);

                                            cell.removeCls('show-value');
                                        }
                                    },

                                    columns : [
                                        {
                                            xtype : 'criterion_selfservice_dashboard_compare_grid_column',
                                            text : i18n.gettext('Old'),
                                            bind : {
                                                text : '{oldText}'
                                            },
                                            dataIndex : 'oldData',
                                            flex : 1,
                                            cellWrap : true
                                        },
                                        {
                                            xtype : 'criterion_selfservice_dashboard_compare_grid_column',
                                            text : i18n.gettext('New'),
                                            bind : {
                                                text : '{newText}'
                                            },
                                            dataIndex : 'newData',
                                            flex : 1,
                                            cellWrap : true
                                        }
                                    ]
                                },

                                // Removed data grid
                                {
                                    xtype : 'criterion_gridpanel',

                                    bind : {
                                        store : '{removedData}',
                                        hidden : '{!isRemovedDataGrid}'
                                    },

                                    frame : true,
                                    padding : 0,

                                    header : {
                                        padding : '0 0 25 0',
                                        title : {
                                            height : 0
                                        },
                                        layout : {
                                            type : 'vbox',
                                            align : 'stretch'
                                        },

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
                                                        bind : {
                                                            html : '{workflowLog.workflowTypeDescription}'
                                                        }
                                                    }
                                                ]
                                            },
                                            {
                                                xtype : 'toolbar',

                                                layout : {
                                                    type : 'hbox'
                                                },

                                                padding : 0,

                                                bind : {
                                                    hidden : '{hideDescription}'
                                                },

                                                items : [
                                                    {
                                                        xtype : 'component',
                                                        bind : {
                                                            html : '<span class="item-label">Action:</span> {requestActionTypeText}&nbsp;'
                                                        }
                                                    },
                                                    {
                                                        xtype : 'tbseparator'
                                                    },
                                                    {
                                                        xtype : 'component',
                                                        bind : {
                                                            html : '<span class="item-label">Request Date:</span> {workflowLog.actionTime:date("' + criterion.consts.Api.SHOW_DATE_FORMAT + '")}&nbsp;'
                                                        }
                                                    },
                                                    {
                                                        xtype : 'tbseparator'
                                                    },
                                                    {
                                                        xtype : 'component',
                                                        bind : {
                                                            html : '<span class="item-label">Action Time:</span> {workflowLog.actionTime:date("' + criterion.consts.Api.SHOW_TIME_FORMAT + '")}&nbsp;'
                                                        }
                                                    }
                                                ]
                                            }
                                        ]
                                    },

                                    hidden : true,

                                    tbar : {
                                        xtype : 'criterion_selfservice_dashboard_workflow_item_toolbar'
                                    },

                                    columns : [
                                        {
                                            xtype : 'criterion_selfservice_dashboard_compare_grid_column',
                                            text : i18n.gettext('Removed Record'),
                                            dataIndex : 'oldData',
                                            flex : 1,
                                            cellWrap : true
                                        }
                                    ]
                                },

                                // Open Enrollment
                                {
                                    xtype : 'criterion_panel',

                                    reference : 'openEnrollment',

                                    cls : 'enrollment-summary',

                                    frame : true,

                                    scrollable : false,

                                    padding : 0,

                                    bodyPadding : '0 25',

                                    style : {
                                        overflow : 'hidden'
                                    },

                                    defaults : {
                                        padding : '10 0'
                                    },

                                    hidden : true,

                                    bind : {
                                        hidden : '{!isOpenEnrollment}'
                                    },

                                    header : {
                                        padding : '0 0 25 0',

                                        title : {
                                            height : 0
                                        },

                                        layout : {
                                            type : 'vbox',
                                            align : 'stretch'
                                        },

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

                                                        bind : {
                                                            html : '{workflowLog.workflowTypeDescription}'
                                                        }
                                                    },
                                                    {
                                                        xtype : 'component',

                                                        bind : {
                                                            html : '<span class="criterion-team-member-name">{workflowLog.employeeName}</span>'
                                                        }
                                                    }
                                                ]
                                            },
                                            {
                                                xtype : 'toolbar',

                                                layout : {
                                                    type : 'hbox'
                                                },

                                                padding : 0,

                                                items : [
                                                    {
                                                        xtype : 'component',

                                                        bind : {
                                                            html : '<span class="item-label">Request Date:</span> {workflowLog.actionTime:date("' + criterion.consts.Api.SHOW_DATE_FORMAT + '")}&nbsp;'
                                                        }
                                                    },
                                                    {
                                                        xtype : 'tbseparator'
                                                    },
                                                    {
                                                        xtype : 'component',

                                                        bind : {
                                                            html : '<span class="item-label">Action Time:</span> {workflowLog.actionTime:date("' + criterion.consts.Api.SHOW_TIME_FORMAT + '")}&nbsp;'
                                                        }
                                                    }
                                                ]
                                            }
                                        ]
                                    },

                                    tbar : {
                                        xtype : 'criterion_selfservice_dashboard_workflow_item_toolbar'
                                    }
                                },

                                // Timesheet
                                {
                                    xtype : 'criterion_employee_timesheet_horizontal',
                                    reference : 'timesheetHorizontal',
                                    height : '85%',
                                    buttons : null,
                                    viewDetailOnly : true,
                                    isWorkflowView : true,
                                    hidden : true,
                                    bind : {
                                        hidden : '{!isHorizontalTimesheet}'
                                    },

                                    padding : 0,

                                    header : timesheetHeader,

                                    tbar : {
                                        xtype : 'criterion_selfservice_dashboard_workflow_item_toolbar'
                                    }
                                },
                                {
                                    xtype : 'criterion_employee_timesheet_vertical',
                                    reference : 'timesheetVertical',
                                    height : '85%',
                                    minHeight : 500,
                                    plugins : null,
                                    buttons : null,
                                    hidden : true,
                                    isWorkflowView : true,
                                    bind : {
                                        hidden : '{!isVerticalTimesheet}'
                                    },
                                    viewModel : {
                                        data : {
                                            viewDetailOnly : true
                                        }
                                    },

                                    padding : 0,

                                    header : timesheetHeader,

                                    workflowViewTBar : {
                                        xtype : 'criterion_selfservice_dashboard_workflow_item_toolbar'
                                    }
                                },
                                {
                                    xtype : 'criterion_employee_timesheet_aggregate',
                                    reference : 'timesheetAggregate',
                                    height : '85%',
                                    plugins : null,
                                    buttons : null,
                                    hidden : true,
                                    bind : {
                                        hidden : '{!isAggregateTimesheet}'
                                    },
                                    style : {
                                        overflow : 'hidden'
                                    },
                                    isWorkflowView : true,
                                    viewDetailOnly : true,

                                    padding : 1,

                                    header : timesheetHeader,

                                    tbar : {
                                        xtype : 'criterion_selfservice_dashboard_workflow_item_toolbar'
                                    }
                                },

                                // Termination
                                {
                                    xtype : 'criterion_gridpanel',
                                    bind : {
                                        store : '{compareChanges}',
                                        hidden : '{!isTermination}'
                                    },

                                    hidden : true,
                                    hideHeaders : true,
                                    frame : true,

                                    padding : 0,

                                    header : {
                                        padding : '0 0 25 0',

                                        title : {
                                            height : 0
                                        },

                                        layout : {
                                            type : 'vbox',
                                            align : 'stretch'
                                        },

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

                                                        bind : {
                                                            html : '{workflowLog.workflowTypeDescription}'
                                                        }
                                                    },
                                                    {
                                                        xtype : 'component',

                                                        bind : {
                                                            html : '<span class="criterion-team-member-name">{workflowLog.employeeName}</span>'
                                                        }
                                                    }
                                                ]
                                            },
                                            {
                                                xtype : 'toolbar',

                                                layout : {
                                                    type : 'hbox'
                                                },

                                                padding : 0,

                                                items : [
                                                    {
                                                        xtype : 'component',

                                                        bind : {
                                                            html : '<span class="item-label">Request Date:</span> {workflowLog.actionTime:date("' + criterion.consts.Api.SHOW_DATE_FORMAT + '")}&nbsp;'
                                                        }
                                                    },
                                                    {
                                                        xtype : 'tbseparator'
                                                    },
                                                    {
                                                        xtype : 'component',

                                                        bind : {
                                                            html : '<span class="item-label">Action Time:</span> {workflowLog.actionTime:date("' + criterion.consts.Api.SHOW_TIME_FORMAT + '")}&nbsp;'
                                                        }
                                                    }
                                                ]
                                            }
                                        ]
                                    },

                                    tbar : {
                                        xtype : 'criterion_selfservice_dashboard_workflow_item_toolbar'
                                    },

                                    columns : [
                                        {
                                            bind : {
                                                text : '{newText}'
                                            },
                                            dataIndex : 'newData',
                                            encodeHtml : false,
                                            flex : 1
                                        }
                                    ]
                                },

                                // Assignment
                                {
                                    xtype : 'criterion_selfservice_workflow_assignment',

                                    reference : 'assignmentForm',

                                    scrollable : false,

                                    padding : 0,

                                    hidden : true,

                                    bind : {
                                        hidden : '{!isAssignment}'
                                    },

                                    frame : true,

                                    header : {

                                        padding : '0 0 25 0',

                                        title : {
                                            height : 0
                                        },

                                        layout : {
                                            type : 'vbox',
                                            align : 'stretch'
                                        },

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

                                                        bind : {
                                                            html : '{workflowLog.workflowTypeDescription}'
                                                        }
                                                    },
                                                    {
                                                        xtype : 'component',

                                                        bind : {
                                                            html : '<span class="criterion-team-member-name">{workflowLog.employeeName}</span>'
                                                        }
                                                    }
                                                ]
                                            },
                                            {
                                                xtype : 'toolbar',

                                                layout : {
                                                    type : 'hbox'
                                                },

                                                padding : 0,

                                                items : [
                                                    {
                                                        xtype : 'component',

                                                        bind : {
                                                            html : '<span class="item-label">Request Date:</span> {workflowLog.actionTime:date("' + criterion.consts.Api.SHOW_DATE_FORMAT + '")}&nbsp;'
                                                        }
                                                    },
                                                    {
                                                        xtype : 'tbseparator'
                                                    },
                                                    {
                                                        xtype : 'component',

                                                        bind : {
                                                            html : '<span class="item-label">Action Time:</span> {workflowLog.actionTime:date("' + criterion.consts.Api.SHOW_TIME_FORMAT + '")}&nbsp;'
                                                        }
                                                    }
                                                ]
                                            }
                                        ]
                                    },

                                    tbar : {
                                        xtype : 'criterion_selfservice_dashboard_workflow_item_toolbar'
                                    }
                                },

                                // EE benefit
                                {
                                    xtype : 'panel',

                                    hidden : true,

                                    padding : 0,

                                    bind : {
                                        hidden : '{!isEEBenefit}'
                                    },

                                    frame : true,

                                    header : {
                                        padding : '0 0 25 0',

                                        title : {
                                            height : 0
                                        },

                                        layout : {
                                            type : 'vbox',
                                            align : 'stretch'
                                        },

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

                                                        bind : {
                                                            html : '{workflowLog.workflowTypeDescription}'
                                                        }
                                                    },
                                                    {
                                                        xtype : 'component',

                                                        bind : {
                                                            html : '<span class="criterion-team-member-name">{workflowLog.employeeName}</span>'
                                                        }
                                                    }
                                                ]
                                            },
                                            {
                                                xtype : 'toolbar',

                                                layout : {
                                                    type : 'hbox'
                                                },

                                                padding : 0,

                                                items : [
                                                    {
                                                        xtype : 'component',

                                                        bind : {
                                                            html : '<span class="item-label">Request Date:</span> {workflowLog.actionTime:date("' + criterion.consts.Api.SHOW_DATE_FORMAT + '")}&nbsp;'
                                                        }
                                                    },
                                                    {
                                                        xtype : 'tbseparator'
                                                    },
                                                    {
                                                        xtype : 'component',

                                                        bind : {
                                                            html : '<span class="item-label">Action Time:</span> {workflowLog.actionTime:date("' + criterion.consts.Api.SHOW_TIME_FORMAT + '")}&nbsp;'
                                                        }
                                                    }
                                                ]
                                            },
                                            {
                                                xtype : 'toolbar',

                                                layout : {
                                                    type : 'hbox'
                                                },

                                                padding : 0,

                                                items : [
                                                    {
                                                        xtype : 'component',

                                                        bind : {
                                                            html : '<span class="item-label">Name:</span> {workflowLog.actualData.planName}&nbsp;'
                                                        }
                                                    },
                                                    {
                                                        xtype : 'tbseparator'
                                                    },
                                                    {
                                                        xtype : 'component',

                                                        bind : {
                                                            html : '<span class="item-label">Reason:</span> {workflowLog.requestData.reason}&nbsp;'
                                                        }
                                                    }
                                                ]
                                            }
                                        ]
                                    },

                                    tbar : {
                                        xtype : 'criterion_selfservice_dashboard_workflow_item_toolbar'
                                    },

                                    items : [
                                        {
                                            xtype : 'criterion_selfservice_workflow_employee_benefit',
                                            reference : 'employeeBenefitForm',
                                            padding : '15 0'
                                        }
                                    ]
                                },

                                // Webform
                                {
                                    xtype : 'panel',
                                    bind : {
                                        hidden : '{!isFillableWebForm}'
                                    },
                                    scrollable : 'horizontal',
                                    hidden : true,
                                    layout : 'fit',
                                    frame : true,

                                    margin : '0 0 15',
                                    padding : 0,

                                    header : {
                                        padding : '0 0 25 0',

                                        title : {
                                            height : 0
                                        },

                                        layout : {
                                            type : 'vbox',
                                            align : 'stretch'
                                        },

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

                                                        bind : {
                                                            html : '{workflowLog.workflowTypeDescription}'
                                                        }
                                                    },
                                                    {
                                                        xtype : 'component',

                                                        bind : {
                                                            html : '<span class="criterion-team-member-name">{workflowLog.employeeName}</span>'
                                                        }
                                                    }
                                                ]
                                            },
                                            {
                                                xtype : 'toolbar',

                                                layout : {
                                                    type : 'hbox'
                                                },

                                                padding : 0,

                                                items : [
                                                    {
                                                        xtype : 'component',

                                                        bind : {
                                                            html : '<span class="item-label">Request Date:</span> {workflowLog.actionTime:date("' + criterion.consts.Api.SHOW_DATE_FORMAT + '")}&nbsp;'
                                                        }
                                                    },
                                                    {
                                                        xtype : 'tbseparator',
                                                        bind : {
                                                            hidden : '{!workflowLog.actualData.dueDate}'
                                                        }
                                                    },
                                                    {
                                                        xtype : 'component',

                                                        bind : {
                                                            hidden : '{!workflowLog.actualData.dueDate}',
                                                            html : '<span class="item-label">Due Date:</span> {workflowLog.actualData.dueDate:date("' + criterion.consts.Api.SHOW_DATE_FORMAT + '")}&nbsp;'
                                                        }
                                                    },
                                                    {
                                                        xtype : 'tbseparator'
                                                    },
                                                    {
                                                        xtype : 'component',

                                                        bind : {
                                                            html : '<span class="item-label">Action Time:</span> {workflowLog.actionTime:date("' + criterion.consts.Api.SHOW_TIME_FORMAT + '")}&nbsp;'
                                                        }
                                                    }
                                                ]
                                            }
                                        ]
                                    },

                                    tbar : {
                                        xtype : 'criterion_selfservice_dashboard_workflow_item_toolbar'
                                    },

                                    items : [
                                        {
                                            xtype : 'criterion_fillable_webform',
                                            reference : 'fillableWebForm',
                                            bind : {
                                                editable : '{canEditForm}'
                                            }
                                        }
                                    ]
                                },

                                // Data form
                                {
                                    xtype : 'panel',
                                    bind : {
                                        hidden : '{!isFillableDataForm}'
                                    },
                                    scrollable : 'horizontal',
                                    hidden : true,
                                    layout : 'fit',
                                    frame : true,

                                    margin : '0 0 15',
                                    padding : 0,

                                    header : {
                                        padding : '0 0 25 0',

                                        title : {
                                            height : 0
                                        },

                                        layout : {
                                            type : 'vbox',
                                            align : 'stretch'
                                        },

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

                                                        bind : {
                                                            html : '{workflowLog.workflowTypeDescription}'
                                                        }
                                                    },
                                                    {
                                                        xtype : 'component',

                                                        bind : {
                                                            html : '<span class="criterion-team-member-name">{workflowLog.employeeName}</span>'
                                                        }
                                                    }
                                                ]
                                            },
                                            {
                                                xtype : 'toolbar',

                                                layout : {
                                                    type : 'hbox'
                                                },

                                                padding : 0,

                                                items : [
                                                    {
                                                        xtype : 'component',

                                                        bind : {
                                                            html : '<span class="item-label">Request Date:</span> {workflowLog.actionTime:date("' + criterion.consts.Api.SHOW_DATE_FORMAT + '")}&nbsp;'
                                                        }
                                                    },
                                                    {
                                                        xtype : 'tbseparator',
                                                        bind : {
                                                            hidden : '{!workflowLog.actualData.dueDate}'
                                                        }
                                                    },
                                                    {
                                                        xtype : 'component',

                                                        bind : {
                                                            hidden : '{!workflowLog.actualData.dueDate}',
                                                            html : '<span class="item-label">Due Date:</span> {workflowLog.actualData.dueDate:date("' + criterion.consts.Api.SHOW_DATE_FORMAT + '")}&nbsp;'
                                                        }
                                                    },
                                                    {
                                                        xtype : 'tbseparator'
                                                    },
                                                    {
                                                        xtype : 'component',

                                                        bind : {
                                                            html : '<span class="item-label">Action Time:</span> {workflowLog.actionTime:date("' + criterion.consts.Api.SHOW_TIME_FORMAT + '")}&nbsp;'
                                                        }
                                                    }
                                                ]
                                            }
                                        ]
                                    },

                                    tbar : {
                                        xtype : 'criterion_selfservice_dashboard_workflow_item_toolbar'
                                    },

                                    items : [
                                        {
                                            xtype : 'criterion_fillable_dataform',
                                            reference : 'fillableDataForm',
                                            bind : {
                                                editable : '{canEditForm}'
                                            }
                                        }
                                    ]
                                },

                                // Review
                                {
                                    xtype : 'criterion_selfservice_dashboard_review_form',

                                    reference : 'reviewForm',

                                    hidden : true,

                                    frame : true,

                                    padding : 0,

                                    margin : '0 0 25',

                                    bind : {
                                        hidden : '{!isReview}'
                                    },

                                    scrollable : false,

                                    header : {
                                        padding : '0 0 25 0',

                                        title : {
                                            height : 0
                                        },

                                        layout : {
                                            type : 'vbox',
                                            align : 'stretch'
                                        },

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

                                                        bind : {
                                                            html : '{workflowLog.workflowTypeDescription}'
                                                        }
                                                    },
                                                    {
                                                        xtype : 'component',

                                                        bind : {
                                                            html : '<span class="criterion-team-member-name">{workflowLog.employeeName}</span>'
                                                        }
                                                    }
                                                ]
                                            },
                                            {
                                                xtype : 'toolbar',

                                                layout : {
                                                    type : 'hbox'
                                                },

                                                padding : 0,

                                                items : [
                                                    {
                                                        xtype : 'component',

                                                        bind : {
                                                            html : '<span class="item-label">Request Date:</span> {workflowLog.actionTime:date("' + criterion.consts.Api.SHOW_DATE_FORMAT + '")}&nbsp;'
                                                        }
                                                    },
                                                    {
                                                        xtype : 'tbseparator'
                                                    },
                                                    {
                                                        xtype : 'component',

                                                        bind : {
                                                            html : '<span class="item-label">Action Time:</span> {workflowLog.actionTime:date("' + criterion.consts.Api.SHOW_TIME_FORMAT + '")}&nbsp;'
                                                        }
                                                    }
                                                ]
                                            }
                                        ]
                                    },

                                    tbar : {
                                        xtype : 'criterion_selfservice_dashboard_workflow_item_toolbar'
                                    }
                                },

                                // Employee Hire
                                {
                                    xtype : 'criterion_selfservice_dashboard_employee_hire_form',

                                    reference : 'employeeHireForm',

                                    hidden : true,

                                    frame : true,

                                    padding : 0,

                                    margin : '0 0 25',

                                    bind : {
                                        hidden : '{!isEmployeeHire}'
                                    },

                                    scrollable : false,

                                    header : {
                                        padding : '0 0 25 0',

                                        title : {
                                            height : 0
                                        },

                                        layout : {
                                            type : 'vbox',
                                            align : 'stretch'
                                        },

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

                                                        bind : {
                                                            html : i18n.gettext('Employee Hire')
                                                        }
                                                    },
                                                    {
                                                        xtype : 'component',

                                                        bind : {
                                                            html : '<span class="criterion-team-member-name">{workflowLog.employeeName} &bull; {workflowLog.requestData.person.firstName} {workflowLog.requestData.person.lastName}</span>'
                                                        }
                                                    }
                                                ]
                                            },
                                            {
                                                xtype : 'toolbar',

                                                layout : {
                                                    type : 'hbox'
                                                },

                                                padding : 0,

                                                items : [
                                                    {
                                                        xtype : 'component',

                                                        bind : {
                                                            html : '<span class="item-label">Request Date:</span> {workflowLog.actionTime:date("' + criterion.consts.Api.SHOW_DATE_FORMAT + '")}&nbsp;'
                                                        }
                                                    },
                                                    {
                                                        xtype : 'tbseparator'
                                                    },
                                                    {
                                                        xtype : 'component',

                                                        bind : {
                                                            html : '<span class="item-label">Action Time:</span> {workflowLog.actionTime:date("' + criterion.consts.Api.SHOW_TIME_FORMAT + '")}&nbsp;'
                                                        }
                                                    }
                                                ]
                                            }
                                        ]
                                    },

                                    tbar : {
                                        xtype : 'criterion_selfservice_dashboard_workflow_item_toolbar'
                                    }
                                },

                                // Common Header
                                {
                                    xtype : 'panel',

                                    hidden : true,

                                    frame : true,

                                    collapsed : true,

                                    margin : '0 0 15',

                                    padding : 0,

                                    bind : {
                                        hidden : '{!showCommonHeader}'
                                    },

                                    header : {
                                        padding : '0 0 25 0',

                                        title : {
                                            height : 0
                                        },

                                        layout : {
                                            type : 'vbox',
                                            align : 'stretch'
                                        },

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

                                                        bind : {
                                                            html : '{workflowLog.workflowTypeDescription}'
                                                        }
                                                    },
                                                    {
                                                        xtype : 'component',

                                                        bind : {
                                                            html : '<span class="criterion-team-member-name">{workflowLog.employeeName}</span>'
                                                        }
                                                    }
                                                ]
                                            },
                                            {
                                                xtype : 'toolbar',

                                                layout : {
                                                    type : 'hbox'
                                                },

                                                padding : 0,

                                                items : [
                                                    {
                                                        xtype : 'component',

                                                        bind : {
                                                            html : '<span class="item-label">Request Type:</span> {requestTypeText}&nbsp;'
                                                        }
                                                    },
                                                    {
                                                        xtype : 'tbseparator'
                                                    },
                                                    {
                                                        xtype : 'component',

                                                        bind : {
                                                            html : '<span class="item-label">Request Date:</span> {workflowLog.actionTime:date("' + criterion.consts.Api.SHOW_DATE_FORMAT + '")}&nbsp;'
                                                        }
                                                    },
                                                    {
                                                        xtype : 'tbseparator'
                                                    },
                                                    {
                                                        xtype : 'component',

                                                        bind : {
                                                            html : '<span class="item-label">Action Time:</span> {workflowLog.actionTime:date("' + criterion.consts.Api.SHOW_TIME_FORMAT + '")}&nbsp;'
                                                        }
                                                    }
                                                ]
                                            }
                                        ]
                                    },

                                    tbar : {
                                        xtype : 'criterion_selfservice_dashboard_workflow_item_toolbar'
                                    }
                                },

                                // Common Footer
                                {
                                    xtype : 'criterion_selfservice_workflow_custom_fields',
                                    dock : 'bottom',
                                    reference : 'customFieldsForm',
                                    hidden : true,
                                    frame : true,
                                    padding : '10 0',
                                    weight : 300,
                                    bind : {
                                        hidden : '{!hasCustomFields}'
                                    },
                                    scrollable : false,
                                    responsiveConfig : {
                                        'height < 716' : {
                                            maxHeight : CUSTOM_FIELDS_FORM_NONSCROLLABLE_HEIGHT + CUSTOM_FIELD_ROW_HEIGHT * 1
                                        },
                                        'height >= 716 && height < 812' : {
                                            maxHeight : CUSTOM_FIELDS_FORM_NONSCROLLABLE_HEIGHT + CUSTOM_FIELD_ROW_HEIGHT * 2
                                        },
                                        'height >= 812 && height < 908' : {
                                            maxHeight : CUSTOM_FIELDS_FORM_NONSCROLLABLE_HEIGHT + CUSTOM_FIELD_ROW_HEIGHT * 3
                                        },
                                        'height >= 908 && height < 990' : {
                                            maxHeight : CUSTOM_FIELDS_FORM_NONSCROLLABLE_HEIGHT + CUSTOM_FIELD_ROW_HEIGHT * 4
                                        },
                                        'height >= 990' : {
                                            maxHeight : CUSTOM_FIELDS_FORM_NONSCROLLABLE_HEIGHT + CUSTOM_FIELD_ROW_HEIGHT * 8
                                        }
                                    }
                                },
                                {
                                    xtype : 'container',

                                    dock : 'bottom',

                                    weight : 200,

                                    layout : 'fit',

                                    bind : {
                                        hidden : '{hideComments}'
                                    },

                                    padding : '20 0 10',

                                    items : [
                                        {
                                            xtype : 'component',

                                            bind : {
                                                html : '{commentsTitle}',
                                                userCls : '{hasComments ? "has-comments" : ""}'
                                            },

                                            listeners : {
                                                afterrender : function(cmp) {
                                                    cmp.el.on('click', function() {
                                                        if (cmp.hasCls('has-comments')) {
                                                            cmp.fireEvent('showcomments');
                                                        }
                                                    });
                                                },
                                                showcomments : 'onShowComments'
                                            }
                                        }
                                    ]
                                },
                                {
                                    xtype : 'textfield',
                                    dock : 'bottom',
                                    weight : 50,
                                    reference : 'commentTextarea',
                                    emptyText : i18n.gettext('Write your comment'),
                                    validateOnBlur : false,
                                    allowBlank : false,
                                    padding : '20 0',
                                    hidden : true,
                                    bind : {
                                        value : '{approverComment}',
                                        hidden : '{!needApprove}',
                                        disabled : '{!needApprove}'
                                    }
                                },
                                {
                                    xtype : 'toolbar',

                                    dock : 'bottom',

                                    trackLastItems : true,

                                    padding : '0 0 10 0',

                                    items : [
                                        {
                                            xtype : 'button',
                                            text : i18n.gettext('Reject'),
                                            handler : 'handleReject',
                                            tooltip : i18n.gettext('Please fill the comment field first'),
                                            hidden : true,
                                            bind : {
                                                hidden : '{!needApprove}'
                                            }
                                        },
                                        {
                                            xtype : 'button',
                                            text : i18n.gettext('Save'),
                                            handler : 'handleSave',
                                            hidden : true,
                                            bind : {
                                                hidden : '{!canSave}'
                                            }
                                        },
                                        '->',
                                        {
                                            xtype : 'button',
                                            text : i18n.gettext('Cancel'),
                                            handler : 'handleCancel',
                                            ui : 'light'
                                        },
                                        {
                                            xtype : 'button',
                                            handler : 'handleApprove',
                                            bind : {
                                                text : '{approveText}'
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            );
        }
    };

});

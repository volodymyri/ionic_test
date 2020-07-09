Ext.define('ess.view.Dashboard', function() {

    var WORKFLOW_TYPE_CODE = criterion.Consts.WORKFLOW_TYPE_CODE;

    return {
        alias : 'widget.ess_modern_dashboard',

        extend : 'Ext.Container',

        title : 'Dashboard',

        cls : 'ess-modern-dashboard',

        requires : [
            'ess.controller.dashboard.MyTasks',
            'criterion.vm.ess.dashboard.Main',
            'criterion.store.workflowLogs.PendingLogs',
            'Ext.field.TextArea',
            'ess.view.dashboard.timesheet.Horizontal',
            'ess.view.dashboard.timesheet.Vertical',
            'ess.view.dashboard.timesheet.Aggregate',
            'ess.view.dashboard.PositionForm',
            'ess.view.dashboard.PositionSkills',
            'ess.view.dashboard.EmployeeBenefitForm',
            'ess.view.dashboard.EmployeeHireForm'
        ],

        viewModel : {
            type : 'criterion_ess_dashboard_main',
            data : {
                showCustomFields : false
            },
            stores : {
                workflowLogs : {
                    type : 'criterion_workflow_log_pending_logs',
                    listeners : {
                        beforeload : 'handleBeforeLoadWorkflow',
                        load : 'handleLoadWorkflow'
                    },
                    filters : {
                        property : 'workflowTypeCode',
                        value : [WORKFLOW_TYPE_CODE.FORM, WORKFLOW_TYPE_CODE.EMPLOYEE_REVIEW],
                        operator : 'notin'
                    }
                }
            }
        },

        controller : {
            type : 'ess_modern_dashboard_my_tasks'
        },

        listeners : {
            activate : 'load'
        },

        layout : 'fit',

        items : [
            {
                xtype : 'ess_modern_menubar',
                docked : 'top'
            },
            {
                xtype : 'list',
                height : '100%',
                reference : 'workflowLogGrid',
                itemCls : 'ess-inbox-list-item',
                itemTpl : '<div class="ess-inbox-list-title">{employeeName} &ndash; {workflowTypeDesc}</div>' +
                '<div><span class="ess-inbox-list-date"><span class="x-fa fa-calendar"></span>{actionTime:date("' + criterion.Consts.UI_DATE_FORMAT.SHORT_DATE + '")}</span>' +
                '<span class="ess-inbox-list-comments"><span class="x-fa fa-comments"></span>{commentsCount}</span></div>',
                bind : {
                    store : '{workflowLogs}',
                    hidden : '{hideList}'
                },
                listeners : {
                    itemTap : 'onInboxTap'
                }
            },
            {
                xtype : 'container',

                bind : {
                    hidden : '{!hideList}'
                },

                hidden : true,

                scrollable : true,

                items : [
                    {
                        xtype : 'component',
                        cls : 'criterion-section-header',
                        bind : {
                            html : '{workflowLog.employeeName} &ndash; {workflowLog.workflowTypeDesc}'
                        }
                    },
                    {
                        xtype : 'container',
                        reference : 'openEnrollment',
                        cls : 'ess-enrollment-summary',

                        defaults : {
                            margin : '0 20'
                        },

                        bind : {
                            hidden : '{!isOpenEnrollment}'
                        },
                        hidden : true
                    },
                    {
                        xtype : 'ess_modern_dashboard_timesheet_horizontal',
                        reference : 'timesheetHorizontal',
                        bind : {
                            hidden : '{!isHorizontalTimesheet}'
                        },
                        hidden : true
                    },
                    {
                        xtype : 'ess_modern_dashboard_timesheet_vertical',
                        reference : 'timesheetVertical',
                        bind : {
                            hidden : '{!isVerticalTimesheet}'
                        },
                        hidden : true
                    },
                    {
                        xtype : 'ess_modern_dashboard_timesheet_aggregate',
                        reference : 'timesheetAggregate',
                        bind : {
                            hidden : '{!isAggregateTimesheet}'
                        },
                        hidden : true
                    },
                    {
                        cls : 'ess-dataview-two-col-table ess-inbox-timeoff-item',

                        bind : {
                            hidden : '{!isTimeoff}',
                            html : '<table>' +
                                '<tr><td class="bold">Request Type</td><td>{requestTypeText}</td></tr>' +
                                '<tr><td class="bold">Time Off Type</td><td>{timeOffType}</td></tr>' +
                                '</table>'
                        },
                        hidden : true
                    },
                    {
                        cls : 'ess-inbox-timeoff-details',
                        bind : {
                            hidden : '{!isTimeoff}'
                        },
                        html : '<table class="header"><tr><td class="bold">Absence Date</td><td class="bold">Start Time</td><td class="bold">Duration</td></tr></table>',
                        hidden : true
                    },
                    {
                        xtype : 'dataview',
                        cls : 'ess-inbox-timeoff-details',

                        bind : {
                            hidden : '{!isTimeoff}',
                            store : '{timeoffDetails}'
                        },
                        hidden : true,
                        scrollable : false,
                        itemTpl : new Ext.XTemplate(
                            '<tpl for=".">',
                            '<table class="footer">' +
                            '<tr>' +
                            '<td>{timeOffDate:date("m/d/Y")}</td>' +
                            '<td><tpl if="!isFullDay">{timeOffDate:date("h:ia")}</tpl><tpl if="isFullDay">&mdash;</tpl></td>' +
                            '<td>{duration}</td>' +
                            '</tr>' +
                            '</table>' +
                            '</tpl>'
                        )
                    },
                    {
                        cls : 'ess-dataview-two-col-table ess-inbox-timeoff-item',

                        bind : {
                            hidden : '{!isTimeoff}',
                            html : '<table>' +
                                '<tr><td class="bold">Request Date</td><td>{workflowLog.actionTime:date("m/d/Y")}</td></tr>' +
                                '<tr><td class="bold">Action Time</td><td>{workflowLog.actionTime:date("h:ia")}</td></tr>' +

                                '<tr class="tborder"><td class="bold">Accrued</td><td>{workflowLog.actualData.accrued:employerAmountPrecision} {units}</td></tr>' +
                                '<tr><td class="bold">Used</td><td>{workflowLog.actualData.used:employerAmountPrecision} {units}</td></tr>' +
                                '<tr><td class="bold">Net</td><td>{workflowLog.actualData.net:employerAmountPrecision} {units}</td></tr>' +

                                '<tr class="tborder"><td class="bold">Notes</td><td>{workflowLog.actualData.notes}</td></tr>' +

                                '</table>'
                        },
                        hidden : true
                    },
                    {
                        cls : 'ess-dataview-two-col-table',
                        bind : {
                            hidden : '{!isEmployeeTax}',
                            html : '<table>' +
                            '<tr class="bborder"><td class="bold">Tax Name</td><td>{workflowLog.actualData.taxName}</td></tr>' +
                            '</table>'
                        },
                        hidden : true
                    },
                    {
                        xtype : 'component',
                        cls : 'ess-inbox-request-type',
                        padding : '10 20',
                        hidden : true,
                        bind : {
                            hidden : '{!showRequestType}',
                            html : '{requestTypeText}'
                        }
                    },

                    // dependents and contacts
                    {
                        cls : 'ess-dataview-two-col-table',
                        hidden : true,
                        bind : {
                            hidden : '{!isDependentsContacts}',
                            html : '<table>' +
                            '<tr><td class="bold">Request Date</td><td>{workflowLog.actionTime:date("m/d/Y")}</td></tr>' +
                            '<tr><td class="bold">Action Time</td><td>{workflowLog.actionTime:date("h:ia")}</td></tr>' +
                            '<tr class="bborder"><td class="bold">Contact</td><td>{workflowLog.actualData.firstName} {workflowLog.actualData.lastName}</td></tr>' +
                            '</table>'
                        }
                    },

                    // Position
                    {
                        cls : 'ess-dataview-two-col-table',
                        bind : {
                            hidden : '{!isPosition}',
                            html : '<table>' +
                            '<tr class="tborder"><td class="bold">Request Date</td><td>{workflowLog.actionTime:date("m/d/Y")}</td></tr>' +
                            '<tr class="bborder"><td class="bold">Title</td><td>{workflowLog.actualData.title}</td></tr>' +
                            '</table>'
                        },
                        hidden : true
                    },

                    // New Position
                    {
                        xtype : 'ess_modern_dashboard_position_form',
                        bind : {
                            hidden : '{!isPosition || !isCreateRequest}',
                            requestData : '{workflowLog.requestData}',
                            skills : '{workflowLog.requestData.skills}'
                        },
                        hidden : true
                    },

                    // Compare grid
                    {
                        xtype : 'component',
                        cls : 'ess-inbox-profile-header',
                        bind : {
                            hidden : '{!modernAllowCompareGrid || !compareGridCount}'
                        },
                        hidden : true,
                        html : '<table width="100%"><tr>' +
                        '<th style="width: 50%">Old data</th>' +
                        '<th style="width: 50%">New data</th>' +
                        '</tr></table>'
                    },
                    {
                        xtype : 'dataview',
                        scrollable : false,
                        bind : {
                            store : '{compareChanges}',
                            hidden : '{!modernAllowCompareGrid || !compareGridCount}'
                        },
                        hidden : true,
                        cls : 'ess-dataview-two-col-table ess-inbox-profile-item',

                        itemTpl : '<table><tr>' +
                            '<tpl if="!isSSN"><td>{oldData}</td></tpl>' +
                            '<tpl if="isSSN"><td><span class="bold">{item}:</span> <span class="mask">·········</span><span class="value">{actual}</span><i class="showBtn"></i></td></tpl>' +

                            '<tpl if="!isSSN"><td>{newData}</td></tpl>' +
                            '<tpl if="isSSN"><td><span class="bold">{item}:</span> <span class="mask">·········</span><span class="value">{request}</span><i class="showBtn"></i></td></tpl>' +
                        '</tr></table>',
                        listeners : {
                            itemtouchstart : function(item) {
                                item.addCls('show-value');

                                item.on({
                                    itemtouchend : function() {
                                        item.removeCls('show-value');
                                    },
                                    single : true
                                });
                            }
                        }
                    },

                    // Removed Data Grid
                    {
                        xtype : 'component',
                        cls : 'ess-inbox-profile-header',
                        bind : {
                            hidden : '{!isRemovedDataGrid}'
                        },
                        hidden : true,
                        html : '<table width="100%"><tr>' +
                            '<th>Removed Record</th>' +
                            '</tr></table>'
                    },
                    {
                        xtype : 'dataview',
                        scrollable : false,
                        bind : {
                            store : '{removedData}',
                            hidden : '{!isRemovedDataGrid}'
                        },
                        hidden : true,
                        cls : 'ess-dataview-two-col-table ess-inbox-profile-item',

                        itemTpl : '<table><tr>' +
                            '<tpl if="!isSSN"><td>{oldData}</td></tpl>' +
                            '<tpl if="isSSN"><td><span class="bold">{item}:</span> <span class="mask">·········</span><span class="value">{actual}</span><i class="showBtn"></i></td></tpl>' +
                            '</tr></table>',
                        listeners : {
                            itemtouchstart : function(item) {
                                item.addCls('show-value');

                                item.on({
                                    itemtouchend : function() {
                                        item.removeCls('show-value');
                                    },
                                    single : true
                                });
                            }
                        }
                    },

                    // Edit position skills
                    {
                        xtype : 'panel',
                        bind : {
                            hidden : '{!isPosition || !isUpdateRequest || !workflowLog.requestData.skills}'
                        },
                        hidden : true,
                        bodyPadding : 20,
                        items : [
                            {
                                xtype : 'component',
                                html : i18n.gettext('Skill changes'),
                                cls : 'section-title'
                            },
                            {
                                xtype : 'ess_modern_dashboard_position_skills',
                                bind : {
                                    skills : '{workflowLog.requestData.skills}'
                                }
                            }
                        ]
                    },

                    // Termination
                    {
                        xtype : 'dataview',

                        scrollable : false,

                        bind : {
                            store : '{compareChanges}',
                            hidden : '{!isTermination}'
                        },
                        hidden : true,
                        cls : 'ess-dataview-two-col-table ess-inbox-profile-item',

                        itemTpl : '<table><tr>' +
                            '<td>{newData}</td>' +
                        '</tr></table>'
                    },

                    // Assignment
                    {
                        cls : 'ess-dataview-two-col-table',
                        hidden : true,
                        bind : {
                            hidden : '{!isAssignment}',
                            html : '<table>' +
                            '<tr><td class="bold">Request Date</td><td>{workflowLog.actionTime:date("m/d/Y")}</td></tr>' +
                            '<tr><td class="bold">Action Time</td><td>{workflowLog.actionTime:date("h:ia")}</td></tr>' +

                            '<tr class="tborder"><td class="bold">Title</td><td>{assignmentDetailTitle}</td></tr>' +
                            '</table>'
                        }
                    },
                    {
                        cls : 'ess-dataview-two-col-table',
                        hidden : true,
                        bind : {
                            hidden : '{!isAssignment || !isAssignmentWithTerminate}',
                            html : '<table>' +
                            '<tr><td class="bold">Termination Reason</td><td>{terminationDescription}</td></tr>' +
                            '<tr><td class="bold">Termination Date</td><td>{expirationDate}</td></tr>' +
                            '</table>'
                        }
                    },
                    {
                        xtype : 'dataview',
                        scrollable : false,
                        bind : {
                            store : '{compareChanges}',
                            hidden : '{!isAssignment || isAssignmentWithTerminate}'
                        },
                        hidden : true,
                        cls : 'ess-dataview-two-col-table ess-inbox-profile-item',

                        itemTpl : '<table><tr>' +
                        '<td>{newData}</td>' +
                        '</tr></table>'
                    },

                    // EE benefit
                    {
                        cls : 'ess-dataview-two-col-table',
                        bind : {
                            hidden : '{!isEEBenefit}',
                            html : '<table>' +
                            '<tr class="tborder"><td class="bold">Request Date</td><td>{workflowLog.actionTime:date("m/d/Y")}</td></tr>' +
                            '<tr><td class="bold">Action Time</td><td>{workflowLog.actionTime:date("h:ia")}</td></tr>' +
                            '<tr><td class="bold">Name</td><td>{workflowLog.actualData.planName}</td></tr>' +
                            '<tr class="bborder"><td class="bold">Reason</td><td>{workflowLog.requestData.reason}</td></tr>' +
                            '</table>'
                        },
                        hidden : true
                    },
                    {
                        xtype : 'ess_modern_dashboard_employee_benefit_form',
                        bind : {
                            hidden : '{!isEEBenefit}',
                            workflowLog : '{workflowLog}'
                        },
                        hidden : true
                    },

                    // new hire
                    {
                        xtype : 'ess_modern_dashboard_employee_hire_form',
                        bind : {
                            hidden : '{!isEmployeeHire}',
                            workflowLog : '{workflowLog}'
                        },
                        hidden : true
                    },

                    // custom fields
                    {
                        xtype : 'container',
                        reference : 'customValueContainer',
                        cls : 'ess-inbox-custom-value-container',
                        margin : '5 0 10 0',
                        bind : {
                            hidden : '{!showCustomFields || isDeleteRequest}'
                        },
                        hidden : true
                    },

                    {
                        xtype : 'component',
                        cls : 'criterion-section-header',
                        html : 'Comments',
                        bind : {
                            hidden : '{hideComments}'
                        }
                    },

                    {
                        xtype : 'dataview',
                        cls : 'ess-inbox-comments',

                        bind : {
                            hidden : '{hideComments}',
                            data : '{workflowLog.comments}'
                        },
                        hidden : true,
                        scrollable : false,
                        itemTpl : new Ext.XTemplate(
                            '<tpl for=".">',
                            '<div class="ess-inbox-comment">',
                            '<p class="name">{commentator}</p>',
                            '<p class="date">Publish on {date:date(criterion.consts.Api.SHOW_DATE_FORMAT)}</p>',
                            '<p class="comment-text">{comment}</p>',
                            '</div>',
                            '</tpl>'
                        )
                    }
                ]
            },
            // controls
            {
                xtype : 'container',
                docked : 'bottom',

                bind : {
                    hidden : '{!hideList}'
                },
                hidden : true,

                cls : 'workflowActions',

                items : [
                    {
                        xtype : 'textareafield',
                        reference : 'commentTextarea',
                        cls : 'ess-inbox-comment-textarea',
                        placeholder : 'Type your comment...',
                        bind : {
                            value : '{approverComment}'
                        }
                    },
                    {
                        xtype : 'container',
                        layout : 'hbox',
                        items : [
                            {
                                xtype : 'button',
                                text : i18n.gettext('Reject'),
                                handler : 'handleReject',
                                tooltip : i18n.gettext('Please fill the comment field first'),
                                cls : 'criterion-btn-reject',
                                margin : '10',
                                flex : 1
                            },
                            {
                                xtype : 'button',
                                handler : 'handleApprove',
                                bind : {
                                    text : '{approveText}'
                                },
                                cls : 'criterion-btn-approve',
                                margin : '10',
                                flex : 1
                            }
                        ]
                    }
                ]
            }
        ]

    };

});


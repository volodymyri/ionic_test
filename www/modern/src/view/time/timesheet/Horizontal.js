Ext.define('ess.view.time.timesheet.Horizontal', function() {

    var WORKFLOW_STATUSES = criterion.Consts.WORKFLOW_STATUSES;

    return {
        alias : 'widget.ess_modern_time_timesheet_horizontal',

        extend : 'Ext.container.Container',

        requires : [
            'ess.controller.time.timesheet.Horizontal',

            'criterion.store.employee.timesheet.ByDate',
            'criterion.store.employee.timesheet.ByDateDetail',

            'criterion.store.employee.WorkLocations',
            'criterion.store.workLocation.Areas',
            'criterion.store.employee.timesheet.AvailableProjects',
            'criterion.store.employee.timesheet.AvailableTasks',
            'criterion.store.employee.timesheet.AvailableAssignments',
            'criterion.store.employee.timesheet.LIncomes',

            'ess.view.time.timesheet.horizontal.Form',
            'ess.view.time.timesheet.TotalBar'
        ],

        cls : 'ess-timesheet-detail',

        layout : 'card',

        viewModel : {
            stores : {
                timesheetDetailsByDate : {
                    type : 'criterion_employee_timesheet_details_by_date',
                    sorters : 'date',
                    proxy : {
                        extraParams : {
                            timesheetId : '{timesheetRecord.id}'
                        }
                    }
                },
                workLocations : {
                    type : 'criterion_employee_work_locations',
                    sorters : [{
                        property : 'employerLocationName',
                        direction : 'ASC'
                    }]
                },
                workLocationAreas : {
                    type : 'work_location_areas'
                },
                availableProjects : {
                    type : 'criterion_employee_timesheet_available_projects'
                },
                availableTasks : {
                    type : 'criterion_employee_timesheet_available_tasks',
                    filters : [
                        {
                            property : 'isActive',
                            value : true
                        }
                    ]
                },
                availableAssignments : {
                    type : 'criterion_employee_timesheet_available_assignments'
                },
                incomeCodes : {
                    type : 'criterion_employee_timesheet_lincomes',
                    filters : [
                        {
                            property : 'isActive',
                            value : true
                        }
                    ]
                }
            },

            formulas : {
                isEditable : function(data) {
                    return (data('timesheetRecord.timesheetStatusCode') === WORKFLOW_STATUSES.NOT_SUBMITTED
                        || data('timesheetRecord.timesheetStatusCode') === WORKFLOW_STATUSES.REJECTED);
                },

                getNotesIcon : function(get) {
                    return Ext.isEmpty(get('timesheetRecord.notes')) ? 'md-icon-chat-bubble' : 'md-icon-chat';
                },

                hideSubmit : function(data) {
                    return !data('timesheetRecord.notSubmittedOrRejected')
                },

                canEditByStatus : function(data) {
                    return data('timesheetRecord.canBeEdited')
                },

                canEditAction : {
                    bind : {
                        bindTo : '{timesheetRecord}',
                        deep : true
                    },
                    get : function(timesheetRecord) {
                        var timesheetType = timesheetRecord && Ext.isFunction(timesheetRecord['getTimesheetType']) && timesheetRecord.getTimesheetType(),
                            disableManual = timesheetType && (timesheetType.get('entryType') === criterion.Consts.TIMESHEET_LAYOUT_ENTRY_TYPE.BUTTON);

                        if (disableManual) {
                            return false
                        } else {
                            return timesheetRecord.get('canBeEdited')
                        }
                    }
                }
            }
        },

        controller : {
            type : 'ess_modern_time_timesheet_horizontal'
        },

        items : [
            {
                xtype : 'container',
                id : 'timesheetDetailsGridOneWrapper',
                height : '100%',

                layout : {
                    type : 'vbox',
                    align : 'stretch'
                },

                items : [
                    {
                        xtype : 'ess_modern_menubar',
                        docked : 'top',
                        title : i18n.gettext('Summary'),
                        buttons : [
                            {
                                xtype : 'button',
                                itemId : 'backButton',
                                cls : 'criterion-menubar-back-btn',
                                iconCls : 'md-icon-arrow-back',
                                align : 'left',
                                handler : 'handleBack'
                            }
                        ],
                        actions : [
                            {
                                xtype : 'button',
                                bind : {
                                    iconCls : '{getNotesIcon}'
                                },
                                handler : 'handleNotes'
                            },
                            {
                                xtype : 'button',
                                iconCls : 'md-icon-send',
                                bind : {
                                    hidden : '{hideSubmit}'
                                },
                                handler : 'handleSubmitTimesheet'
                            }
                        ]
                    },

                    {
                        xtype : 'component',
                        hidden : true,
                        bind : {
                            hidden : '{!timesheetRecord.timesheetStatusCode}',
                            html : '{timesheetRecord.timesheetStatusDescription}',
                            cls : 'panel-of-workflow-status {timesheetRecord.timesheetStatusCode}'
                        }
                    },

                    {
                        xtype : 'ess_modern_time_timesheet_total_bar',
                        bind : {
                            startDate : '{timesheetRecord.startDate:date("m/d/Y")}',
                            endDate : '{timesheetRecord.endDate:date("m/d/Y")}',
                            totalHours : '{timesheetRecord.formattedTotalHours}'
                        }
                    },

                    {
                        xtype : 'criterion_gridview',
                        id : 'timesheetDetailsGridOne',
                        bind : {
                            store : '{timesheetDetailsByDate}'
                        },

                        flex : 1,
                        cls : 'days-grid',

                        controller : null,

                        itemConfig : {
                            viewModel : {
                                data : {},
                                formulas : {
                                    dateCls : function(data) {
                                        var currDate = Ext.Date.format(new Date(), 'Y.m.d');

                                        return Ext.Date.format(data('record.date'), 'Y.m.d') === currDate ? 'currentDate' : '';
                                    }
                                }
                            }
                        },

                        columns : [
                            {
                                xtype : 'datecolumn',
                                text : i18n.gettext('Date'),
                                width : 200,
                                dataIndex : 'date',
                                format : 'd M l',
                                sortable : false,
                                cell : {
                                    bind : {
                                        cellCls : '{dateCls}'
                                    }
                                }
                            },
                            {
                                dataIndex : 'totalHours',
                                sortable : false,
                                text : i18n.gettext('Hours Logged'),
                                renderer : function(value) {
                                    return criterion.Utils.hourStrToFormattedStr(value);
                                },
                                flex : 1,
                                cell : {
                                    bind : {
                                        cellCls : '{dateCls}'
                                    },
                                    encodeHtml : false
                                }
                            }
                        ]
                    }
                ]
            },
            {
                xtype : 'container',
                id : 'timesheetDetailsGridTwoWrapper',
                hidden : true,
                height : '100%',

                listeners : {
                    scope : 'controller'
                },

                layout : {
                    type : 'vbox',
                    align : 'stretch'
                },

                items : [
                    {
                        xtype : 'ess_modern_menubar',
                        docked : 'top',
                        bind : {
                            title : '<p class="two-lines one">{timesheetDayDetailsRecord.date:date("d M Y")}</p><p class="two-lines two">{timesheetDayDetailsRecord.date:date("l")}</p>'
                        },
                        buttons : [
                            {
                                xtype : 'button',
                                itemId : 'backButton',
                                cls : 'criterion-menubar-back-btn',
                                iconCls : 'md-icon-arrow-back',
                                align : 'left',
                                handler : 'handleCancelViewDetailTwo'
                            }
                        ],
                        actions : [
                            {
                                xtype : 'button',
                                iconCls : 'md-icon-add',
                                bind : {
                                    hidden : '{!timesheetRecord.canBeEdited}'
                                },
                                handler : 'handleAddTaskAction'
                            }
                        ]
                    },
                    {
                        xtype : 'panel',
                        cls : 'timesheet-empty-details',
                        hidden : true,
                        height : '100%',
                        bind : {
                            hidden : '{timesheetDayDetailsRecord.details.count}'
                        },
                        layout : 'center',
                        items : [
                            {
                                xtype : 'container',
                                layout : {
                                    type : 'vbox',
                                    align : 'center'
                                },
                                scrollable : 'vertical',
                                items : [
                                    {
                                        xtype : 'component',
                                        margin : '10 0 10 0',
                                        width : '300',
                                        html : '<div class="icon"></div>' +
                                            '<div class="text">' +
                                            '<p class="title">' + i18n.gettext('Timesheet is Empty') + '</p>' +
                                            '<p class="desc">' + i18n.gettext('Add your first time log') + '</p>' +
                                            '</div>'
                                    },
                                    {
                                        xtype : 'button',
                                        ui : 'act-btn-save',
                                        width : '200',
                                        handler : 'handleAddTaskAction',
                                        text : i18n.gettext('Add Time Log'),
                                        margin : '0 0 10 0'
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        xtype : 'criterion_grid',
                        id : 'timesheetDetailsGridTwo',
                        reference : 'timesheetDetailsGridTwo',

                        bind : {
                            store : '{timesheetDayDetailsRecord.details}',
                            hidden : '{!timesheetDayDetailsRecord.details.count}'
                        },

                        hideMode : 'offsets',

                        listeners : {
                            scope : 'controller',
                            itemtap : 'handleEditTimesheetDetail'
                        },

                        height : '100%',

                        columns : [
                            {
                                text : i18n.gettext('Paycode'),
                                dataIndex : 'paycodeName',
                                flex : 1,
                                minWidth : 150,
                                sortable : false
                            },
                            {
                                text : i18n.gettext('Project'),
                                dataIndex : 'projectId',
                                flex : 1,
                                minWidth : 150,
                                sortable : false,
                                hidden : true,
                                cell : {
                                    xtype : 'storevalue',
                                    fieldName : 'name',
                                    bind : {
                                        store : '{availableProjects}'
                                    }
                                },
                                bind : {
                                    hidden : '{!timesheetRecord.timesheetType.isShowProject}'
                                }
                            },
                            {
                                text : i18n.gettext('Task'),
                                dataIndex : 'taskId',
                                flex : 1,
                                minWidth : 150,
                                sortable : false,
                                hidden : true,
                                cell : {
                                    xtype : 'storevalue',
                                    fieldName : 'name',
                                    bind : {
                                        store : '{availableTasks}'
                                    }
                                },
                                bind : {
                                    hidden : '{!timesheetRecord.timesheetType.isShowTasks}'
                                }
                            },
                            {
                                text : i18n.gettext('Location'),
                                dataIndex : 'employerWorkLocationId',
                                flex : 1,
                                minWidth : 150,
                                sortable : false,
                                hidden : true,
                                cell : {
                                    xtype : 'storevalue',
                                    fieldName : 'employerLocationName',
                                    valueField : 'employerWorkLocationId',
                                    valueNotFoundTpl : '{employerWorkLocationName}',
                                    bind : {
                                        store : '{workLocations}'
                                    }
                                },
                                bind : {
                                    hidden : '{workLocations.count <= 1 && !timesheetRecord.timesheetType.isShowWorkLocation}'
                                }
                            },
                            {
                                text : i18n.gettext('Assignment'),
                                dataIndex : 'assignmentId',
                                sortable : false,
                                flex : 1,
                                minWidth : 150,
                                hidden : true,
                                cell : {
                                    xtype : 'storevalue',
                                    fieldName : 'title',
                                    valueField : 'assignmentId',
                                    bind : {
                                        store : '{availableAssignments}'
                                    }
                                },
                                bind : {
                                    hidden : '{availableAssignments.count <= 1 && !timesheetRecord.timesheetType.isShowAssignment}'
                                }
                            },
                            {
                                text : i18n.gettext('Hours'),
                                sortable : false,
                                dataIndex : 'hoursToGrid',
                                width : 100
                            }
                        ]
                    }
                ]
            },
            {
                xtype : 'criterion_time_timesheet_horizontal_form',
                hidden : true,

                listeners : {
                    close : 'handleTimesheetDetailModificateFinish',
                    save : function() {
                        criterion.Utils.toast(i18n.gettext('Timesheet Saved.'));
                    }
                }
            }
        ]
    };

});

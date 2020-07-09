Ext.define('ess.view.time.timesheet.Vertical', function() {

    return {
        alias : 'widget.ess_modern_time_timesheet_vertical',

        extend : 'Ext.container.Container',

        requires : [
            'ess.controller.time.timesheet.Vertical',
            'criterion.vm.timesheet.Vertical',
            'ess.view.time.timesheet.vertical.DetailForm',
            'ess.view.time.timesheet.TotalBar'
        ],

        controller : {
            type : 'ess_modern_time_timesheet_vertical'
        },

        cls : 'ess-timesheet-detail-vertical',

        viewModel : {
            type : 'criterion_timesheet_vertical'

            /**
             * timesheetRecord - instance criterion.model.employee.Timesheet
             * timesheetVertical - instance criterion.model.employee.timesheet.Vertical
             * timesheetDayDetailsRecord - instance criterion.model.employee.timesheet.vertical.Day
             */
        },

        layout : 'card',

        items : [
            {
                xtype : 'container',
                reference : 'timesheetVerticalDaysGrid',

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
                                    hidden : '{!showSubmitTimesheet}'
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

                        cls : 'days-grid',
                        bind : {
                            store : '{timesheetVertical.days}'
                        },
                        flex : 1,

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
                                dataIndex : 'date',
                                width : 200,
                                format : 'd M l',
                                text : i18n.gettext('Date'),
                                sortable : false,
                                cell : {
                                    bind : {
                                        cellCls : '{dateCls}'
                                    }
                                }
                            },
                            {
                                dataIndex : 'totalHours',
                                flex : 1,
                                text : i18n.gettext('Hours Logged'),
                                sortable : false,
                                renderer : function(value) {
                                    return criterion.Utils.hourStrToFormattedStr(value);
                                },
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
                reference : 'timesheetVerticalDayDetailsGrid',
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
                                handler : 'handleCancelDayDetailsGrid'
                            }
                        ],
                        actions : [
                            {
                                xtype : 'button',
                                iconCls : 'md-icon-add',
                                bind : {
                                    hidden : '{!timesheetVertical.canBeEdited}'
                                },
                                handler : 'handleAddTimesheetDetail'
                            }
                        ]
                    },
                    {
                        xtype : 'criterion_time_timesheet_vertical_top_bar',
                        docked : 'top',
                        bind : {
                            timezone : '{timezone}',
                            overtime : '{timesheetDayDetailsRecord.overtimeHours}',
                            regIncome : '{timesheetDayDetailsRecord.regHours}',
                            totalHours : '{timesheetDayDetailsRecord.totalHours}'
                        }
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
                                        hidden : true,
                                        html : '<div class="icon"></div>' +
                                            '<div class="text">' +
                                            '<p class="title">' + i18n.gettext('Timesheet is Empty') + '</p>' +
                                            '</div>',
                                        bind : {
                                            hidden : '{timesheetVertical.canBeEdited}'
                                        }
                                    },
                                    {
                                        xtype : 'component',
                                        margin : '10 0 10 0',
                                        width : '300',
                                        hidden : true,
                                        html : '<div class="icon"></div>' +
                                            '<div class="text">' +
                                            '<p class="title">' + i18n.gettext('Timesheet is Empty') + '</p>' +
                                            '<p class="desc">' + i18n.gettext('Add your first time log') + '</p>' +
                                            '</div>',
                                        bind : {
                                            hidden : '{!timesheetVertical.canBeEdited}'
                                        }
                                    },
                                    {
                                        xtype : 'button',
                                        ui : 'act-btn-save',
                                        width : '200',
                                        handler : 'handleAddTimesheetDetail',
                                        text : i18n.gettext('Add Time Log'),
                                        margin : '0 0 10 0',
                                        hidden : '{!timesheetVertical.canBeEdited}'
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        xtype : 'criterion_grid',

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
                                    hidden : '{!timesheetVertical.timesheetType.isShowProject}'
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
                                    hidden : '{!timesheetVertical.timesheetType.isShowTasks}'
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
                                    hidden : '{workLocations.count <= 1 && !timesheetVertical.timesheetType.isShowWorkLocation}'
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
                                    hidden : '{availableAssignments.count <= 1 && !timesheetVertical.timesheetType.isShowAssignment}'
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
                xtype : 'container',
                layout : 'fit',
                reference : 'timesheetVerticalDetailForm',
                hidden : true,
                height : '100%',

                items : [
                    // dynamic
                ]
            }

        ]
    };
});

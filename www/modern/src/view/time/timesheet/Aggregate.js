Ext.define('ess.view.time.timesheet.Aggregate', function() {

    return {

        alias : 'widget.ess_modern_time_timesheet_aggregate',

        extend : 'Ext.container.Container',

        requires : [
            'criterion.vm.timesheet.Aggregate',
            'ess.controller.time.timesheet.Aggregate',
            'ess.view.time.timesheet.aggregate.Form',
            'ess.view.time.timesheet.TotalBarAggregate'
        ],

        cls : 'ess-timesheet-detail',

        layout : 'card',

        viewModel : {
            type : 'criterion_timesheet_aggregate',

            formulas : {
                isEditable : function(data) {
                    return data('timesheetRecord.notSubmittedOrRejected');
                },

                getNotesIcon : function(get) {
                    return Ext.isEmpty(get('timesheetRecord.notes')) ? 'md-icon-chat-bubble' : 'md-icon-chat';
                },

                hideSubmit : function(data) {
                    return !data('timesheetRecord.notSubmittedOrRejected');
                },

                totalHours : {
                    bind : {
                        bindTo : '{timesheetRecord}',
                        deep : true
                    },
                    get : function(timesheetRecord) {
                        var total = timesheetRecord && timesheetRecord.getTotals && timesheetRecord.getTotals();

                        return (total && total.get('regular')) || 0;
                    }
                },
                totalFTE : {
                    bind : {
                        bindTo : '{timesheetRecord}',
                        deep : true
                    },
                    get : function(timesheetRecord) {
                        var timesheetTasks = timesheetRecord && timesheetRecord.timesheetTasks();

                        return (timesheetTasks && timesheetTasks.sum('fte')) || 0;
                    }
                }
            }
        },

        controller : {
            type : 'ess_modern_time_timesheet_aggregate'
        },

        items : [
            {
                xtype : 'container',
                height : '100%',
                reference : 'timesheetTasksGridWrapper',

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
                                iconCls : 'md-icon-add',
                                bind : {
                                    hidden : '{!isEditable}'
                                },
                                handler : 'handleAddTimesheetTask'
                            },
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
                        xtype : 'ess_modern_time_timesheet_total_bar_aggregate',
                        totalInFloat : true,
                        bind : {
                            startDate : '{timesheetRecord.startDate:date("m/d/Y")}',
                            endDate : '{timesheetRecord.endDate:date("m/d/Y")}',
                            totalHours : '{totalHours}',
                            totalFTE : '{totalFTE}'
                        }
                    },

                    {
                        xtype : 'criterion_grid',
                        reference : 'timesheetTasksGrid',
                        bind : {
                            store : '{timesheetTasks}'
                        },

                        listeners : {
                            scope : 'controller',
                            painted : 'handleActivate',
                            itemtap : 'handleEditTimesheetTask'
                        },

                        height : '100%',
                        flex : 1,

                        columns : [
                            {
                                text : i18n.gettext('Paycode'),
                                dataIndex : 'paycodeDetail',
                                flex : 1,
                                minWidth : 150,
                                renderer : function(value) {
                                    return Ext.isObject(value) ? value.name : '';
                                }
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
                                text : 'Task',
                                dataIndex : 'taskId',
                                flex : 1,
                                minWidth : 150,
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
                                flex : 1,
                                minWidth : 150,
                                hidden : true,
                                cell : {
                                    xtype : 'storevalue',
                                    valueField : 'assignmentId',
                                    fieldName : 'title',
                                    bind : {
                                        store : '{availableAssignments}'
                                    }
                                },
                                bind : {
                                    hidden : '{availableAssignments.count <= 1 && !timesheetRecord.timesheetType.isShowAssignment}'
                                }
                            },

                            {
                                text : i18n.gettext('FTE'),
                                dataIndex : 'fte',
                                minWidth : 120,
                                flex : 1
                            },
                            {
                                text : i18n.gettext('Hours'),
                                dataIndex : 'totalHours',
                                minWidth : 120,
                                flex : 1
                            }
                        ],

                        changeVisibilityColumns : function(hideLocation, hidePosition, hideTask) {
                            var me = this,
                                columns = me.getColumns();

                            Ext.Array.each(columns, function(column) {
                                var dataIndex = column.getDataIndex();

                                if (dataIndex === 'employerWorkLocationId') {
                                    column[hideLocation ? 'hide' : 'show']();
                                }

                                if (dataIndex === 'assignmentId') {
                                    column[hidePosition ? 'hide' : 'show']();
                                }

                                if (dataIndex === 'taskId') {
                                    column[hideTask ? 'hide' : 'show']();
                                }
                            })
                        }
                    }
                ]
            },

            // form
            {
                xtype : 'criterion_time_timesheet_aggregate_form',
                hidden : true,

                listeners : {
                    close : 'handleTimesheetTaskModificateFinish',
                    save : function() {
                        criterion.Utils.toast(i18n.gettext('Timesheet Saved.'));
                    }
                }
            }
        ]

    }
});

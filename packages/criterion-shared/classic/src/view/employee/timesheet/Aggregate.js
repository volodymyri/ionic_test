Ext.define('criterion.view.employee.timesheet.Aggregate', function() {

    function applySizeBinding(col, binding, widthDelta) {
        var sizeBinding = {};

        widthDelta = widthDelta || 0;

        sizeBinding['width'] = Ext.String.format('{sizes.{0}.width + {1}}', col, widthDelta);
        sizeBinding['flex'] = Ext.String.format('{sizes.{0}.flex}', col);

        return Ext.apply(sizeBinding, binding || {})
    }

    return {

        extend : 'criterion.ux.Panel',

        requires : [
            'criterion.controller.employee.timesheet.Aggregate',
            'criterion.vm.timesheet.Aggregate',
            'criterion.view.employee.timesheet.aggregate.Task',
            'criterion.view.employee.timesheet.aggregate.TaskFTEHours',
            'criterion.view.employee.timesheet.toolbar.Employee',
            'criterion.view.employee.timesheet.dashboard.Options'
        ],

        alias : 'widget.criterion_employee_timesheet_aggregate',

        statics : {
            applySizeBinding : applySizeBinding
        },

        cls : 'criterion-ess-panel',

        /**
         * migrated config
         */
        viewDetailOnly : false,

        viewModel : {
            type : 'criterion_timesheet_aggregate',
            data : {
                sizes : {
                    actionCol : {
                        width : 10
                    },
                    paycodeCol : {
                        width : 200
                    },
                    taskCol : {
                        width : 200
                    },
                    projectCol : {
                        width : 150
                    },
                    locationCol : {
                        width : 200
                    },
                    areaCol : {
                        width : 200
                    },
                    assignmentCol : {
                        width : 200
                    },
                    customCol : {
                        width : 200
                    },
                    fteCol : {
                        width : 90
                    },
                    hoursCol : {
                        width : 90
                    }
                },
                blockedState : false
            }
        },

        controller : {
            type : 'criterion_employee_timesheet_aggregate'
        },

        listeners : {
            afterrender : 'onAfterRenderTimesheet'
        },

        disableAutoSetLoadingState : true,

        frame : true,

        scrollable : false,

        header : {
            title : {
                tooltipEnabled : true,
                minWidth : 220,
                bind : {
                    text : '{timesheetRecord.startDate:date} &mdash; {timesheetRecord.endDate:date}',
                    tooltip : '{timesheetRecord.timezoneDesc}'
                }
            },

            items : [
                {
                    xtype : 'tbfill'
                },
                {
                    cls : 'criterion-btn-transparent',
                    glyph : criterion.consts.Glyph['arrow-left-a'],
                    scale : 'medium',
                    margin : '0 10 0 0',
                    hidden : true,
                    bind : {
                        hidden : '{!managerMode || timesheetNeighborsIsEmpty}'
                    },
                    tooltip : i18n.gettext('Prev'),
                    listeners : {
                        click : 'handlePrev'
                    }
                },
                {
                    xtype : 'component',
                    cls : 'criterion-team-member-name',
                    hidden : true,
                    bind : {
                        html : '{timesheetRecord.personName} ({timesheetRecord.assignmentTitle})',
                        hidden : '{!managerMode || isOwnTimesheet || !timesheetNeighborsIsEmpty}'
                    }
                },
                {
                    xtype : 'combobox',
                    reference : 'teamMember',
                    cls : 'criterion-team-member-name',
                    grow : true,
                    growToLongestValue : true,
                    bind : {
                        store : '{timesheetNeighbors}',
                        value : '{timesheetId}',
                        hidden : '{!managerMode || timesheetNeighborsIsEmpty}'
                    },
                    hidden : true,
                    queryMode : 'local',
                    editable : true,
                    valueField : 'timesheetId',
                    displayField : 'displayedValue',
                    tpl : Ext.create('Ext.XTemplate',
                        '<ul class="x-list-plain"><tpl for=".">',
                        '<li role="option" class="x-boundlist-item">{personName} ({assignmentTitle}) [{startDate:date} - {endDate:date}]</li>',
                        '</tpl></ul>'),
                    listeners : {
                        change : 'handleTimesheetChange'
                    }
                },
                {
                    cls : 'criterion-btn-transparent',
                    glyph : criterion.consts.Glyph['arrow-right-a'],
                    scale : 'medium',
                    margin : '0 0 0 10',
                    hidden : true,
                    bind : {
                        hidden : '{!managerMode || timesheetNeighborsIsEmpty}'
                    },
                    tooltip : i18n.gettext('Next'),
                    listeners : {
                        click : 'handleNext'
                    }
                },
                {
                    xtype : 'tbspacer'
                },
                {
                    xtype : 'button',
                    glyph : criterion.consts.Glyph['sli-list'],
                    ui : 'glyph',
                    handler : 'onShowOptions',
                    hidden : true,
                    bind : {
                        hidden : '{!managerMode || isOwnTimesheet}',
                        tooltip : '{optionsTooltip}'
                    },
                    listeners : {
                        afterRender : 'onAfterRenderOptionsButton'
                    }
                },
                {
                    xtype : 'tbfill'
                },
                {
                    xtype : 'button',
                    glyph : criterion.consts.Glyph['chatbox'],
                    tooltip : i18n.gettext('Notes'),
                    ui : 'glyph',
                    handler : 'onShowNotes',
                    bind : {
                        glyph : '{getNotesIcon}',
                        disabled : '{blockedState}'
                    }
                },
                {
                    xtype : 'tbspacer'
                },
                {
                    xtype : 'button',
                    bind : {
                        hidden : '{!isEditable}',
                        disabled : '{blockedState}'
                    },
                    ui : 'feature',
                    text : i18n.gettext('Add'),
                    handler : 'onAddTask',
                    itemId : 'btnAddTask'
                }
            ]
        },

        dockedItems : [
            {
                xtype : 'toolbar',
                dock : 'bottom',
                bind : {
                    hidden : '{viewDetailOnly}'
                },
                padding : '15 0',
                items : [
                    {
                        xtype : 'button',
                        text : i18n.gettext('Submit Timesheet'),
                        listeners : {
                            click : 'onSubmitTimesheet'
                        },
                        hidden : true,
                        bind : {
                            hidden : '{!showSubmitTimesheet}',
                            disabled : '{blockedState}'
                        }
                    },
                    {
                        xtype : 'button',
                        text : i18n.gettext('Recall'),
                        ui : 'remove',
                        handler : 'handleRecallRequest',
                        hidden : true,
                        bind : {
                            hidden : '{!allowRecallBtn}',
                            disabled : '{blockedState}'
                        }
                    },
                    '->',
                    {
                        xtype : 'button',
                        ui : 'light',
                        listeners : {
                            click : 'onCancel'
                        },
                        text : i18n.gettext('Cancel'),
                        bind : {
                            text : '{cancelBtnText}'
                        }
                    },
                    {
                        xtype : 'criterion_splitbutton',
                        width : 150,
                        text : i18n.gettext('Save'),
                        listeners : {
                            click : 'onSave'
                        },
                        hidden : true,
                        bind : {
                            hidden : '{!isEditable}',
                            disabled : '{blockedState}'
                        },
                        itemId : 'btnSave',
                        menuCls : 'ess-feature',
                        menu : [
                            {
                                text : i18n.gettext('Save & Close'),
                                handler : 'handleSaveAndClose'
                            }
                        ]
                    }
                ]
            }
        ],

        layout : 'fit',

        items : [
            {
                xtype : 'container',

                layout : {
                    type : 'hbox',
                    align : 'stretch'
                },

                width : '100%',

                items : [
                    {
                        xtype : 'container',

                        layout : 'vbox',

                        height : '100%',

                        reference : 'tasksContainerWrap',

                        flex : 1,

                        listeners : {
                            resize : 'onTasksContainerWrapResize'
                        },

                        items : [
                            {
                                xtype : 'container',

                                reference : 'timesheetHeader',

                                hidden : true,

                                layout : 'hbox',

                                defaultType : 'component',

                                width : 1, //Will be set later

                                cls : 'timesheet-header x-grid-header-ct aggregate',

                                defaults : {
                                    margin : '2 0 2 10',
                                    cls : 'x-column-header',
                                    resizable : Ext.isIE ? false : {
                                        handles : 'e',
                                        listeners : {
                                            resize : function(resizer, width) {
                                                var vm = this.target.lookupViewModel(),
                                                    tasksContainer = this.target.up('criterion_employee_timesheet_aggregate').lookup('tasksContainer');

                                                vm.set(resizer.target.bind.width.tokens[0], width);

                                                Ext.defer(function() {
                                                    tasksContainer.fireEvent('resize', tasksContainer, tasksContainer.getWidth());
                                                }, 20);
                                            }
                                        }
                                    }
                                },

                                items : [
                                    {
                                        bind : applySizeBinding('actionCol', {
                                            hidden : '{isEditable}'
                                        }),
                                        resizable : false,
                                        cls : 'no-border-line'
                                    },
                                    {
                                        bind : applySizeBinding('actionCol', {
                                            hidden : '{!isEditable}'
                                        }),
                                        resizable : false,
                                        cls : 'no-border-line'
                                    },
                                    {
                                        html : i18n.gettext('Paycode'),
                                        bind : applySizeBinding('paycodeCol')
                                    },
                                    {
                                        html : i18n.gettext('Location'),
                                        bind : applySizeBinding('locationCol', {
                                            hidden : '{!hasMultiLocations && !timesheetRecord.timesheetType.isShowWorkLocation}',
                                            html : '{timesheetRecord.timesheetType.labelWorkLocation || "' + i18n.gettext('Location') + '"}'
                                        }),
                                        hidden : true
                                    },
                                    {
                                        bind : applySizeBinding('areaCol', {
                                            hidden : '{!timesheetRecord.timesheetType.isShowWorkArea}',
                                            html : '{timesheetRecord.timesheetType.labelWorkArea || "' + i18n.gettext('Area') + '"}'
                                        }),
                                        hidden : true
                                    },
                                    {
                                        html : i18n.gettext('Project'),
                                        bind : applySizeBinding('projectCol', {
                                            hidden : '{!timesheetRecord.timesheetType.isShowProject}',
                                            html : '{timesheetRecord.timesheetType.labelProject || "' + i18n.gettext('Project') + '"}'
                                        }),
                                        hidden : true
                                    },
                                    {
                                        html : i18n.gettext('Task'),
                                        bind : applySizeBinding('taskCol', {
                                            hidden : '{!timesheetRecord.timesheetType.isShowTasks}',
                                            html : '{timesheetRecord.timesheetType.labelTask || "' + i18n.gettext('Task') + '"}'
                                        }),
                                        hidden : true
                                    },
                                    {
                                        html : i18n.gettext('Assignment'),
                                        bind : applySizeBinding('assignmentCol', {
                                            hidden : '{!hasMultiAssignments && !timesheetRecord.timesheetType.isShowAssignment}',
                                            html : '{timesheetRecord.timesheetType.labelAssignment || "' + i18n.gettext('Title') + '"}'
                                        }),
                                        hidden : true
                                    },
                                    {
                                        bind : applySizeBinding('customCol', {
                                            html : Ext.String.format('{customField{0}Title}', 1),
                                            hidden : Ext.String.format('{!customField{0}Title}', 1)
                                        }),
                                        hidden : true
                                    },
                                    {
                                        bind : applySizeBinding('customCol', {
                                            html : Ext.String.format('{customField{0}Title}', 2),
                                            hidden : Ext.String.format('{!customField{0}Title}', 2)
                                        }),
                                        hidden : true
                                    },
                                    {
                                        bind : applySizeBinding('customCol', {
                                            html : Ext.String.format('{customField{0}Title}', 3),
                                            hidden : Ext.String.format('{!customField{0}Title}', 3)
                                        }),
                                        hidden : true
                                    },
                                    {
                                        bind : applySizeBinding('customCol', {
                                            html : Ext.String.format('{customField{0}Title}', 4),
                                            hidden : Ext.String.format('{!customField{0}Title}', 4)
                                        }),
                                        hidden : true
                                    }
                                ]
                            },
                            {
                                xtype : 'container',

                                layout : 'vbox',

                                reference : 'tasksContainer',

                                flex : 1,

                                width : '100%',

                                height : '100%',

                                scrollable : true,

                                detectTaskChanges : false,

                                cls : 'tasks-container aggregate-top-shadow',

                                items : [
                                    // task details
                                ]
                            },
                            {
                                xtype : 'container',

                                layout : 'vbox',

                                height : 60,

                                width : '100%',

                                cls : 'totals-info',

                                items : [
                                    {
                                        xtype : 'container',

                                        layout : 'hbox',

                                        margin : '5 0 0 20',

                                        items : [
                                            {
                                                xtype : 'component',
                                                hidden : true,
                                                bind : {
                                                    html : i18n.gettext('Total FTE') + ': <span>{totalFTE:employerAmountPrecision}</span>',
                                                    hidden : '{!isFTE}'
                                                },
                                                cls : 'total-hours'
                                            },
                                            {
                                                xtype : 'tbspacer',
                                                bind : {
                                                    hidden : '{!isFTE}'
                                                }
                                            },
                                            {
                                                xtype : 'component',
                                                bind : {
                                                    html : i18n.gettext('Total Hours') + ': <span>{timesheetRecord.totals.regular:employerAmountPrecision}</span>'
                                                },
                                                cls : 'total-hours'
                                            },
                                            {
                                                xtype : 'tbspacer'
                                            },
                                            {
                                                xtype : 'component',
                                                bind : {
                                                    html : i18n.gettext('Time Off') + ': <span>{totalTimeOffs}</span> ' + i18n.gettext('day(s)')
                                                },
                                                cls : 'total-hours'
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        xtype : 'container',

                        layout : 'vbox',

                        height : '100%',

                        items : [
                            {
                                xtype : 'container',

                                reference : 'timesheetFTEHoursHeader',

                                hidden : true,

                                dock : 'top',

                                layout : 'hbox',

                                defaultType : 'component',

                                cls : 'timesheet-header x-grid-header-ct',

                                defaults : {
                                    margin : '2 0 0 10',
                                    cls : 'x-column-header'
                                },

                                items : [
                                    {
                                        html : i18n.gettext('FTE'),
                                        bind : applySizeBinding('fteCol', {
                                            hidden : '{!isFTE}'
                                        }),
                                        hidden : true
                                    },
                                    {
                                        html : i18n.gettext('Hours'),
                                        bind : applySizeBinding('hoursCol')
                                    },
                                    {
                                        bind : applySizeBinding('actionCol'),
                                        cls : 'no-border-line'
                                    }
                                ]
                            },
                            {
                                xtype : 'container',

                                layout : 'vbox',

                                reference : 'tasksFTEHours',

                                flex : 1,

                                margin : '2 0 0 0',

                                width : '100%',

                                scrollable : 'vertical',

                                cls : 'tasks-fte-hours-container hide-overflow-x aggregate-top-shadow',

                                items : [
                                    // task fte/hours details
                                ]
                            }, {
                                xtype : 'component',

                                height : 60,

                                width : '100%',

                                cls : 'totals-container'
                            }
                        ]
                    }
                ]
            }
        ],

        loadRecord : function() {
            var me = this;

            Ext.defer(function() {
                !me.destroyed && me.getController().load();
            }, 100);
        }
    }
});

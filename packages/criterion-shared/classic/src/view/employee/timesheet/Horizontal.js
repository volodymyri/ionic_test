Ext.define('criterion.view.employee.timesheet.Horizontal', function() {

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
            'criterion.controller.employee.timesheet.Horizontal',
            'criterion.vm.timesheet.Horizontal',
            'criterion.view.employee.timesheet.horizontal.Task',
            'criterion.view.employee.timesheet.horizontal.Dates',
            'criterion.view.employee.timesheet.horizontal.Totals',
            'criterion.view.employee.timesheet.dashboard.Options'
        ],

        alias : 'widget.criterion_employee_timesheet_horizontal',

        statics : {
            applySizeBinding : applySizeBinding
        },

        cls : 'criterion-ess-panel',

        /**
         * migrated config
         */
        viewDetailOnly : false,

        viewModel : {
            type : 'criterion_timesheet_horizontal',
            data : {
                showTotals : false,
                sizes : {
                    actionCol : {
                        width : 10
                    },
                    paycodeCol : {
                        width : 150
                    },
                    taskCol : {
                        width : 150
                    },
                    projectCol : {
                        width : 150
                    },
                    locationCol : {
                        width : 150
                    },
                    areaCol : {
                        width : 150
                    },
                    assignmentCol : {
                        width : 150
                    },
                    customCol1 : {
                        width : 150
                    },
                    customCol2 : {
                        width : 150
                    },
                    customCol3 : {
                        width : 150
                    },
                    customCol4 : {
                        width : 150
                    },
                    dateCol : {
                        width : 140
                    }
                },
                blockedState : false
            }
        },

        controller : {
            type : 'criterion_employee_timesheet_horizontal'
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
                    hidden : true,
                    bind : {
                        store : '{timesheetNeighbors}',
                        value : '{timesheetId}',
                        hidden : '{!managerMode || timesheetNeighborsIsEmpty}'
                    },
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

                    ui : 'glyph',

                    enableToggle : true,

                    glyph : criterion.consts.Glyph['stats-bars'],

                    tooltip : i18n.gettext('Details'),

                    toggleHandler : 'onToggleDetails',

                    reference : 'detailsToggle'
                },
                {
                    xtype : 'tbspacer'
                },
                {
                    xtype : 'button',
                    ui : 'secondary',
                    text : i18n.gettext('Summary'),
                    handler : 'onShowSummary'
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
                            text : '{cancelBtnText}',
                            disabled : '{blockedState}'
                        }
                    },
                    {
                        xtype : 'criterion_splitbutton',
                        width : 150,
                        text : i18n.gettext('Save'),
                        handler : 'onSave',
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

                reference : 'timesheetContainer',

                layout : 'hbox',

                items : [
                    {
                        xtype : 'container',

                        layout : 'vbox',

                        height : '100%',

                        flex : 2,

                        items : [
                            {
                                xtype : 'container',

                                layout : 'hbox',

                                reference : 'tasksLabels',

                                scrollable : 'horizontal',

                                height : 45,

                                width : '100%',

                                cls : 'timesheet-header x-grid-header-ct hide-overflow',

                                defaultType : 'component',

                                defaults : {
                                    margin : '2 0 0 10',
                                    cls : 'x-column-header',
                                    resizable : Ext.isIE ? false : {
                                        handles : 'e',
                                        listeners : {
                                            resize : function(resizer, width) {
                                                var vm = this.target.lookupViewModel();

                                                vm.set(resizer.target.bind.width.tokens[0], width);
                                            }
                                        }
                                    }
                                },

                                items : [
                                    {
                                        bind : applySizeBinding('actionCol', {
                                            hidden : '{!isEditable}'
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
                                        bind : applySizeBinding('customCol1', {
                                            html : Ext.String.format('{customField{0}Title}', 1),
                                            hidden : Ext.String.format('{!customField{0}Title}', 1)
                                        }),
                                        hidden : true
                                    },
                                    {
                                        bind : applySizeBinding('customCol2', {
                                            html : Ext.String.format('{customField{0}Title}', 2),
                                            hidden : Ext.String.format('{!customField{0}Title}', 2)
                                        }),
                                        hidden : true
                                    },
                                    {
                                        bind : applySizeBinding('customCol3', {
                                            html : Ext.String.format('{customField{0}Title}', 3),
                                            hidden : Ext.String.format('{!customField{0}Title}', 3)
                                        }),
                                        hidden : true
                                    },
                                    {
                                        bind : applySizeBinding('customCol4', {
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

                                reference : 'tasksContainerWrap',

                                flex : 1,

                                width : '100%',

                                items : [
                                    {
                                        xtype : 'container',

                                        reference : 'tasksContainer',

                                        scrollable : true,

                                        height : '100%',

                                        cls : 'tasks-container',

                                        detectTaskChanges : false,

                                        items : [
                                            // task details
                                        ]
                                    }
                                ],

                                listeners : {
                                    afterlayout : 'onTasksContainerWrapUpdateLayout'
                                }
                            },
                            {
                                xtype : 'container',

                                layout : {
                                    type : 'hbox',
                                    align : 'center'
                                },

                                width : '100%',

                                bind : {
                                    height : '{!showTotals ? 60 : 118}'
                                },

                                cls : 'totals-info',

                                items : [
                                    {
                                        xtype : 'container',
                                        layout : 'vbox',
                                        bind : applySizeBinding('paycodeCol', {}, 10),

                                        margin : '0 0 0 20',

                                        items : [
                                            {
                                                xtype : 'component',
                                                bind : {
                                                    html : '{totalLabel}: <span>{totalValue}</span>'
                                                },
                                                cls : 'total-hours'
                                            },
                                            {
                                                xtype : 'component',
                                                bind : {
                                                    html : i18n.gettext('Regular Income') + ': <span>{regularValue}</span>',
                                                    hidden : '{!showTotals}'
                                                },
                                                cls : 'totals-details'
                                            },
                                            {
                                                xtype : 'component',
                                                bind : {
                                                    html : i18n.gettext('Overtime') + ': <span>{overtimeValue}</span>',
                                                    hidden : '{!showTotals}'
                                                },
                                                cls : 'totals-details'
                                            }
                                        ]
                                    },
                                    {
                                        bind : applySizeBinding('taskCol', {
                                            hidden : '{!timesheetRecord.timesheetType.isShowTasks}'
                                        }),
                                        margin : '2 0 0 10'
                                    },
                                    {
                                        bind : applySizeBinding('locationCol', {
                                            hidden : '{!hasMultiLocations && !timesheetRecord.timesheetType.isShowWorkLocation}'
                                        }),
                                        margin : '2 0 0 10'
                                    },
                                    {
                                        bind : applySizeBinding('areaCol', {
                                            hidden : '{!timesheetRecord.timesheetType.isShowWorkArea}'
                                        }),
                                        margin : '2 0 0 10'
                                    },
                                    {
                                        bind : applySizeBinding('assignmentCol', {
                                            hidden : '{!hasMultiAssignments && !timesheetRecord.timesheetType.isShowAssignment}'
                                        }),
                                        margin : '2 0 0 10'
                                    },
                                    {
                                        bind : applySizeBinding('customCol1', {
                                            hidden : Ext.String.format('{!customField{0}Title}', 1)
                                        }),
                                        margin : '2 0 0 10'
                                    },
                                    {
                                        bind : applySizeBinding('customCol2', {
                                            hidden : Ext.String.format('{!customField{0}Title}', 2)
                                        }),
                                        margin : '2 0 0 10'
                                    },
                                    {
                                        bind : applySizeBinding('customCol3', {
                                            hidden : Ext.String.format('{!customField{0}Title}', 3)
                                        }),
                                        margin : '2 0 0 10'
                                    },
                                    {
                                        bind : applySizeBinding('customCol4', {
                                            hidden : Ext.String.format('{!customField{0}Title}', 4)
                                        }),
                                        margin : '2 0 0 10'
                                    },
                                    {
                                        bind : applySizeBinding('actionCol')
                                    },
                                    {
                                        bind : applySizeBinding('actionCol')
                                    }
                                ]
                            }

                        ]
                    },

                    {
                        xtype : 'panel',

                        reference : 'datesContainerWrap',

                        scrollable : false,

                        height : '100%',

                        width : 500,
                        minWidth : 500,

                        cls : 'no-padding-tbar horizontal-dates',

                        tbar : [
                            {
                                xtype : 'container',

                                reference : 'datesLabels',

                                width : '100%',

                                scrollable : 'horizontal',

                                layout : 'hbox',

                                defaultType : 'component',

                                height : 45,

                                cls : 'timesheet-header x-grid-header-ct hide-overflow',

                                defaults : {
                                    margin : '2 0 0 10',
                                    cls : 'x-column-header'
                                },

                                items : [
                                    // date labels
                                ]
                            }
                        ],

                        items : [
                            {
                                xtype : 'container',

                                reference : 'datesContainer',

                                layout : 'vbox',

                                scrollable : true,

                                cls : 'dates-container',

                                items : [
                                    // dates
                                ],

                                listeners : {
                                    add : 'onDatesContainerAdd'
                                }
                            }
                        ],

                        bbar : [
                            {
                                reference : 'totalsContainer',

                                xtype : 'criterion_employee_timesheet_horizontal_totals',

                                bind : {
                                    height : '{!showTotals ? 60 : 118}'
                                },

                                scrollable : 'horizontal',

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

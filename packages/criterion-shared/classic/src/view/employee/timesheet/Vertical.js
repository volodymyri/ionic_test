Ext.define('criterion.view.employee.timesheet.Vertical', function() {

    function applySizeBinding(col, binding, widthDelta) {
        let sizeBinding = {};

        widthDelta = widthDelta || 0;

        sizeBinding['width'] = Ext.String.format('{sizes.{0}.width + {1}}', col, widthDelta);

        return Ext.apply(sizeBinding, binding || {})
    }

    return {

        extend : 'criterion.ux.form.Panel',

        requires : [
            'Ext.layout.container.Center',
            'criterion.vm.timesheet.Vertical',
            'criterion.controller.employee.timesheet.Vertical',
            'criterion.view.employee.timesheet.vertical.Day',
            'criterion.model.employee.timesheet.Vertical',
            'criterion.model.employee.timesheet.VerticalForSave',
            'criterion.view.employee.timesheet.toolbar.Employee',
            'criterion.data.field.TimeZone',
            'criterion.view.employee.timesheet.dashboard.Options'
        ],

        alias : 'widget.criterion_employee_timesheet_vertical',

        statics : {
            applySizeBinding : applySizeBinding
        },

        cls : 'criterion-ess-panel withoutbord',

        modelValidation : true,

        viewModel : {
            type : 'criterion_timesheet_vertical',
            data : {
                /**
                 * True for timesheet approval view.
                 */
                viewDetailOnly : false,

                sizes : {
                    actionCol : {
                        width : 25
                    },
                    dateCol : {
                        width : 70
                    },
                    markerCol : {
                        width : 40
                    },
                    paycodeCol : {
                        width : 200
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
                    inCol : {
                        width : 120
                    },
                    outCol : {
                        width : 120
                    },
                    hoursCol : {
                        width : 80
                    },
                    daysCol : {
                        width : 80
                    },
                    totalHoursCol : {
                        width : 80
                    },
                    totalDaysCol : {
                        width : 80
                    },
                    regIncomeHoursCol : {
                        width : 80
                    },
                    regIncomeDaysCol : {
                        width : 80
                    },
                    overtimeCol : {
                        width : 80
                    },
                    autoBreaksCol : {
                        width : 100
                    },
                    splitCol : {
                        width : 25
                    },
                    fillUXCol : {
                        width : 0
                    }
                },
                managerMode : false,
                blockedState : false
            }
        },

        controller : {
            type : 'criterion_employee_timesheet_vertical'
        },

        listeners : {
            afterrender : 'onAfterRenderTimesheet',
            resizeEmptySpace : 'onResizeEmptySpace'
        },

        disableAutoSetLoadingState : true,

        frame : true,
        bodyPadding : 0,

        header : {
            title : {
                tooltipEnabled : true,
                minWidth : 220,
                minimizeWidth : true,
                bind : {
                    text : '{timesheetVertical.startDate:date} &mdash; {timesheetVertical.endDate:date}',
                    tooltip : '{timesheetVertical.timezoneDesc}'
                }
            },

            items : [
                {
                    xtype : 'combobox',
                    width : 320,
                    reference : 'weekSelector',
                    hidden : true,
                    editable : false,
                    queryMode : 'local',
                    valueField : 'number',
                    displayField : 'title',
                    forceSelection : true,
                    bind : {
                        hidden : '{!allowWeekSelector}',
                        store : '{timesheetWeeks}'
                    },
                    listeners : {
                        change : 'handleWeekChange'
                    }
                },
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
                        html : '{timesheetVertical.personName} ({timesheetVertical.assignmentTitle})',
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
                    enableToggle : true,
                    glyph : criterion.consts.Glyph['stats-bars'],
                    ui : 'glyph',
                    toggleHandler : 'onToggleDetails'
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
                        text : '{inOutText}',
                        hidden : '{!showInOut}',
                        disabled : '{disableInOut || blockedState}',
                        userCls : '{inOutCls}'
                    },
                    ui : 'feature',
                    handler : 'onInOutClick'
                }
            ]
        },

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        dockedItems : [
            {
                xtype : 'container',
                dock : 'top',
                layout : 'hbox',
                defaultType : 'component',
                cls : 'timesheet-header x-grid-header-ct',
                height : 45,
                padding : '0 1 0',
                width : '100%',
                defaults : {
                    layout : 'hbox',
                    defaultType : 'component',
                    defaults : {
                        margin : '2 0 0 10',
                        cls : 'x-column-header',
                        resizable : Ext.isIE ? false : {
                            handles : 'e',
                            listeners : {
                                resize : function(resizer, width) {
                                    let parent = this.target.up('criterion_employee_timesheet_vertical'),
                                        vm = this.target.lookupViewModel(),
                                        token = resizer.target.bind.width.tokens[0],
                                        prevValue = vm.get(token);

                                    vm.set(
                                        'sizes.fillUXCol.width',
                                        vm.get('sizes.fillUXCol.width') - (width - prevValue)
                                    );

                                    vm.set(token, width);

                                    parent.fireEvent('resizeEmptySpace')
                                }
                            }
                        }
                    }
                },
                items : [
                    {
                        xtype : 'container',
                        scrollable : 'x',
                        cls : 'hide-overflow',
                        reference : 'fieldColContainer',
                        flex : 1,
                        items : [
                            {
                                bind : applySizeBinding('actionCol'),
                                width : 25,
                                resizable : false,
                                cls : 'no-border-line'
                            },
                            {
                                bind : applySizeBinding('dateCol'),
                                width : 70,
                                html : i18n.gettext('Date'),
                                resizable : false,
                                cls : 'no-border-line x-column-header'
                            },
                            {
                                bind : applySizeBinding('markerCol', {
                                    hidden : '{!isWorkflowView && !managerMode}'
                                }),
                                width : 20,
                                hidden : true,
                                resizable : false,
                                cls : 'no-border-line'
                            },
                            {
                                bind : applySizeBinding('actionCol'),
                                width : 25,
                                resizable : false,
                                cls : 'no-border-line'
                            },
                            {
                                html : i18n.gettext('Paycode'),
                                bind : applySizeBinding('paycodeCol'),
                                width : 200,
                                refWid : 'paycodeCol'
                            },
                            {
                                html : i18n.gettext('Location'),
                                bind : applySizeBinding('locationCol', {
                                    hidden : '{!hasMultiLocations && !timesheetVertical.timesheetType.isShowWorkLocation}',
                                    html : '{timesheetVertical.timesheetType.labelWorkLocation || "' + i18n.gettext('Location') + '"}'
                                }),
                                width : 150,
                                hidden : true,
                                refWid : 'locationCol'
                            },
                            {
                                bind : applySizeBinding('areaCol', {
                                    hidden : '{!timesheetVertical.timesheetType.isShowWorkArea}',
                                    html : '{timesheetVertical.timesheetType.labelWorkArea || "' + i18n.gettext('Area') + '"}'
                                }),
                                hidden : true,
                                refWid : 'areaCol'
                            },
                            {
                                html : i18n.gettext('Project'),
                                bind : applySizeBinding('projectCol', {
                                    hidden : '{!timesheetVertical.timesheetType.isShowProject}',
                                    html : '{timesheetVertical.timesheetType.labelProject || "' + i18n.gettext('Project') + '"}'
                                }),
                                width : 150,
                                hidden : true,
                                refWid : 'projectCol'
                            },
                            {
                                html : i18n.gettext('Task'),
                                bind : applySizeBinding('taskCol', {
                                    hidden : '{!timesheetVertical.timesheetType.isShowTasks}',
                                    html : '{timesheetVertical.timesheetType.labelTask || "' + i18n.gettext('Task') + '"}'
                                }),
                                width : 150,
                                hidden : true,
                                refWid : 'taskCol'
                            },
                            {
                                html : i18n.gettext('Assignment'),
                                bind : applySizeBinding('assignmentCol', {
                                    hidden : '{!hasMultiAssignments && !timesheetVertical.timesheetType.isShowAssignment}',
                                    html : '{timesheetVertical.timesheetType.labelAssignment || "' + i18n.gettext('Title') + '"}'
                                }),
                                width : 150,
                                hidden : true,
                                refWid : 'assignmentCol'
                            },
                            {
                                reference : 'customCol1',
                                html : '',
                                bind : applySizeBinding('customCol1', {
                                    html : Ext.String.format('{customField{0}Title}', 1),
                                    hidden : Ext.String.format('{!customField{0}Title}', 1)
                                }),
                                width : 150,
                                hidden : true,
                                refWid : 'customCol1'
                            },
                            {
                                reference : 'customCol2',
                                html : '',
                                bind : applySizeBinding('customCol2', {
                                    html : Ext.String.format('{customField{0}Title}', 2),
                                    hidden : Ext.String.format('{!customField{0}Title}', 2)
                                }),
                                width : 150,
                                hidden : true,
                                refWid : 'customCol2'
                            },
                            {
                                reference : 'customCol3',
                                html : '',
                                bind : applySizeBinding('customCol3', {
                                    html : Ext.String.format('{customField{0}Title}', 3),
                                    hidden : Ext.String.format('{!customField{0}Title}', 3)
                                }),
                                width : 150,
                                hidden : true,
                                refWid : 'customCol3'
                            },
                            {
                                reference : 'customCol4',
                                html : '',
                                bind : applySizeBinding('customCol4', {
                                    html : Ext.String.format('{customField{0}Title}', 4),
                                    hidden : Ext.String.format('{!customField{0}Title}', 4)
                                }),
                                width : 150,
                                hidden : true,
                                refWid : 'customCol4'
                            },
                            {
                                html : i18n.gettext('In'),
                                resizable : false,
                                width : 120,
                                bind : applySizeBinding('inCol', {
                                    hidden : '{!showInOutCol}'
                                })
                            },
                            {
                                html : i18n.gettext('Out'),
                                resizable : false,
                                width : 120,
                                bind : applySizeBinding('outCol', {
                                    hidden : '{!showInOutCol}'
                                })
                            },
                            {
                                html : i18n.gettext('Days'),
                                hidden : true,
                                resizable : false,
                                width : 80,
                                bind : applySizeBinding('daysCol', {
                                    hidden : '{!isManualDay}'
                                })
                            },
                            {
                                html : i18n.gettext('Hrs./Items'),
                                resizable : false,
                                width : 80,
                                cls : 'no-border-line x-column-header',
                                bind : applySizeBinding('hoursCol', {
                                    hidden : '{isManualDay}'
                                })
                            },
                            {
                                html : '',
                                hidden : true,
                                resizable : false,
                                width : 25,
                                cls : 'no-border-line x-column-header',
                                bind : applySizeBinding('splitCol', {
                                    hidden : '{!isButtonEntryType}'
                                })
                            }
                        ]
                    },
                    {
                        xtype : 'container',
                        reference : 'tbarDetailsCol',
                        items : [
                            {
                                html : i18n.gettext('Total Hrs.'),
                                resizable : false,
                                margin : '2 0 0 1',
                                padding : '14 0 14 10',
                                cls : 'no-border-line x-column-header total-column',
                                width : 80,
                                bind : applySizeBinding('totalHoursCol', {
                                    hidden : '{isManualDay}'
                                })
                            },
                            {
                                html : i18n.gettext('Total Days'),
                                hidden : true,
                                resizable : false,
                                margin : '2 0 0 1',
                                padding : '14 0 14 10',
                                cls : 'no-border-line x-column-header total-column',
                                width : 80,
                                bind : applySizeBinding('totalDaysCol', {
                                    hidden : '{!isManualDay}'
                                })
                            },
                            {
                                html : i18n.gettext('Reg. Hrs.'),
                                resizable : false,
                                margin : '2 0 0 0',
                                padding : '14 0 14 10',
                                cls : 'no-border-line x-column-header total-column',
                                width : 80,
                                bind : applySizeBinding('regIncomeHoursCol', {
                                    hidden : '{!showExtraColumns || isManualDay}'
                                }),
                                hidden : true
                            },
                            {
                                html : i18n.gettext('Reg. Days'),
                                resizable : false,
                                margin : '2 0 0 0',
                                padding : '14 0 14 10',
                                cls : 'no-border-line x-column-header total-column',
                                width : 80,
                                bind : applySizeBinding('regIncomeDaysCol', {
                                    hidden : '{!showExtraColumns || !isManualDay}'
                                }),
                                hidden : true
                            },
                            {
                                html : i18n.gettext('Overtime'),
                                resizable : false,
                                margin : '2 0 0 0',
                                padding : '14 0 14 10',
                                cls : 'no-border-line x-column-header total-column',
                                width : 80,
                                bind : applySizeBinding('overtimeCol', {
                                    hidden : '{!showExtraColumns}'
                                }),
                                hidden : true
                            },
                            {
                                html : i18n.gettext('Auto Breaks'),
                                resizable : false,
                                margin : '2 0 0 0',
                                padding : '14 0 14 10',
                                cls : 'no-border-line x-column-header total-column',
                                width : 100,
                                bind : applySizeBinding('autoBreaksCol', {
                                    hidden : '{!showExtraColumns || !timesheetVertical.hasAutoBreaks}'
                                }),
                                hidden : true
                            },
                            {
                                html : '',
                                resizable : false,
                                isFillUXCol : true,
                                cls : 'no-border-line',
                                width : 0,
                                bind : applySizeBinding('fillUXCol')
                            }
                        ]
                    }
                ]
            },
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
                        itemId : 'btnSave',
                        handler : 'onSave',
                        hidden : true,
                        bind : {
                            hidden : '{!canEditAction}',
                            disabled : '{blockedState}'
                        },
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

        items : [
            {

                xtype : 'panel',
                reference : 'daysContainer',
                layout : {
                    type : 'hbox',
                    align : 'stretch'
                },
                flex : 1,
                listeners : {
                    afterlayout : 'afterLayoutDaysContainer'
                },
                items : [
                    {
                        xtype : 'container',
                        flex : 1,
                        reference : 'fieldsContainerWrap',
                        cls : 'timesheet-days-col-container',
                        listeners : {
                            resize : 'onFieldsContainerWrapResize'
                        },
                        layout : {
                            type : 'vbox'
                        },
                        items : [
                            {
                                xtype : 'container',
                                reference : 'fieldsContainer',
                                scrollable : true,
                                height : '100%',
                                detectTaskChanges : false
                            }
                        ]
                    },
                    {
                        xtype : 'container',
                        cls : 'timesheet-details-col-container',
                        reference : 'detailsContainerWrap',
                        scrollable : 'y',
                        layout : {
                            type : 'hbox',
                            align : 'stretchmax'
                        },
                        items : [
                            {
                                xtype : 'container',
                                reference : 'detailsContainer'
                            }
                        ]
                    }
                ],
                dockedItems : [
                    {
                        xtype : 'toolbar',
                        layout : {
                            type : 'hbox',
                            align : 'center'
                        },
                        dock : 'bottom',
                        cls : 'timesheet-total-hours',
                        padding : 0,
                        items : [
                            {
                                xtype : 'displayfield',
                                margin : '10 0 0 15',
                                height : 40,
                                labelWidth : 'auto',
                                disabled : true,
                                bind : {
                                    fieldLabel : '{totalLabel}',
                                    value : '{totalValue}'
                                }
                            },
                            {
                                xtype : 'displayfield',
                                margin : '10 0 0 15',
                                height : 40,
                                labelWidth : 'auto',
                                disabled : true,
                                bind : {
                                    fieldLabel : '{regularLabel}',
                                    value : '{regularValue}'
                                }
                            },
                            {
                                xtype : 'displayfield',
                                margin : '10 0 0 15',
                                height : 40,
                                fieldLabel : i18n.gettext('Overtime:'),
                                labelWidth : 'auto',
                                disabled : true,
                                bind : {
                                    value : '{overtimeValue}'
                                }
                            },
                            '->',
                            {
                                xtype : 'container',
                                reference : 'bbarDetailsCol',
                                cls : 'timesheet-details-col-container-sum',
                                height : '100%',
                                margin : 0,
                                layout : {
                                    type : 'hbox',
                                    align : 'stretch'
                                },
                                items : [
                                    {
                                        xtype : 'component',
                                        flex : 1
                                    },
                                    {
                                        xtype : 'component',
                                        cls : 'timesheet-fillUXCol-sum',
                                        bind : applySizeBinding('fillUXCol')
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ],

        loadRecord : function() {
            let me = this;

            Ext.defer(function() {
                !me.destroyed && me.getController().load();
            }, 100);
        },

        isWorkflowView : false,
        workflowViewTBar : null,

        initComponent() {
            if (this.isWorkflowView && this.workflowViewTBar) {
                let dockedItems = Ext.clone(this.dockedItems);

                this.on('resize', function() {
                    this.getController().onResizeEmptySpace();
                }, this);

                this.workflowViewTBar.addedItems = [
                    {
                        xtype : 'combobox',
                        width : 320,
                        reference : 'weekSelector',
                        hidden : true,
                        editable : false,
                        queryMode : 'local',
                        valueField : 'number',
                        displayField : 'title',
                        forceSelection : true,
                        bind : {
                            hidden : '{!allowWeekSelector}',
                            store : '{timesheetWeeks}'
                        },
                        listeners : {
                            change : 'handleWeekChange'
                        }
                    },
                    '->',
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
                    ' ',
                    {
                        xtype : 'button',
                        enableToggle : true,
                        glyph : criterion.consts.Glyph['stats-bars'],
                        ui : 'glyph',
                        toggleHandler : 'onToggleDetails'
                    },
                    ' ',
                    {
                        xtype : 'button',
                        ui : 'secondary',
                        text : i18n.gettext('Summary'),
                        handler : 'onShowSummary'
                    }
                ];

                dockedItems.unshift(this.workflowViewTBar);
                this.dockedItems = dockedItems;
            }

            this.callParent(arguments);
        }
    }
});

Ext.define('criterion.view.employee.timesheet.dashboard.TeamPunch', function() {

    const TEAM_TIMESHEET_PUNCH_TYPE = criterion.Consts.TEAM_TIMESHEET_PUNCH_TYPE;

    function skippedRenderer(value, metaData, record) {
        metaData.tdCls = 'employee-' + (record.get('skipped') ? 'skipped' : 'normal');

        return value;
    }

    return {

        extend : 'Ext.tab.Panel',

        alias : 'widget.criterion_employee_timesheet_dashboard_team_punch',

        requires : [
            'criterion.controller.employee.timesheet.dashboard.TeamPunch',
            'criterion.store.dashboard.subordinateTimesheet.*',
            'Ext.grid.filters.Filters'
        ],

        cls : 'criterion-employee-timesheet-dashboard-team-punch',

        title : i18n.gettext('Team Punch'),

        plugins : [
            {
                ptype : 'criterion_sidebar',
                height : 'auto',
                width : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_2_WIDTH,
                modal : true
            }
        ],

        controller : {
            type : 'criterion_employee_timesheet_dashboard_team_punch'
        },

        listeners : {
            show : 'handleShow'
        },

        viewModel : {
            data : {
                paycodeId : null,
                entityRef : null,
                projectId : null,
                taskId : null,
                workLocationId : null,
                workAreaId : null,

                date : null,
                startDate : null,
                endDate : null,
                time : Ext.Date.parse('00:00', 'H:i'),
                timesheetsCount : 0,
                employeesSelected : 0,
                hours : 0,
                days : 0,
                punchType : TEAM_TIMESHEET_PUNCH_TYPE.HOURS.value,
                timesheetTypeTypeIsManual : false,
                timesheetTypeTypeIsManualDay : false
            },
            stores : {
                teamPunch : {
                    type : 'criterion_dashboard_subordinate_timesheet_team_punch'
                },
                availablePayCodes : {
                    type : 'criterion_dashboard_subordinate_timesheet_available_pay_codes',
                    filters : [
                        {
                            property : 'isIncome',
                            value : true
                        }
                    ]
                },
                availableWorkLocations : {
                    type : 'criterion_dashboard_subordinate_timesheet_available_work_locations'
                },
                availableAreas : {
                    type : 'criterion_dashboard_subordinate_timesheet_available_areas'
                },
                availableProjects : {
                    type : 'criterion_dashboard_subordinate_timesheet_available_projects'
                },
                availableTasks : {
                    type : 'criterion_dashboard_subordinate_timesheet_available_tasks'
                },
                punchTypes : {
                    fields : ['text', 'value', 'showWhenManual'],
                    data : Ext.Object.getValues(TEAM_TIMESHEET_PUNCH_TYPE)
                }
            },

            formulas : {
                isHoursPunch : data => data('punchType') === TEAM_TIMESHEET_PUNCH_TYPE.HOURS.value,
                isDaysPunch : data => data('punchType') === TEAM_TIMESHEET_PUNCH_TYPE.DAYS.value,
                isIn : data => data('punchType') === TEAM_TIMESHEET_PUNCH_TYPE.IN.value
            }
        },

        draggable : true,

        buttons : [
            '->',
            {
                xtype : 'button',
                text : i18n.gettext('Cancel'),
                ui : 'light',
                handler : 'handleCancel'
            },
            {
                xtype : 'button',
                text : i18n.gettext('Punch'),
                handler : 'handleExecutePunch',
                disabled : true,
                bind : {
                    disabled : '{!teamGrid.selection}'
                }
            }
        ],

        initComponent() {
            let me = this;

            this.items = [
                {
                    xtype : 'form',
                    reference : 'mainForm',
                    title : i18n.gettext('Team Punch'),
                    bodyPadding : 20,
                    defaults : {
                        labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDER_WIDTH
                    },
                    items : [
                        {
                            xtype : 'datefield',
                            fieldLabel : i18n.gettext('Date'),
                            bind : {
                                value : '{date}',
                                minValue : '{startDate}',
                                maxValue : '{endDate}'
                            },
                            allowBlank : false,
                            listeners : {
                                change : 'handleChanged'
                            }
                        },

                        {
                            xtype : 'combobox',
                            fieldLabel : i18n.gettext('Pay Code'),
                            reference : 'paycodeCombo',
                            bind : {
                                store : '{availablePayCodes}',
                                value : '{entityRef}'
                            },
                            allowBlank : false,
                            queryMode : 'local',
                            displayField : 'name',
                            valueField : 'id',
                            editable : true,
                            forceSelection : true
                        },
                        // Location
                        {
                            xtype : 'combobox',
                            bind : {
                                store : '{availableWorkLocations}',
                                value : '{workLocationId}',
                                hidden : '{!timesheetType.isShowWorkLocation}',
                                fieldLabel : '{timesheetType.labelWorkLocation || "' + i18n.gettext('Location') + '"}'
                            },
                            allowBlank : true,
                            queryMode : 'local',
                            displayField : 'descriptionCode',
                            valueField : 'id',
                            editable : true,
                            forceSelection : true
                        },
                        // Area
                        {
                            xtype : 'combobox',
                            bind : {
                                store : '{availableAreas}',
                                value : '{workAreaId}',
                                hidden : '{!timesheetType.isShowWorkArea}',
                                fieldLabel : '{timesheetType.labelWorkArea || "' + i18n.gettext('Area') + '"}',
                                filters : [
                                    {
                                        property : 'workLocationId',
                                        value : '{workLocationId}',
                                        exactMatch : true
                                    }
                                ]
                            },
                            allowBlank : true,
                            queryMode : 'local',
                            displayField : 'name',
                            valueField : 'id',
                            editable : true,
                            forceSelection : true
                        },
                        // Project
                        {
                            xtype : 'combobox',
                            bind : {
                                store : '{availableProjects}',
                                value : '{projectId}',
                                hidden : '{!timesheetType.isShowProject}',
                                fieldLabel : '{timesheetType.labelProject || "' + i18n.gettext('Project') + '"}'
                            },
                            allowBlank : true,
                            queryMode : 'local',
                            displayField : 'name',
                            valueField : 'id',
                            editable : true,
                            forceSelection : true
                        },
                        // Task
                        {
                            xtype : 'combobox',
                            hidden : true,
                            bind : {
                                store : '{availableTasks}',
                                value : '{taskId}',
                                hidden : '{!timesheetType.isShowTasks}',
                                fieldLabel : '{timesheetType.labelTask || "' + i18n.gettext('Task') + '"}',
                                filters : [
                                    {
                                        property : 'projectId',
                                        value : '{projectId}',
                                        exactMatch : true
                                    },
                                    {
                                        property : 'isActive', // strange that this need here
                                        value : true
                                    },
                                    {
                                        property : 'id', // for binding
                                        value : '{workAreaId}',
                                        disabled : true // this need
                                    },
                                    {
                                        filterFn : function(record) {
                                            let vm = this.getViewModel(),
                                                projectId = vm.get('projectId'),
                                                workLocationAreaId = vm.get('workAreaId'),
                                                workLocationAreaIds = record.get('workLocationAreaIds');

                                            return projectId ? true : (
                                                !workLocationAreaIds.length || Ext.Array.contains(workLocationAreaIds, workLocationAreaId)
                                            );
                                        },
                                        scope : me
                                    }
                                ]
                            },
                            allowBlank : true,
                            queryMode : 'local',
                            displayField : 'name',
                            valueField : 'id',
                            editable : true,
                            forceSelection : true
                        },
                        {
                            xtype : 'container',
                            layout : {
                                type : 'hbox',
                                align : 'center'
                            },
                            margin : '0 0 20 0',
                            items : [
                                {
                                    xtype : 'combobox',
                                    fieldLabel : i18n.gettext('Punch'),
                                    labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDER_WIDTH,
                                    bind : {
                                        store : '{punchTypes}',
                                        value : '{punchType}',
                                        filters : [
                                            {
                                                property : 'showWhenManual',
                                                value : true,
                                                disabled : '{!timesheetTypeTypeIsManual}'
                                            },
                                            {
                                                property : 'showWhenManualDay',
                                                value : true,
                                                disabled : '{!timesheetTypeTypeIsManualDay}'
                                            },
                                            {
                                                property : 'showWhenManualButton',
                                                value : true,
                                                disabled : '{timesheetTypeTypeIsManual || timesheetTypeTypeIsManualDay}'
                                            }
                                        ]
                                    },
                                    listeners : {
                                        change : 'handleChanged'
                                    },
                                    sortByDisplayField : false,
                                    displayField : 'text',
                                    valueField : 'value',
                                    forceSelection : false,
                                    allowBlank : false,
                                    editable : false
                                },
                                {
                                    xtype : 'numberfield',
                                    bind : {
                                        value : '{hours}',
                                        hidden : '{!isHoursPunch}',
                                        disabled : '{!isHoursPunch}'
                                    },
                                    hidden : true,
                                    allowBlank : false,
                                    minValue : 0,
                                    width : 150,
                                    margin : '0 0 0 10',
                                    listeners : {
                                        change : 'handleChanged'
                                    }
                                },
                                {
                                    xtype : 'numberfield',
                                    bind : {
                                        value : '{days}',
                                        hidden : '{!isDaysPunch}',
                                        disabled : '{!isDaysPunch}'
                                    },
                                    hidden : true,
                                    allowBlank : false,
                                    minValue : 0,
                                    width : 150,
                                    margin : '0 0 0 10',
                                    listeners : {
                                        change : 'handleChanged'
                                    }
                                },
                                {
                                    xtype : 'criterion_time_field',
                                    reference : 'timeField',
                                    hideLabel : true,
                                    allowBlank : false,
                                    editable : false,
                                    increment : 15,
                                    width : 150,
                                    margin : '0 0 0 10',
                                    hidden : true,
                                    bind : {
                                        value : '{time}',
                                        hidden : '{isHoursPunch || isDaysPunch}',
                                        disabled : '{isHoursPunch || isDaysPunch}'
                                    },
                                    listeners : {
                                        change : 'handleChanged'
                                    }
                                }
                            ]
                        },

                        {
                            xtype : 'numberfield',
                            fieldLabel : i18n.gettext('Employees Selected'),
                            readOnly : true,
                            bind : {
                                value : '{employeesSelected}'
                            }
                        }
                    ]
                },
                {
                    xtype : 'criterion_gridpanel',
                    title : i18n.gettext('Employees'),
                    reference : 'teamGrid',
                    bind : {
                        store : '{teamPunch}'
                    },
                    height : 300,
                    cls : 'employees-grid',

                    selModel : {
                        selType : 'checkboxmodel',
                        mode : 'MULTI',
                        checkColumnRenderer : function(value, meta, record) {
                            var me = this,
                                cls = me.checkboxCls;

                            if (value) {
                                cls += ' ' + me.checkboxCheckedCls;
                            }

                            if (record.get('skipped')) {
                                record.markAsSkippedForSelection = true;

                                return '';
                            }

                            delete record.markAsSkippedForSelection;

                            return '<span class="tg-checkbox ' + cls + '"></span>';
                        },
                        listeners : {
                            scope : 'controller',
                            selectionchange : 'handleEmployeesSelectionChange'
                        }
                    },

                    plugins : [
                        'gridfilters'
                    ],

                    columns : [
                        {
                            xtype : 'gridcolumn',
                            flex : 1,
                            text : i18n.gettext('Last Name'),
                            dataIndex : 'lastName',
                            renderer : skippedRenderer,
                            filter : true
                        },
                        {
                            xtype : 'gridcolumn',
                            flex : 1,
                            text : i18n.gettext('First Name'),
                            dataIndex : 'firstName',
                            renderer : skippedRenderer,
                            filter : true
                        },
                        {
                            xtype : 'gridcolumn',
                            width : 200,
                            text : i18n.gettext('Employee Number'),
                            dataIndex : 'employeeNumber',
                            renderer : skippedRenderer,
                            filter : true
                        }
                    ]
                }
            ];

            this.callParent(arguments);
        }
    }
});

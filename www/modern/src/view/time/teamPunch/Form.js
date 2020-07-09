Ext.define('ess.view.time.teamPunch.Form', function() {

    const TEAM_TIMESHEET_PUNCH_TYPE = criterion.Consts.TEAM_TIMESHEET_PUNCH_TYPE;

    return {
        alias : 'widget.ess_modern_time_team_punch_form',

        extend : 'Ext.container.Container',

        requires : [
            'ess.controller.time.teamPunch.Form',

            'criterion.store.dashboard.subordinateTimesheet.*'
        ],

        controller : {
            type : 'ess_modern_time_team_punch_form'
        },

        viewModel : {
            data : {
                date : null,
                startDate : null,
                endDate : null,
                time : Ext.Date.parse('00:00', 'H:i'),
                hours : 0,
                punchType : TEAM_TIMESHEET_PUNCH_TYPE.HOURS.value,
                timesheetTypeTypeIsManual : false,
                entityRef : null,

                projectId : null,
                workLocationId : null,
                workAreaId : null
            },
            stores : {
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
                    fields : ['text', 'value'],
                    data : Ext.Object.getValues(TEAM_TIMESHEET_PUNCH_TYPE),
                    filters : [
                        {
                            property : 'showWhenManual',
                            value : true,
                            disabled : '{!timesheetTypeTypeIsManual}'
                        }
                    ]
                }
            },

            formulas : {
                isHoursPunch : function(data) {
                    return data('punchType') === TEAM_TIMESHEET_PUNCH_TYPE.HOURS.value;
                },
                isIn : function(data) {
                    return data('punchType') === TEAM_TIMESHEET_PUNCH_TYPE.IN.value;
                }
            }
        },

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        listeners : {
            loadFieldsData : 'loadFieldsData'
        },

        scrollable : true,

        constructor : function(config) {
            let me = this;

            config.items = [
                {
                    xtype : 'ess_modern_menubar',
                    docked : 'top',
                    title : i18n.gettext('Team Punch'),
                    buttons : [
                        {
                            xtype : 'button',
                            itemId : 'backButton',
                            cls : 'criterion-menubar-back-btn',
                            iconCls : 'md-icon-arrow-back',
                            align : 'left',
                            handler : 'handleBackToFilter'
                        }
                    ],
                    actions : [
                        {
                            xtype : 'button',
                            iconCls : 'md-icon-people',
                            handler : 'handleShowEmployees'
                        },
                        {
                            xtype : 'button',
                            iconCls : 'md-icon-send',
                            handler : 'handlePunch'
                        }
                    ]
                },
                {
                    xtype : 'formpanel',
                    reference : 'punchForm',
                    items : [
                        {
                            xtype : 'datefield',
                            picker : 'floated',
                            label : i18n.gettext('Date'),
                            bind : {
                                value : '{date}',
                                minDate : '{startDate}',
                                maxDate : '{endDate}'
                            },
                            required : true,
                            listeners : {
                                change : 'handleChanged'
                            }
                        },

                        {
                            xtype : 'criterion_combobox',
                            reference : 'paycodeCombo',
                            bind : {
                                store : '{availablePayCodes}',
                                value : '{entityRef}',
                                label : i18n.gettext('Pay Code')
                            },
                            displayField : 'name',
                            valueField : 'id',
                            queryMode : 'local',
                            required : true,
                            listeners : {
                                change : 'handleChanged'
                            }
                        },

                        // Location
                        {
                            xtype : 'criterion_combobox',
                            reference : 'workLocation',
                            bind : {
                                store : '{availableWorkLocations}',
                                value : '{workLocationId}',
                                hidden : '{!timesheetType.isShowWorkLocation}',
                                label : '{timesheetType.labelWorkLocation || "' + i18n.gettext('Location') + '"}'
                            },
                            queryMode : 'local',
                            displayField : 'description',
                            valueField : 'id'
                        },

                        // Area
                        {
                            xtype : 'criterion_combobox',
                            bind : {
                                store : '{availableAreas}',
                                value : '{workAreaId}',
                                hidden : '{!timesheetType.isShowWorkArea}',
                                label : '{timesheetType.labelWorkArea || "' + i18n.gettext('Area') + '"}',
                                filters : [
                                    {
                                        property : 'workLocationId',
                                        value : '{workLocationId}',
                                        exactMatch : true
                                    }
                                ]
                            },
                            queryMode : 'local',
                            displayField : 'name',
                            valueField : 'id',
                            editable : false
                        },
                        // Project
                        {
                            xtype : 'criterion_combobox',
                            bind : {
                                store : '{availableProjects}',
                                value : '{projectId}',
                                hidden : '{!timesheetType.isShowProject}',
                                label : '{timesheetType.labelProject || "' + i18n.gettext('Project') + '"}'
                            },
                            allowBlank : true,
                            queryMode : 'local',
                            displayField : 'name',
                            valueField : 'id'
                        },

                        // Task
                        {
                            xtype : 'criterion_combobox',
                            bind : {
                                store : '{availableTasks}',
                                value : '{taskId}',
                                hidden : '{!timesheetType.isShowTasks}',
                                label : '{timesheetType.labelTask || "' + i18n.gettext('Task') + '"}',

                                filters : [
                                    {
                                        property : 'projectId',
                                        value : '{projectId}',
                                        exactMatch : true
                                    },
                                    {
                                        property : 'isActive',
                                        value : true
                                    },
                                    {
                                        property : 'id', // for binding
                                        value : '{workAreaId}',
                                        disabled : true // this need
                                    },
                                    {
                                        filterFn : function(record) {
                                            let rowVm = me.getViewModel(),
                                                projectId = rowVm.get('projectId'),
                                                workLocationAreaId = rowVm.get('workAreaId'),
                                                workLocationAreaIds = record.get('workLocationAreaIds');

                                            return projectId ? true : (
                                                !workLocationAreaIds.length || Ext.Array.contains(workLocationAreaIds, workLocationAreaId)
                                            );
                                        }
                                    }
                                ]
                            },
                            queryMode : 'local',
                            displayField : 'name',
                            valueField : 'id',
                            editable : false
                        },

                        {
                            xtype : 'container',
                            layout : {
                                type : 'hbox',
                                align : 'center'
                            },
                            margin : '0 0 10 0',
                            items : [
                                {
                                    xtype : 'criterion_combobox',
                                    label : i18n.gettext('Punch'),
                                    labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDER_WIDTH,
                                    bind : {
                                        store : '{punchTypes}',
                                        value : '{punchType}'
                                    },
                                    listeners : {
                                        change : 'handleChanged'
                                    },
                                    required : true,
                                    sortByDisplayField : false,
                                    displayField : 'text',
                                    valueField : 'value',
                                    width : 120,
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
                                    clearable : false,
                                    hidden : true,
                                    required : true,
                                    minValue : 0,
                                    flex : 1,
                                    margin : '45 0 0 10',
                                    listeners : {
                                        change : 'handleChanged'
                                    }
                                },
                                {
                                    xtype : 'criterion_timefield',
                                    reference : 'timeField',
                                    hideLabel : true,
                                    required : true,
                                    editable : false,
                                    increment : 15,
                                    flex : 1,
                                    margin : '45 0 0 10',
                                    hidden : true,
                                    bind : {
                                        value : '{time}',
                                        hidden : '{isHoursPunch}',
                                        disabled : '{isHoursPunch}'
                                    },
                                    listeners : {
                                        change : 'handleChanged'
                                    }
                                }
                            ]
                        },

                        {
                            xtype : 'displayfield',
                            label : i18n.gettext('Count Employee Selected'),
                            readOnly : true,
                            bind : {
                                value : '{employeesSelected}'
                            }
                        }
                    ]
                }
            ];

            this.callParent(arguments);
        }
    };
});

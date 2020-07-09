Ext.define('criterion.view.employee.timesheet.aggregate.Task', function() {

    const _cmpWidthDelta = -10;

    return {

        extend : 'Ext.Container',

        requires : [
            'criterion.view.employee.timesheet.IncomeCombo',
            'criterion.store.employee.timesheet.AvailableTasks',
            'criterion.model.CustomData'
        ],

        alias : 'widget.criterion_employee_timesheet_aggregate_task',

        padding : '10 0 10 0',

        userCls : 'timesheet-horizontal-row',

        viewModel : {
            data : {
                /**
                 * @type criterion.model.employee.timesheet.aggregate.Task
                 */
                timesheetTask : null,

                workLocation : null
            }
        },

        layout : {
            type : 'hbox',
            align : 'stretch'
        },

        defaults : {
            margin : '0 10'
        },

        config : {
            timesheetTask : null,
            timesheetRecord : null,
            customFields : null,
            editable : true,
            taskDisabled : false,
            canChangePaycode : true,

            isFTE : false,
            viewDetailOnly : false
        },

        items : [
            // dynamic
        ],

        initComponent : function() {
            let me = this,
                vm = this.getViewModel(),
                timesheetTask = me.timesheetTask,
                customFields = me.customFields,
                isFTE = me.isFTE,
                editable = this.editable,
                taskDisabled = this.taskDisabled,
                canChangePaycode = this.canChangePaycode,
                viewDetailOnly = this.viewDetailOnly,
                availableTasks = vm.get('availableTasks'),
                availableProjects = vm.get('availableProjects'),
                workLocationAreasData = vm.get('workLocationAreas').getRange(),
                taskRef = 'taskCombo_' + criterion.Utils.generateRndString(10);

            me.items = [
                {
                    xtype : 'container',
                    bind : criterion.view.employee.timesheet.Aggregate.applySizeBinding('actionCol', {}, _cmpWidthDelta),
                    cls : 'timesheet-action-col',
                    style : {
                        opacity : !editable ? 0 : 1
                    },
                    defaults : {
                        margin : '0 0 0 -5',
                        cls : 'criterion-btn-transparent'
                    },
                    items : [
                        {
                            xtype : 'button',
                            glyph : criterion.consts.Glyph['ios7-trash-outline'],
                            tooltip : i18n.gettext('Delete'),
                            bind : {
                                hidden : '{!timesheetTask.isRemovable}'
                            },
                            disabled : !editable,
                            listeners : {
                                scope : this,
                                click : function(cmp) {
                                    vm.get('timesheetTask').drop();
                                }
                            }
                        }
                    ]
                },
                {
                    xtype : 'container',
                    bind : criterion.view.employee.timesheet.Aggregate.applySizeBinding('paycodeCol', {}, _cmpWidthDelta),

                    items : [
                        {
                            xtype : 'criterion_employee_timesheet_income_combo',

                            margin : 0,

                            ui : 'mini',

                            bind : {
                                store : '{incomes}',
                                value : '{timesheetTask.paycodeDetail.id}'
                            },
                            readOnly : !canChangePaycode,
                            disabled : taskDisabled,
                            matchFieldWidth : false,
                            listConfig : {
                                minWidth : 200
                            },
                            /**
                             * See CRITERION-5521 for details.
                             */
                            valueNotFoundText : vm.get('timesheetTask.paycodeDetail.name'),

                            listeners : {
                                scope : this,
                                change : function(cmp, value) {
                                    let timesheetTask = vm.get('timesheetTask'),
                                        selectedPaycode = cmp.getSelection(),
                                        paycodeDetail = timesheetTask && timesheetTask.get('paycodeDetail');

                                    if (!selectedPaycode) {
                                        console && console.error('income not available : ' + value);
                                        return;
                                    }

                                    if (paycodeDetail && paycodeDetail.id !== selectedPaycode.getId()) {
                                        timesheetTask.set('paycodeDetail', selectedPaycode.getData());
                                        if (!timesheetTask.phantom) {
                                            timesheetTask.set('paycodeChanged', true);
                                        }
                                    }

                                    vm.set('timesheetTask.isUnits', selectedPaycode.get('isUnits'));
                                }
                            },

                            width : '100%'
                        }
                    ]
                },
                {
                    xtype : 'container',

                    bind : criterion.view.employee.timesheet.Aggregate.applySizeBinding('locationCol', {
                        hidden : '{!hasMultiLocations && !timesheetRecord.timesheetType.isShowWorkLocation}'
                    }, _cmpWidthDelta),

                    hidden : true,

                    items : [
                        !viewDetailOnly ? {
                            xtype : 'combo',

                            ui : 'mini',

                            margin : 0,

                            editable : true,
                            forceSelection : true,
                            matchFieldWidth : false,
                            anyMatch : true,
                            listConfig : {
                                minWidth : 200
                            },
                            bind : {
                                valueNotFoundText : '{timesheetTask.employerWorkLocationName}',
                                store : '{workLocations}',
                                value : '{timesheetTask.employerWorkLocationId}',
                                selection : '{workLocation}'
                            },
                            readOnly : !editable,
                            disabled : taskDisabled,

                            queryMode : 'local',
                            valueField : 'employerWorkLocationId',
                            displayField : 'employerLocationName',
                            allowBlank : false,
                            width : '100%'
                        } : {
                            xtype : 'textfield',

                            ui : 'mini',

                            margin : 0,

                            bind : {
                                value : '{timesheetTask.employerWorkLocationName}',
                                readOnly : true
                            },
                            width : '100%'
                        }
                    ]
                },
                {
                    xtype : 'container',

                    bind : criterion.view.employee.timesheet.Aggregate.applySizeBinding('areaCol', {
                        hidden : '{!timesheetRecord.timesheetType.isShowWorkArea}'
                    }, _cmpWidthDelta),

                    hidden : true,

                    items : [
                        !viewDetailOnly ? {
                            xtype : 'combo',

                            ui : 'mini',

                            margin : 0,

                            store : {
                                type : 'work_location_areas',
                                data : workLocationAreasData
                            },
                            editable : true,
                            forceSelection : true,
                            matchFieldWidth : false,
                            listConfig : {
                                minWidth : 200
                            },
                            bind : {
                                filters : [
                                    {
                                        property : 'workLocationId',
                                        value : '{workLocation.workLocationId}',
                                        exactMatch : true
                                    }
                                ],
                                value : '{timesheetTask.workLocationAreaId}'
                            },

                            readOnly : !editable,
                            disabled : taskDisabled,

                            queryMode : 'local',
                            valueField : 'id',
                            displayField : 'name',
                            width : '100%'
                        } : {
                            xtype : 'textfield',
                            ui : 'mini',
                            margin : 0,
                            bind : {
                                value : '{timesheetTask.workLocationAreaName}',
                                readOnly : true
                            },
                            width : '100%'
                        }
                    ]
                },
                {
                    xtype : 'container',

                    bind : criterion.view.employee.timesheet.Aggregate.applySizeBinding('projectCol', {
                        hidden : '{!timesheetRecord.timesheetType.isShowProject}'
                    }, _cmpWidthDelta),

                    hidden : true,

                    items : [
                        !viewDetailOnly ? {
                            xtype : 'combo',
                            ui : 'mini',
                            margin : 0,
                            bind : {
                                value : '{timesheetTask.projectId}'
                            },
                            store : {
                                type : 'criterion_employee_timesheet_available_projects',
                                data : availableProjects.getRange()
                            },

                            readOnly : !editable,
                            disabled : taskDisabled,

                            valueField : 'id',
                            displayField : 'name',
                            queryMode : 'local',
                            editable : true,
                            forceSelection : true,
                            matchFieldWidth : false,
                            listConfig : {
                                minWidth : 200
                            },
                            valueNotFoundText : vm.get('timesheetTask.projectName'),
                            width : '100%'
                        } : {
                            xtype : 'textfield',
                            ui : 'mini',
                            margin : 0,
                            bind : {
                                value : '{timesheetTask.projectName}',
                                readOnly : true
                            },
                            width : '100%'
                        }
                    ]
                },
                {
                    xtype : 'container',

                    bind : criterion.view.employee.timesheet.Aggregate.applySizeBinding('taskCol', {
                        hidden : '{!timesheetRecord.timesheetType.isShowTasks}'
                    }, _cmpWidthDelta),

                    hidden : true,

                    items : [
                        !viewDetailOnly ? {
                            xtype : 'combo',

                            ui : 'mini',

                            ref : 'tasksCombo',

                            margin : 0,

                            bind : {
                                value : '{timesheetTask.taskId}',
                                filters : [
                                    {
                                        property : 'projectId',
                                        value : '{timesheetTask.projectId}',
                                        exactMatch : true
                                    },
                                    {
                                        property : 'isActive', // strange that this need here
                                        value : true
                                    },
                                    {
                                        property : 'id', // for binding
                                        value : '{timesheetTask.workLocationAreaId}',
                                        disabled : true // this need
                                    },
                                    {
                                        filterFn : function(record) {
                                            let projectId = vm.get('timesheetTask.projectId'),
                                                workLocationAreaId = vm.get('timesheetTask.workLocationAreaId'),
                                                workLocationAreaIds = record.get('workLocationAreaIds');

                                            return projectId ? true : (
                                                !workLocationAreaIds.length || Ext.Array.contains(workLocationAreaIds, workLocationAreaId)
                                            );
                                        }
                                    }
                                ]
                            },

                            reference : taskRef,

                            store : {
                                type : 'criterion_employee_timesheet_available_tasks',
                                data : availableTasks.getRange()
                            },

                            readOnly : !editable,
                            disabled : taskDisabled,

                            valueField : 'id',
                            displayField : 'name',
                            queryMode : 'local',
                            editable : true,
                            forceSelection : true,
                            matchFieldWidth : false,
                            listConfig : {
                                minWidth : 200
                            },
                            valueNotFoundText : vm.get('timesheetTask.employeeTaskName'),

                            width : '100%',

                            listeners : {
                                change : function(cmp, value) {
                                    if (value && me.up('[reference=tasksContainer]').detectTaskChanges) {
                                        criterion.Utils.fillCustomFieldsDefaultValuesFromCodes(me, cmp.getSelection().get('classificationCodesAndValues'));
                                    }
                                }
                            }
                        } : {
                            xtype : 'textfield',

                            ui : 'mini',

                            margin : 0,

                            bind : {
                                value : '{timesheetTask.employeeTaskName}',
                                readOnly : true
                            },
                            width : '100%'
                        }
                    ]
                },
                {
                    xtype : 'container',

                    bind : criterion.view.employee.timesheet.Aggregate.applySizeBinding('assignmentCol', {
                        hidden : '{!hasMultiAssignments && !timesheetRecord.timesheetType.isShowAssignment}'
                    }, _cmpWidthDelta),

                    hidden : true,

                    items : [
                        !viewDetailOnly ? {
                            xtype : 'combo',

                            ui : 'mini',

                            margin : 0,

                            bind : {
                                store : '{availableAssignments}',
                                value : '{timesheetTask.assignmentId}'
                            },

                            readOnly : !editable,
                            disabled : taskDisabled || !timesheetTask.phantom,

                            valueField : 'assignmentId',
                            displayField : 'title',
                            queryMode : 'local',
                            allowBlank : false,
                            matchFieldWidth : false,
                            listConfig : {
                                minWidth : 200
                            },
                            width : '100%',

                            listeners : isFTE && {
                                change : function(cmp, newVal, oldVal) {
                                    let managerMode = cmp.up('criterion_employee_timesheet_aggregate_task').getViewModel().get('managerMode'),
                                        API = criterion.consts.Api.API;

                                    if (newVal && (oldVal || timesheetTask.phantom)) {
                                        criterion.Api.requestWithPromise({
                                            url : (managerMode ? API.EMPLOYEE_SUBORDINATE_TIMESHEET_AGGREGATE_CALC_FTE_MULTIPLIER : API.CALC_FTE_MULTIPLIER),
                                            method : 'GET',
                                            params : {
                                                assignmentId : newVal,
                                                timesheetId : timesheetTask.get('timesheetId')
                                            }
                                        }).then(function(fteMultiplier) {
                                            timesheetTask.set('fteMultiplier', fteMultiplier)
                                        });
                                    }
                                }
                            }
                        } : {
                            xtype : 'textfield',

                            ui : 'mini',

                            margin : 0,

                            bind : {
                                value : '{timesheetTask.assignmentName}',
                                readOnly : true
                            },
                            width : '100%'
                        }
                    ]
                }
            ];

            Ext.Array.each(criterion.Utils.range(1, 4), function(index) {
                let container = {
                        xtype : 'container',
                        bind : criterion.view.employee.timesheet.Aggregate.applySizeBinding('customCol', {
                            hidden : Ext.String.format('{!customField{0}Title}', index)
                        }, _cmpWidthDelta),
                        defaults : {
                            ui : 'mini',
                            matchFieldWidth : false,
                            margin : 0
                        },
                        items : []
                    },
                    customFieldConf = customFields[index - 1];

                if (customFieldConf) {
                    let customField = criterion.model.CustomData.loadData(customFieldConf),
                        fieldName = Ext.String.format('customValue{0}', index),
                        value = timesheetTask.get(fieldName),
                        cmp = Ext.merge({
                            readOnly : !editable,
                            disabled : taskDisabled,
                            value : value,
                            width : '100%',

                            bind : Ext.apply({}, criterion.Utils.getCustomFieldBindFilters(customField, 'timesheetTask', me, taskRef)),

                            listeners : {
                                change : function(cmp, newVal) {
                                    timesheetTask.set(fieldName, newVal)
                                }
                            }
                        }, criterion.Utils.getCustomFieldEditorConfig(customField, value, timesheetTask, fieldName));

                    container.items.push(cmp);
                }

                me.items.push(container);
            });

            me.callParent(arguments);
        }
    }
});

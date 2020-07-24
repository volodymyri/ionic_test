Ext.define('ess.view.TimeEntry', function() {

    return {
        alias : 'widget.ess_modern_time_entry',

        extend : 'Ext.Container',

        title : 'Time Entry',

        requires : [
            'ess.controller.TimeEntry',

            'criterion.store.employee.WorkLocations',
            'criterion.store.employee.timesheet.AvailableTasks',
            'criterion.store.Assignments',
            'criterion.store.employee.timesheet.LIncomes',
            'criterion.store.employer.WorkLocations',
            'criterion.store.workLocation.Areas',
            'criterion.store.employee.timesheet.AvailableProjects'
        ],

        controller : 'ess_modern_time_entry',

        viewModel : {
            data : {
                /**
                 * @type criterion.model.employee.timesheet.Task
                 */
                startedTask : null,
                startData : null,

                labelAssignment : null,
                labelTask : null,
                labelWorkArea : null,
                labelWorkLocation : null,

                isShowWorkLocation : false,
                isShowWorkArea : false,
                isShowAssignment : false,
                isShowTasks : false
            },
            stores : {
                employeeWorkLocations : {
                    type : 'criterion_employee_work_locations'
                },
                availableTasks : {
                    type : 'criterion_employee_timesheet_available_tasks'
                },
                assignments : {
                    type : 'criterion_assignments'
                },
                employeePaycodes : {
                    type : 'criterion_employee_timesheet_lincomes',
                    sorters : [{
                        property : 'name',
                        direction : 'ASC'
                    }]
                },
                employerWorkLocations : {
                    type : 'employer_work_locations'
                },
                workLocationAreas : {
                    type : 'work_location_areas',
                    filters : []
                },
                availableProjects : {
                    type : 'criterion_employee_timesheet_available_projects'
                }
            },
            formulas : {
                inOutText : data => !data('startedTask.isStarted') ? i18n.gettext('In') : i18n.gettext('Out'),
                buttonCls : data => !data('startedTask.isStarted') ? 'stopped' : 'started',
                paycodeIsRequired : data => {
                    let startedTask = data('startedTask');

                    return !startedTask || startedTask.phantom;
                }
            }
        },

        listeners : {
            activate : 'load'
        },

        cls : 'ess-time-entry',

        layout : 'fit',

        constructor : function(config) {
            let me = this;

            config.items = [
                {
                    xtype : 'container',
                    reference : 'topPart',
                    cls : 'ess-main-menu-top-part',
                    layout : {
                        type : 'vbox'
                    },
                    docked : 'top',
                    items : [
                        {
                            xtype : 'ess_modern_employee_info'
                        }
                    ]
                },
                {
                    xtype : 'button',
                    docked : 'top',
                    cls : 'in-out-button',
                    bind : {
                        text : '{inOutText}',
                        userCls : '{buttonCls}'
                    },
                    handler : 'handleInOutClick'
                },
                {
                    xtype : 'formpanel',
                    reference : 'entryForm',
                    layout : 'vbox',
                    padding : 10,
                    items : [
                        {
                            xtype : 'criterion_combobox',
                            label : i18n.gettext('Paycode'),
                            reference : 'paycode',
                            bind : {
                                store : '{employeePaycodes}',
                                value : '{startedTask.paycodeDetailId}',
                                disabled : '{startedTask.isStarted}',
                                required : '{paycodeIsRequired}'
                            },
                            listeners : {
                                change : 'handleSelectPaycode'
                            },
                            valueField : 'id',
                            displayField : 'name',
                            autoSelect : true
                        },
                        {
                            xtype : 'criterion_combobox',
                            label : i18n.gettext('Project'),
                            bind : {
                                store : '{availableProjects}',
                                value : '{startedTask.projectId}',
                                disabled : '{startedTask.isStarted}',
                                label : '{labelProject}',
                                hidden : '{!isShowProject}'
                            },
                            displayField : 'name',
                            valueField : 'id',
                            autoSelect : false
                        },
                        {
                            xtype : 'criterion_combobox',
                            label : i18n.gettext('Title'),
                            bind : {
                                store : '{assignments}',
                                value : '{startedTask.assignmentId}',
                                disabled : '{startedTask.isStarted}',
                                label : '{labelAssignment}',
                                hidden : '{!isShowAssignment}'
                            },
                            valueField : 'id',
                            displayField : 'assignmentDetailTitle',
                            autoSelect : true,
                            required : true
                        },
                        {
                            xtype : 'criterion_combobox',
                            reference : 'workLocationCombo',
                            label : i18n.gettext('Location'),
                            bind : {
                                store : '{employeeWorkLocations}',
                                value : '{startedTask.employerWorkLocationId}',
                                disabled : '{startedTask.isStarted}',
                                label : '{labelWorkLocation}',
                                hidden : '{!isShowWorkLocation}'
                            },
                            valueField : 'employerWorkLocationId',
                            displayField : 'employerLocationName',
                            autoSelect : true,
                            required : true
                        },
                        {
                            xtype : 'criterion_combobox',
                            reference : 'areaSelect',
                            label : i18n.gettext('Area'),
                            bind : {
                                store : '{workLocationAreas}',
                                value : '{startedTask.workLocationAreaId}',
                                disabled : '{startedTask.isStarted}',
                                label : '{labelWorkArea}',
                                hidden : '{!isShowWorkArea}',
                                filters : [
                                    {
                                        property : 'workLocationId',
                                        value : '{workLocationCombo.selection.employerWorkLocationId}',
                                        exactMatch : true
                                    }
                                ]
                            },
                            valueField : 'id',
                            displayField : 'name'
                        },
                        {
                            xtype : 'criterion_combobox',
                            reference : 'taskField',
                            label : i18n.gettext('Task'),
                            bind : {
                                store : '{availableTasks}',
                                value : '{startedTask.taskId}',
                                disabled : '{startedTask.isStarted}',
                                label : '{labelTask}',
                                hidden : '{!isShowTasks}',
                                filters : [
                                    {
                                        property : 'projectId',
                                        value : '{startedTask.projectId}',
                                        exactMatch : true
                                    },
                                    {
                                        property : 'id', // for binding
                                        value : '{startedTask.workLocationAreaId}',
                                        disabled : true // this need
                                    },
                                    {
                                        filterFn : function(record) {
                                            let vm = me.getViewModel(),
                                                projectId = vm.get('startedTask.projectId'),
                                                workLocationAreaId = vm.get('startedTask.workLocationAreaId'),
                                                workLocationAreaIds = record.get('workLocationAreaIds');

                                            return projectId ? true : (
                                                !workLocationAreaIds.length || Ext.Array.contains(workLocationAreaIds, workLocationAreaId)
                                            );
                                        }
                                    }
                                ]
                            },
                            valueField : 'id',
                            displayField : 'name',
                            autoSelect : false,
                            resetOnFilterChange : true,
                            listeners : {
                                change : function(cmp, value) {
                                    if (value) {
                                        criterion.Utils.fillCustomFieldsDefaultValuesFromCodes(
                                            cmp.up('ess_modern_time_entry'),
                                            cmp.getSelection().get('classificationCodesAndValues'),
                                            'criterion_code_detail_select[codeTableId='
                                        );
                                    }
                                }
                            }
                        },
                        {
                            xtype : 'container',
                            reference : 'customFields'
                        }
                    ]
                }
            ];

            this.callParent(arguments);
        }

    };

});

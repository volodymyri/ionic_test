Ext.define('criterion.view.employee.timesheet.horizontal.Task', function() {

    const _cmpWidthDelta = -10;

    return {

        extend : 'Ext.Container',

        requires : [
            'criterion.view.employee.timesheet.IncomeCombo',
            'criterion.store.employee.timesheet.AvailableTasks',
            'criterion.store.employee.timesheet.AvailableProjects',
            'criterion.plugin.MouseOver'
        ],

        alias : 'widget.criterion_employee_timesheet_horizontal_task',

        padding : '10 0 10 0',

        userCls : 'timesheet-horizontal-row',

        viewModel : {
            data : {
                /**
                 * @type criterion.model.employee.timesheet.Task
                 */
                timesheetTask : null,
                autoPopulate : null,
                isAutopopulateHours : false
            },
            formulas : {
                startStopGlyph : function(vmget) {
                    return vmget('timesheetTask.isStarted') ? criterion.consts.Glyph['stop'] : criterion.consts.Glyph['ios7-play']
                },
                startStopClass : function(vmget) {
                    return vmget('timesheetTask.isStarted') ? 'stop-button' : 'start-button'
                },
                isTaskEditable : function(vmget) {
                    return vmget('isEditable') && vmget('timesheetTask.isUpdatable') && !vmget('viewDetailOnly');
                },
                isTaskDisabled : function(vmget) {
                    return vmget('timesheetTask.isApplicableToApprover') === false || vmget('timesheetTask.isStarted');
                },
                canChangePaycode : function(vmget) {
                    return (vmget('isPhantom') || vmget('timesheetTask.isIncome')) && vmget('isTaskEditable')
                },
                canChangeAssignment : function(vmget) {
                    return vmget('isPhantom') && vmget('isTaskEditable');
                },
                isPhantom : {
                    bind : {
                        bindTo : '{timesheetTask}',
                        deep : true
                    },
                    get : function(timesheetTask) {
                        return timesheetTask ? timesheetTask.phantom : true
                    }
                },
                canStartStop : function(vmget) {
                    let timesheetRecord = vmget('timesheetRecord'),
                        timesheetType = timesheetRecord && timesheetRecord.getTimesheetType && timesheetRecord.getTimesheetType(),
                        entryType = timesheetType && timesheetType.get('entryType');

                    return Ext.Array.contains([criterion.Consts.TIMESHEET_LAYOUT_ENTRY_TYPE.BUTTON, criterion.Consts.TIMESHEET_LAYOUT_ENTRY_TYPE.MANUAL_AND_BUTTON], entryType)
                        && vmget('timesheetRecord.isCurrent')
                        && vmget('isEditable')
                        && vmget('isTaskEditable')
                        && vmget('timesheetTask.paycodeDetail.isTrackable')
                        && !this.get('managerMode')
                },
                incomesStore : function(vmget) {
                    return !vmget('isPhantom') && vmget('timesheetTask.isIncome') ? this.getStore('incomesOnlyIncome') : this.getStore('incomes');
                }
            }
        },

        plugins : [
            {
                ptype : 'criterion_mouse_over',
                delegate : '.task-container',
                highlightedCmps : ['.days-container']
            }
        ],

        listeners : {
            startStopTask : 'startStopTask',
            removeTask : 'removeTask'
        },

        layout : {
            type : 'vbox',
            align : 'stretchmax'
        },

        width : '100%',

        items : [
            {
                xtype : 'container',
                itemId : 'colsContainer',
                layout : 'hbox',
                defaults : {
                    margin : '0 10'
                },
                items : [
                    // dynamic
                ]
            }
        ],

        initComponent : function() {
            let me = this,
                codeDataStore = criterion.CodeDataManager.getStore(criterion.consts.Dict.DATA_TYPE),
                colsContainer,
                taskRef = 'taskCombo_' + criterion.Utils.generateRndString(10);

            this.callParent(arguments);

            colsContainer = me.down('#colsContainer');

            if (!codeDataStore.isLoaded() && !codeDataStore.isLoading()) {
                criterion.CodeDataManager.load([
                    criterion.consts.Dict.DATA_TYPE
                ]).then(function() {
                    colsContainer.add(me.createColumns());
                    Ext.defer(() => {
                        colsContainer.add(me.createCustomFieldsColumns(taskRef))
                    }, 100);
                });
            } else {
                colsContainer.add(this.createColumns(taskRef));
                Ext.defer(() => {
                    colsContainer.add(me.createCustomFieldsColumns(taskRef))
                }, 100);
            }
        },

        createColumns : function(taskRef) {
            let me = this,
                vm = this.getViewModel(),
                columns = [],
                viewDetailOnly = vm.get('viewDetailOnly'),
                workLocationAreasData = vm.get('workLocationAreas').getRange(),
                assignmentId = vm.get('timesheetTask.assignmentId'),
                availableAssignments = vm.get('availableAssignments'),
                availableTasks = vm.get('availableTasks'),
                availableProjects = vm.get('availableProjects'),
                assignmentUnavailable = availableAssignments.find('assignmentId', assignmentId, 0, false, false, true) === -1,
                taskWorkLocationReference = 'taskWorkLocation_' + criterion.Utils.generateUID();

            vm.set('timesheetTask.isUnits', vm.get('timesheetTask.paycodeDetail.isUnits'));

            columns.push(
                {
                    xtype : 'container',
                    bind : criterion.view.employee.timesheet.Horizontal.applySizeBinding('actionCol', {
                        hidden : '{!isEditable}'
                    }, _cmpWidthDelta),
                    cls : 'timesheet-action-col',
                    defaults : {
                        margin : '3 0 0 -5',
                        cls : 'criterion-btn-transparent'
                    },
                    items : [
                        {
                            xtype : 'button',
                            glyph : criterion.consts.Glyph['ios7-play'],
                            tooltip : i18n.gettext('Start/Stop'),
                            bind : {
                                hidden : '{!canStartStop}',
                                glyph : '{startStopGlyph}',
                                userCls : '{startStopClass}'
                            },
                            listeners : {
                                scope : this,
                                click : function(cmp) {
                                    this.fireEvent('startStopTask', vm.get('timesheetTask'));
                                }
                            }
                        }
                    ]
                },
                {
                    xtype : 'container',
                    bind : criterion.view.employee.timesheet.Horizontal.applySizeBinding('actionCol', {
                        hidden : '{!isEditable}'
                    }, _cmpWidthDelta),
                    cls : 'timesheet-action-col',
                    defaults : {
                        margin : '3 0 0 -5'
                    },
                    items : [
                        {
                            xtype : 'button',
                            glyph : criterion.consts.Glyph['ios7-trash-outline'],
                            tooltip : i18n.gettext('Delete'),
                            cls : 'criterion-btn-transparent delete-button',
                            bind : {
                                hidden : '{!timesheetTask.isRemovable}'
                            },
                            listeners : {
                                scope : this,
                                click : function(cmp) {
                                    this.fireEvent('removeTask', vm.get('timesheetTask'));
                                }
                            }
                        }
                    ]
                },
                {
                    xtype : 'container',
                    bind : criterion.view.employee.timesheet.Horizontal.applySizeBinding('paycodeCol', {}, _cmpWidthDelta),

                    items : [
                        {
                            xtype : 'criterion_employee_timesheet_income_combo',

                            ui : 'mini',

                            margin : 0,
                            matchFieldWidth : false,
                            listConfig : {
                                minWidth : 150
                            },
                            bind : {
                                store : '{incomesStore}',
                                value : '{timesheetTask.paycodeDetail.id}',
                                readOnly : '{!canChangePaycode}',
                                disabled : '{isTaskDisabled}'
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
                                        isAutopopulateHours = vm.get('isAutopopulateHours'),
                                        paycodeDetail = timesheetTask && timesheetTask.getPaycodeDetail && timesheetTask.getPaycodeDetail() || timesheetTask.get('paycodeDetail'),
                                        autoPopulate = vm.get('autoPopulate'),
                                        timesheetTaskDetails = timesheetTask && timesheetTask.timesheetTaskDetails();

                                    if (!selectedPaycode || !timesheetTaskDetails) {
                                        console && !selectedPaycode && console.error('income not available : ' + value);
                                        console && !timesheetTaskDetails && console.error('timesheetTask not available!');

                                        return;
                                    }

                                    // check income dates
                                    timesheetTaskDetails.each(function(detail) {
                                        detail.set('isBlockedInCurrentPaycode', !(selectedPaycode.get('isBreak') || selectedPaycode.isDateAvailable(detail.get('date')) || selectedPaycode.get('isTrackableNow')));
                                    });

                                    if (isAutopopulateHours) {
                                        timesheetTaskDetails.each(function(detail) {
                                            let hours = 0;

                                            if (parseInt(selectedPaycode.get('paycode'), 10) === criterion.Consts.PAYCODE.INCOME && !selectedPaycode.get('isUnits')) {
                                                let date = Ext.Date.format(detail.get('date'), criterion.consts.Api.DATE_FORMAT),
                                                    populate = autoPopulate.findRecord('date', date);

                                                hours = 0;
                                                if (!detail.get('isBlockedInCurrentPaycode') && populate) {
                                                    hours = populate.get('workPeriodHours');
                                                }
                                            }

                                            detail.set('hours', hours);
                                        });
                                    }

                                    if (paycodeDetail && paycodeDetail.id !== selectedPaycode.getId()) {
                                        if (paycodeDetail.isModel) {
                                            paycodeDetail.set(selectedPaycode.getData());
                                        } else {
                                            // issue with manual instantiation of hasOne associations, affects phantom records
                                            Ext.apply(paycodeDetail, selectedPaycode.getData());
                                        }

                                        vm.set('timesheetTask.isUnits', selectedPaycode.get('isUnits'));
                                        vm.set('timesheetTask.isTimeOff', selectedPaycode.get('isTimeOff'));

                                        if (!timesheetTask.phantom) {
                                            let changes = paycodeDetail.getChanges();

                                            timesheetTask.set('paycodeChanged', changes && changes.hasOwnProperty('id'));
                                        }
                                    }
                                }
                            },

                            width : '100%'
                        }
                    ]
                },
                {
                    xtype : 'container',

                    bind : criterion.view.employee.timesheet.Horizontal.applySizeBinding('locationCol', {
                        hidden : '{!hasMultiLocations && !timesheetRecord.timesheetType.isShowWorkLocation}'
                    }, _cmpWidthDelta),

                    hidden : true,

                    items : [
                        !viewDetailOnly && !assignmentUnavailable ? {
                            xtype : 'combo',

                            ui : 'mini',

                            margin : 0,

                            reference : taskWorkLocationReference,

                            matchFieldWidth : false,
                            listConfig : {
                                minWidth : 150
                            },
                            editable : true,
                            forceSelection : true,
                            anyMatch : true,
                            bind : {
                                valueNotFoundText : '{timesheetTask.employerWorkLocationName}',
                                store : '{workLocations}',
                                value : '{timesheetTask.employerWorkLocationId}',
                                readOnly : '{!isTaskEditable}',
                                disabled : '{isTaskDisabled}'
                            },

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

                    bind : criterion.view.employee.timesheet.Horizontal.applySizeBinding('areaCol', {
                        hidden : '{!timesheetRecord.timesheetType.isShowWorkArea}'
                    }, _cmpWidthDelta),

                    hidden : true,

                    items : [
                        !viewDetailOnly && !assignmentUnavailable ? {
                            xtype : 'combo',

                            ui : 'mini',

                            margin : 0,

                            store : {
                                type : 'work_location_areas',
                                data : workLocationAreasData
                            },
                            matchFieldWidth : false,
                            listConfig : {
                                minWidth : 150
                            },
                            editable : true,
                            forceSelection : true,

                            bind : {
                                filters : [
                                    {
                                        property : 'workLocationId',
                                        value : Ext.String.format('{{0}.selection.workLocationId}', taskWorkLocationReference),
                                        exactMatch : true
                                    }
                                ],
                                value : '{timesheetTask.workLocationAreaId}',
                                readOnly : '{!isTaskEditable}',
                                disabled : '{isTaskDisabled}'
                            },

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

                    bind : criterion.view.employee.timesheet.Horizontal.applySizeBinding('projectCol', {
                        hidden : '{!timesheetRecord.timesheetType.isShowProject}'
                    }, _cmpWidthDelta),

                    hidden : true,

                    items : [
                        !viewDetailOnly && !assignmentUnavailable ? {
                            xtype : 'combo',

                            ui : 'mini',

                            ref : 'tasksCombo',

                            margin : 0,

                            bind : {
                                value : '{timesheetTask.projectId}',
                                readOnly : '{!isTaskEditable}',
                                disabled : '{isTaskDisabled}',
                                store : {
                                    type : 'criterion_employee_timesheet_available_projects',
                                    data : availableProjects.getRange()
                                }
                            },

                            valueField : 'id',
                            displayField : 'name',
                            queryMode : 'local',
                            matchFieldWidth : false,
                            listConfig : {
                                minWidth : 150
                            },
                            editable : true,
                            forceSelection : true,
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

                    bind : criterion.view.employee.timesheet.Horizontal.applySizeBinding('taskCol', {
                        hidden : '{!timesheetRecord.timesheetType.isShowTasks}'
                    }, _cmpWidthDelta),

                    hidden : true,

                    items : [
                        !viewDetailOnly && !assignmentUnavailable ? {
                            xtype : 'combo',
                            ui : 'mini',
                            ref : 'tasksCombo',
                            margin : 0,
                            bind : {
                                value : '{timesheetTask.taskId}',
                                readOnly : '{!isTaskEditable}',
                                disabled : '{isTaskDisabled}',
                                store : {
                                    type : 'criterion_employee_timesheet_available_tasks',
                                    data : availableTasks.getRange()
                                },
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
                            valueField : 'id',
                            displayField : 'name',
                            queryMode : 'local',
                            matchFieldWidth : false,
                            listConfig : {
                                minWidth : 150
                            },
                            editable : true,
                            forceSelection : true,
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

                    bind : criterion.view.employee.timesheet.Horizontal.applySizeBinding('assignmentCol', {
                        hidden : '{!hasMultiAssignments && !timesheetRecord.timesheetType.isShowAssignment}'
                    }, _cmpWidthDelta),

                    hidden : true,

                    items : [
                        !viewDetailOnly && !assignmentUnavailable ? {
                            xtype : 'combo',

                            ui : 'mini',

                            margin : 0,
                            matchFieldWidth : false,
                            listConfig : {
                                minWidth : 150
                            },
                            bind : {
                                store : '{availableAssignments}',
                                value : '{timesheetTask.assignmentId}',
                                readOnly : '{!canChangeAssignment}',
                                disabled : '{isTaskDisabled}'
                            },

                            valueField : 'assignmentId',
                            displayField : 'title',
                            queryMode : 'local',
                            allowBlank : false,
                            width : '100%'
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
            );

            return columns;
        },

        createCustomFieldsColumns(taskRef) {
            let me = this,
                vm = this.getViewModel(),
                columns = [],
                viewDetailOnly = vm.get('viewDetailOnly'),
                assignmentId = vm.get('timesheetTask.assignmentId'),
                availableAssignments = vm.get('availableAssignments'),
                assignmentUnavailable = availableAssignments.find('assignmentId', assignmentId, 0, false, false, true) === -1,
                timesheetTask = vm.get('timesheetTask'),
                customFields = vm.get('timesheetRecord').get('customFields');

            Ext.Array.each(criterion.Utils.range(1, 4), function(index) {
                let container = {
                        xtype : 'container',
                        bind : criterion.view.employee.timesheet.Horizontal.applySizeBinding(Ext.String.format('customCol{0}', index), {
                            hidden : Ext.String.format('{!customField{0}Title}', index)
                        }, _cmpWidthDelta),
                        defaults : {
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

                            bind : Ext.apply({
                                readOnly : assignmentUnavailable ? true : '{!isTaskEditable}',
                                disabled : '{isTaskDisabled}'
                            }, !viewDetailOnly ? criterion.Utils.getCustomFieldBindFilters(customField, 'timesheetTask', me, taskRef) : {}),

                            value : value,
                            width : '100%',
                            matchFieldWidth : false,
                            ui : 'mini',

                            listeners : {
                                change : function(cmp, newVal) {
                                    timesheetTask.set(fieldName, newVal)
                                }
                            }
                        }, criterion.Utils.getCustomFieldEditorConfig(customField, value, timesheetTask, fieldName));

                    container.items.push(cmp);
                }

                columns.push(container);
            });

            return columns;
        }
    }
});

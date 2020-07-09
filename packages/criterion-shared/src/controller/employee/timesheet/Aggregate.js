Ext.define('criterion.controller.employee.timesheet.Aggregate', function() {

    const WORKFLOW_STATUSES = criterion.Consts.WORKFLOW_STATUSES;

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_employee_timesheet_aggregate',

        requires : [
            'criterion.view.employee.SubmitConfirm',
            'criterion.store.employee.timesheet.Incomes',
            'criterion.store.employee.timesheet.AvailableTasks',
            'criterion.store.employee.timesheet.AvailableProjects',
            'criterion.model.CustomData'
        ],

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex',
            'criterion.controller.employee.timesheet.mixin.NotesHandler',
            'criterion.controller.employee.timesheet.mixin.SummaryHandler',
            'criterion.controller.employee.timesheet.mixin.ManagerOptionsHandler',
            'criterion.controller.mixin.WorkflowConfirmation',
            'criterion.store.workLocation.Areas'
        ],

        onAddTask : function() {
            this.addNewTask();
        },

        onCancel : function() {
            let view = this.getView();

            view.setLoading(true);

            view.on('destroy', function() {
                view.setLoading(false);
            });

            this.getViewModel().get('timesheetRecord').reject();

            Ext.defer(function() {
                view.close();
            }, 10);
        },

        onSubmitTimesheet : function() {
            this.submit();
        },

        handleRecallRequest : function() {
            let me = this,
                vm = this.getViewModel(),
                record = vm.get('timesheetRecord'),
                employeeId = record.get('employeeId'),
                view = me.getView();

            // delay for correct find the mask element
            Ext.defer(function() {
                me.setCorrectMaskZIndex(true);
            }, 10);

            this.actWorkflowConfirm(
                employeeId,
                criterion.Consts.WORKFLOW_TYPE_CODE.TIMESHEET,
                false,
                i18n.gettext('Do you want to recall this timesheet?'),
                i18n.gettext('Recall'),
                {
                    noSignature : record.get('timesheetStatusCode') !== WORKFLOW_STATUSES.APPROVED
                }
            ).then(function(signature) {
                let jsonData;

                me.setCorrectMaskZIndex(false);

                if (signature) {
                    jsonData = {
                        signature : signature
                    };
                }

                view.setLoading(true);
                vm.set('blockedState', true);

                criterion.Api.requestWithPromise({
                    url : Ext.util.Format.format(
                        criterion.consts.Api.API.EMPLOYEE_TIMESHEET_RECALL,
                        record.getId()
                    ) + '?employeeId=' + employeeId,
                    method : 'PUT',
                    jsonData : jsonData
                }).then({
                    success : function(result) {
                        vm.set('blockedState', false);
                        me.fireViewEvent('afterSave');
                        view.close();
                    },
                    failure : function() {
                        criterion.Utils.toast(i18n.gettext('Something went wrong.'));
                        vm.set('blockedState', false);
                    }
                }).always(function() {
                    view.setLoading(false);
                });
            });
        },

        _checkFTE : function(isFTE, timesheetRecord, actionText) {
            let dfd = Ext.create('Ext.Deferred');

            if (isFTE) {
                let timesheetTasks = timesheetRecord && timesheetRecord.timesheetTasks();

                if (Ext.Number.parseFloat(timesheetTasks.sum('fte').toFixed(2)) > 1) {
                    criterion.Msg.confirm(
                        i18n.gettext('Warning'),
                        i18n.gettext('Total FTE exceeds 1.0.') + ' ' + actionText,
                        function(btn) {
                            if (btn === 'yes') {
                                dfd.resolve();
                            }
                        }
                    )
                } else {
                    dfd.resolve();
                }
            } else {
                dfd.resolve();
            }

            return dfd.promise;
        },

        prepareTimesheet : function(timesheetRecord) {
            let vm = this.getViewModel(),
                timesheetRecordId = timesheetRecord.getId(),
                replacedTimesheetTasks = [],
                timesheetTasks = timesheetRecord.timesheetTasks();

            if (vm.get('managerMode')) {
                timesheetRecord.getProxy().setUrl(criterion.consts.Api.API.EMPLOYEE_SUBORDINATE_TIMESHEET_AGGREGATE);
            } else {
                timesheetRecord.getProxy().setUrl(criterion.consts.Api.API.EMPLOYEE_TIMESHEET_AGGREGATE);
            }

            timesheetTasks.each(function(timesheetTask) {
                if (!timesheetTask.phantom && timesheetTask.get('paycodeChanged')) {
                    let replacedTimesheetTask = timesheetTask.copy(null);

                    replacedTimesheetTask.set({
                        timesheetId : timesheetRecordId,
                        paycodeDetail : timesheetTask.get('paycodeDetail')
                    });

                    replacedTimesheetTasks.push(replacedTimesheetTask);

                    timesheetTask.drop();
                }
            });

            timesheetTasks.add(replacedTimesheetTasks);
        },

        onSave : function() {
            if (this.hasInvalidFields()) {
                return
            }

            let me = this,
                view = this.getView(),
                vm = this.getViewModel(),
                timesheetRecord = vm.get('timesheetRecord'),
                isFTE = this.getViewModel().get('isFTE');

            this._checkFTE(isFTE, timesheetRecord, i18n.gettext('Do you want to save this timesheet?')).then(() => {
                view.setLoading(true);
                vm.set('blockedState', true);

                me.prepareTimesheet(timesheetRecord);

                timesheetRecord.saveWithPromise().then({
                    scope : me,
                    success : function() {
                        vm.set('blockedState', false);
                        me.load();
                    },
                    failure : function() {
                        criterion.Utils.toast(i18n.gettext('Something went wrong.'));
                        vm.set('blockedState', false);
                    }
                }).always(function() {
                    view.setLoading(false);
                })
            });
        },

        handleSaveAndClose : function() {
            if (this.hasInvalidFields()) {
                return
            }

            let me = this,
                view = this.getView(),
                vm = this.getViewModel(),
                timesheetRecord = vm.get('timesheetRecord'),
                isFTE = this.getViewModel().get('isFTE');

            this._checkFTE(isFTE, timesheetRecord, i18n.gettext('Do you want to save this timesheet?')).then(() => {
                view.setLoading(true);
                vm.set('blockedState', true);

                me.prepareTimesheet(timesheetRecord);

                timesheetRecord.saveWithPromise().then({
                    scope : me,
                    success : function() {
                        vm.set('blockedState', false);
                        me.fireViewEvent('afterSave');
                        view.close();
                    },
                    failure : function() {
                        criterion.Utils.toast(i18n.gettext('Something went wrong.'));
                        vm.set('blockedState', false);
                    }
                }).always(function() {
                    view.setLoading(false);
                })
            });
        },

        getEmployeeId : function() {
            return this.getViewModel().get('timesheetRecord.employeeId');
        },

        load : function(persistRecord) {
            let view = this.getView(),
                me = this,
                vm = this.getViewModel(),
                incomeCodes = vm.getStore('incomeCodes'),
                employeeId = this.getEmployeeId(),
                timesheetId = vm.get('timesheetId'),
                viewDetailOnly = view.viewDetailOnly,
                availableTasks = vm.getStore('availableTasks'),
                availableProjects = vm.getStore('availableProjects'),
                workLocations = vm.getStore('workLocations'),
                availableAssignments = vm.getStore('availableAssignments'),
                codeDataStore = criterion.CodeDataManager.getStore(criterion.consts.Dict.DATA_TYPE),
                promises = [],
                timesheetRecord,
                delegatedByEmployeeId = vm.get('delegatedByEmployeeId');

            view.setLoading(true);
            vm.set('blockedState', true);

            vm.set('viewDetailOnly', viewDetailOnly);

            if (vm.get('managerMode')) {
                // override for support editing by manager
                incomeCodes.getProxy().setUrl(criterion.consts.Api.API.EMPLOYEE_SUBORDINATE_TIMESHEET_AVAILABLE_INCOME_CODES);
                availableTasks.getProxy().setUrl(criterion.consts.Api.API.EMPLOYEE_SUBORDINATE_TIMESHEET_AVAILABLE_TASKS);
                availableProjects.getProxy().setUrl(criterion.consts.Api.API.EMPLOYEE_SUBORDINATE_TIMESHEET_AVAILABLE_PROJECTS);
            } else {
                // default mode
                incomeCodes.getProxy().setUrl(criterion.consts.Api.API.EMPLOYEE_TIMESHEET_INCOME_CODES);
                availableTasks.getProxy().setUrl(criterion.consts.Api.API.EMPLOYEE_TIMESHEET_AVAILABLE_TASKS);
                availableProjects.getProxy().setUrl(criterion.consts.Api.API.EMPLOYEE_TIMESHEET_AVAILABLE_PROJECTS);
            }

            !view.viewDetailOnly && promises.push(
                me.loadWorkflowData(employeeId, criterion.Consts.WORKFLOW_TYPE_CODE.TIMESHEET),
                workLocations.loadWithPromise({
                    params : {
                        employeeId : employeeId
                    }
                }),
                availableTasks.loadWithPromise({
                    params : {
                        timesheetId : timesheetId
                    }
                }),
                availableProjects.loadWithPromise({
                    params : {
                        timesheetId : timesheetId
                    }
                }),
                availableAssignments.loadWithPromise({
                    params : {
                        timesheetId : timesheetId
                    }
                }),
                vm.getStore('workLocationAreas').loadWithPromise()
            );

            promises.push(
                incomeCodes.loadWithPromise({
                    params : Ext.Object.merge(
                        {
                            timesheetId : timesheetId,
                            incomePaycodesOnly : true
                        },
                        (delegatedByEmployeeId ? {delegatedByEmployeeId : delegatedByEmployeeId} : {})
                    )
                })
            );

            if (!codeDataStore.isLoaded() && !codeDataStore.isLoading()) {
                promises.push(criterion.CodeDataManager.load([criterion.consts.Dict.DATA_TYPE]));
            }

            Ext.Deferred.all(promises).then(function() {
                if (persistRecord) {
                    me.loadTimesheet(vm.get('timesheetRecord'), viewDetailOnly, workLocations, availableAssignments, availableTasks)
                } else {
                    timesheetRecord = Ext.create('criterion.model.employee.timesheet.Aggregate', {
                        id : timesheetId
                    });

                    if (vm.get('managerMode')) {
                        timesheetRecord.getProxy().setUrl(criterion.consts.Api.API.EMPLOYEE_SUBORDINATE_TIMESHEET_AGGREGATE);
                    } else {
                        timesheetRecord.getProxy().setUrl(criterion.consts.Api.API.EMPLOYEE_TIMESHEET_AGGREGATE);
                    }

                    timesheetRecord.loadWithPromise().then(function() {
                        me.loadTimesheet(timesheetRecord, viewDetailOnly, workLocations, availableAssignments, availableTasks)
                    })
                }
            }).otherwise(function() {
                view.setLoading(false);
            });
        },

        loadTimesheet : function(timesheetRecord, viewDetailOnly, workLocations, availableAssignments, availableTasks) {
            let me = this,
                vm = me.getViewModel(),
                timesheetTasks = timesheetRecord.timesheetTasks(),
                timesheetStatusCode = timesheetRecord.get('timesheetStatusCode'),
                isOwnTimesheet = timesheetRecord.get('employeeId') === criterion.Api.getEmployeeId(),
                isEditable = timesheetStatusCode === criterion.Consts.WORKFLOW_STATUSES.NOT_SUBMITTED
                    || timesheetStatusCode === criterion.Consts.WORKFLOW_STATUSES.REJECTED,
                showSubmitTimesheet = isEditable,

                timesheetType = timesheetRecord && timesheetRecord.getTimesheetType && timesheetRecord.getTimesheetType(),
                isFTE = timesheetType && timesheetType.get('isFTE'),
                customFieldsTitles = {},
                customFieldsTitlesCleaner = {};

            //Prevent quick browser's back button clicks ¯\_(ツ)_/¯
            if (me.destroyed) {
                return;
            }

            //Clean Custom Fields Titles
            Ext.Array.each(criterion.Utils.range(1, 4), function(index) {
                customFieldsTitlesCleaner[Ext.String.format('customField{0}Title', index)] = '';
            });
            vm.set(customFieldsTitlesCleaner);

            //Prepare and set Custom Fields Titles
            Ext.Array.each(timesheetRecord.get('customFields'), function(customFieldConf, index) {
                if (!customFieldConf) {
                    return;
                }

                let customField = criterion.model.CustomData.loadData(customFieldConf);

                customFieldsTitles[Ext.String.format('customField{0}Title', index + 1)] = customField.get('isHidden') ? '' : customField.get('label')
            });

            vm.set(Ext.apply(
                {
                    timesheetRecord : timesheetRecord,
                    isEditable : isEditable,
                    showSubmitTimesheet : showSubmitTimesheet,
                    isOwnTimesheet : isOwnTimesheet,
                    isFTE : isFTE,
                    totalFTE : timesheetTasks.sum('fte')
                },
                customFieldsTitles
            ));

            me.getWorkflowRelatedParams(timesheetRecord);
            Ext.defer(function() {
                me.createComponents(timesheetRecord, isEditable, isFTE, viewDetailOnly);
                vm.set('blockedState', false);
            }, 100);
        },

        getWorkflowRelatedParams : function(timesheetRecord) {
            if (!this.getView().isWorkflowView) {
                return;
            }

            this.getViewModel().set({
                overrideHasMultiAssignments : !timesheetRecord.get('hasOneAssignment'),
                overrideHasMultiLocations : !timesheetRecord.get('hasOneEmployeeWorkLocation')
            });
        },

        createComponents : function(timesheetRecord, isEditable, isFTE, viewDetailOnly) {
            let me = this,
                view = this.getView(),
                tasksContainer = this.lookup('tasksContainer'),
                tasksContainerWrap = this.lookup('tasksContainerWrap'),
                tasksFTEHours = this.lookup('tasksFTEHours'),
                timesheetHeader = this.lookup('timesheetHeader'),
                timesheetFTEHoursHeader = this.lookup('timesheetFTEHoursHeader'),
                taskComponents = [],
                taskFTEHoursComponents = [],
                timesheetTasks = timesheetRecord.timesheetTasks(),
                customFields = timesheetRecord.get('customFields'),
                allIncomeCodes = this.getViewModel().get('incomeCodes'),
                incomeCodes = Ext.create('criterion.store.employee.timesheet.Incomes', {
                    filters : [
                        {
                            property : 'paycode',
                            value : criterion.Consts.PAYCODE.INCOME,
                            exactMatch : true
                        }
                    ]
                });

            allIncomeCodes.cloneToStore(incomeCodes);

            tasksContainer.removeAll();
            tasksFTEHours.removeAll();

            timesheetTasks.each(function(timesheetTask) {
                if (!timesheetTask.get('isIncome')) {
                    return
                }

                let timesheetTaskId = timesheetTask.getId(),
                    isTaskDisabled = timesheetTask.get('isApplicableToApprover') === false,
                    isIncome = timesheetTask.get('isIncome');

                taskComponents.push({
                    xtype : 'criterion_employee_timesheet_aggregate_task',
                    taskId : timesheetTaskId,
                    cls : isTaskDisabled ? 'timesheet-task-disabled' : null,
                    hidden : true,
                    editable : isEditable,
                    canChangePaycode : isEditable || isIncome,
                    taskDisabled : isTaskDisabled,
                    timesheetTask : timesheetTask,
                    timesheetRecord : timesheetRecord,
                    customFields : customFields,
                    isFTE : isFTE,
                    viewDetailOnly : viewDetailOnly,
                    viewModel : {
                        data : {
                            timesheetTask : timesheetTask
                        },
                        stores : {
                            incomes : !timesheetTask.phantom && isIncome ? incomeCodes : allIncomeCodes
                        }
                    }
                });

                taskFTEHoursComponents.push({
                    xtype : 'criterion_employee_timesheet_aggregate_task_fte_hours',
                    taskId : timesheetTaskId,
                    cls : isTaskDisabled ? 'timesheet-task-disabled' : null,
                    hidden : true,
                    editable : isEditable,
                    timesheetTask : timesheetTask,
                    isFTE : isFTE,
                    viewModel : {
                        data : {
                            timesheetTask : timesheetTask
                        }
                    }
                });
            });

            let addedTaskComponents = tasksContainer.add(taskComponents),
                addedTaskFTEHoursComponents = tasksFTEHours.add(taskFTEHoursComponents);

            Ext.defer(function() {
                //Prevent fields on-the-fly resizing (against viewModel settings)
                Ext.Array.each(addedTaskComponents, function(taskComponent) {
                    taskComponent.show();
                });
                Ext.Array.each(addedTaskFTEHoursComponents, function(taskFTEHoursComponent) {
                    taskFTEHoursComponent.show();
                });

                timesheetHeader.show();
                timesheetFTEHoursHeader.show();
                tasksContainer.detectTaskChanges = true;
                view.setLoading(false);
            }, 10);

            timesheetTasks.on('remove', function(store, records) {
                let recordId = records[0].getId(),
                    taskComponent = tasksContainer.down('criterion_employee_timesheet_aggregate_task[taskId=' + recordId + ']'),
                    taskFTEHoursComponent = tasksFTEHours.down('criterion_employee_timesheet_aggregate_task_fte_hours[taskId=' + recordId + ']');

                tasksContainer.remove(taskComponent);
                tasksFTEHours.remove(taskFTEHoursComponent);
                me.addEmptyHoldersIfRequired(tasksContainer, tasksFTEHours, isEditable);
            });

            this.addEmptyHoldersIfRequired(tasksContainer, tasksFTEHours, isEditable);

            Ext.defer(function() {
                tasksContainerWrap.fireEvent('resize', tasksContainerWrap);
            }, 100);
        },

        addEmptyHoldersIfRequired : function(tasksContainer, tasksFTEHours, isEditable) {
            if (!tasksContainer.items.getCount()) {
                tasksContainer.add({
                    xtype : 'container',
                    scrollable : 'vertical',
                    layout : {
                        type : 'vbox',
                        align : 'center',
                        pack : 'center'
                    },
                    width : '100%',
                    height : '100%',
                    reference : 'emptyListHolder',
                    items : isEditable ? [
                        {
                            xtype : 'component',
                            cls : 'empty-list',
                            width : 329,
                            height : 329
                        },
                        {
                            xtype : 'component',
                            cls : 'empty-list-text',
                            html : i18n.gettext('Click "ADD" to create a new row and enter time')
                        }
                    ] : []
                });

                tasksFTEHours.add({
                    xtype : 'component',
                    width : '100%',
                    height : '100%',
                    reference : 'emptyFTEHolder'
                });
            }
        },

        addNewTask : function() {
            let me = this,
                vm = this.getViewModel(),
                incomes = vm.get('incomeCodes'),
                workLocations = vm.get('workLocations'),
                availableAssignments = vm.get('availableAssignments'),
                timesheetRecord = vm.get('timesheetRecord'),
                timesheetType = timesheetRecord.getTimesheetType(),
                managerMode = vm.get('managerMode'),
                isEnterTimeoff = timesheetType.get('isEnterTimeoff'),
                isEnterHoliday = timesheetType.get('isEnterHoliday'),
                incomeStore = Ext.create('criterion.store.employee.timesheet.Incomes', {
                    filters : [
                        function(income) {
                            let allowTimeOff = true,
                                allowHoliday = true;

                            if (income.get('paycode') === criterion.Consts.PAYCODE.TIME_OFF && !isEnterTimeoff && !managerMode) {
                                allowTimeOff = false;
                            }

                            if (income.get('paycode') === criterion.Consts.PAYCODE.HOLIDAY && !isEnterHoliday && !managerMode) {
                                allowHoliday = false;
                            }

                            return income && allowTimeOff && allowHoliday;
                        }
                    ]
                }),
                customFields = timesheetRecord.get('customFields'),
                tasksContainer = this.lookup('tasksContainer'),
                tasksContainerWrap = this.lookup('tasksContainerWrap'),
                tasksFTEHours = this.lookup('tasksFTEHours'),
                errors = [],
                timesheetTask,
                timesheetTaskId,
                addRowFormItems = [],
                isFTE = vm.get('isFTE'),
                hasMultiLocations = vm.get('hasMultiLocations'),
                hasMultiAssignments = vm.get('hasMultiAssignments'),
                workLocationAreasData = vm.get('workLocationAreas').getRange(),
                taskRef = 'taskCombo_' + criterion.Utils.generateRndString(10);

            incomes.cloneToStore(incomeStore);

            !incomes.count() && errors.push(i18n.gettext('No Income Codes found.'));
            !workLocations.count() && errors.push(i18n.gettext('No Work Locations found.'));
            !availableAssignments.count() && errors.push(i18n.gettext('No Assignments found.'));

            let defaultAssignment = availableAssignments.findRecord('isPrimary', true) || availableAssignments.getAt(0),
                defaultIncome = incomes.findRecord('isDefault', true) || incomes.getAt(0),
                defaultWorkLocation = workLocations.findRecord('isPrimary', true) || workLocations.getAt(0),
                defaultWorkLocationId = defaultWorkLocation.get('employerWorkLocationId');

            if (errors.length) {
                criterion.Msg.error({
                    title : i18n.gettext('Task can not be added.'),
                    message : errors.join('<br>')
                });

                return;
            }

            timesheetTask = Ext.create('criterion.model.employee.timesheet.aggregate.Task', {
                timesheetId : timesheetRecord.getId(),
                paycodeDetail : defaultIncome.getData(),
                paycode : defaultIncome.get('paycode'),
                assignmentId : defaultAssignment.get('assignmentId'),
                employerWorkLocationId : defaultWorkLocation.get('employerWorkLocationId')
            });

            timesheetTaskId = timesheetTask.getId();

            let rowVm = Ext.create('Ext.app.ViewModel', {
                data : {
                    timesheetTask : timesheetTask,
                    timesheet : timesheetRecord
                }
            });

            addRowFormItems.push(
                {
                    xtype : 'criterion_employee_timesheet_income_combo',
                    fieldLabel : i18n.gettext('Paycode'),
                    store : incomeStore,
                    value : defaultIncome.getId(),
                    listeners : {
                        change : function(cmp, value) {
                            timesheetTask.set('paycodeDetail', cmp.getStore().getById(value).getData());
                        }
                    }
                }
            );

            if (hasMultiLocations || vm.get('timesheetRecord.timesheetType.isShowWorkLocation')) {
                addRowFormItems.push(
                    {
                        xtype : 'combo',
                        fieldLabel : vm.get('timesheetRecord.timesheetType.labelWorkLocation') || i18n.gettext('Location'),
                        reference : 'workLocation',
                        store : workLocations,
                        queryMode : 'local',
                        valueField : 'employerWorkLocationId',
                        displayField : 'employerLocationName',
                        allowBlank : false,
                        value : defaultWorkLocationId,
                        anyMatch : true,
                        bind : {
                            value : '{timesheetTask.employerWorkLocationId}'
                        }
                    }
                );
            }

            if (vm.get('timesheetRecord.timesheetType.isShowWorkArea')) {
                addRowFormItems.push(
                    {
                        xtype : 'combo',
                        fieldLabel : vm.get('timesheetRecord.timesheetType.labelWorkArea') || i18n.gettext('Area'),
                        store : {
                            type : 'work_location_areas',
                            data : workLocationAreasData
                        },
                        forceSelection : true,
                        bind : {
                            filters : [
                                {
                                    property : 'workLocationId',
                                    value : '{workLocation.selection.workLocationId}',
                                    exactMatch : true
                                }
                            ]
                        },
                        queryMode : 'local',
                        valueField : 'id',
                        displayField : 'name',
                        listeners : {
                            change : function(cmp, value) {
                                timesheetTask.set('workLocationAreaId', value);
                            }
                        }
                    }
                );
            }

            if (vm.get('timesheetRecord.timesheetType.isShowProject')) {
                addRowFormItems.push(
                    {
                        xtype : 'combo',
                        fieldLabel : vm.get('timesheetRecord.timesheetType.labelProject') || i18n.gettext('Project'),
                        store : {
                            type : 'criterion_employee_timesheet_available_projects',

                            data : vm.getStore('availableProjects').getRange()
                        },
                        valueField : 'id',
                        displayField : 'name',
                        queryMode : 'local',
                        bind : {
                            value : '{timesheetTask.projectId}'
                        }
                    }
                );
            }

            if (vm.get('timesheetRecord.timesheetType.isShowTasks')) {
                addRowFormItems.push(
                    {
                        xtype : 'combo',
                        fieldLabel : vm.get('timesheetRecord.timesheetType.labelTask') || i18n.gettext('Task'),
                        ref : 'tasksCombo',
                        store : {
                            type : 'criterion_employee_timesheet_available_tasks',
                            data : vm.getStore('availableTasks').getRange()
                        },
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
                                        let projectId = rowVm.get('timesheetTask.projectId'),
                                            workLocationAreaId = rowVm.get('timesheetTask.workLocationAreaId'),
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
                        queryMode : 'local'
                    }
                );
            }

            if (hasMultiAssignments || vm.get('timesheetRecord.timesheetType.isShowAssignment')) {
                addRowFormItems.push(
                    {
                        xtype : 'combo',
                        fieldLabel : vm.get('timesheetRecord.timesheetType.labelAssignment') || i18n.gettext('Assignment'),
                        store : availableAssignments,
                        valueField : 'assignmentId',
                        displayField : 'title',
                        queryMode : 'local',
                        allowBlank : false,
                        bind : {
                            value : '{timesheetTask.assignmentId}'
                        }
                    }
                );
            }

            Ext.Array.each(criterion.Utils.range(1, 4), function(index) {
                let customFieldConf = customFields[index - 1];

                if (customFieldConf) {
                    let customField = criterion.model.CustomData.loadData(customFieldConf),
                        fieldName = Ext.String.format('customValue{0}', index),
                        value = timesheetTask.get(fieldName),
                        cmp = Ext.merge({
                            fieldLabel : customField.get('label'),

                            value : value,

                            bind : Ext.apply({}, criterion.Utils.getCustomFieldBindFilters(customField, 'timesheetTask', rowVm, taskRef)),

                            listeners : {
                                change : function(cmp, value) {
                                    timesheetTask.set(fieldName, value)
                                }
                            }
                        }, criterion.Utils.getCustomFieldEditorConfig(customField, value, timesheetTask, fieldName));

                    addRowFormItems.push(cmp);
                }
            });

            addRowFormItems.push({
                xtype : 'component',
                autoEl : 'hr',
                cls : 'criterion-horizontal-ruler',
                margin : '0 35 23 15'
            });

            addRowFormItems.push({
                xtype : 'container',

                layout : 'hbox',

                items : [
                    isFTE ? {
                        xtype : 'numberfield',
                        fieldLabel : i18n.gettext('FTE'),
                        width : criterion.Consts.UI_DEFAULTS.LABEL_WIDE_WIDTH + 120,
                        labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDE_WIDTH,
                        bind : {
                            value : '{timesheetTask.fte}'
                        }
                    } : {
                        xtype : 'numberfield',
                        fieldLabel : i18n.gettext('Hours'),
                        width : criterion.Consts.UI_DEFAULTS.LABEL_WIDE_WIDTH + 120,
                        labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDE_WIDTH,
                        decimalPrecision : 5,
                        bind : {
                            value : '{timesheetTask.totalHours}'
                        }
                    },
                    {
                        xtype : 'tbfill'
                    }
                ]
            });

            Ext.create('criterion.ux.form.Panel', {

                title : i18n.gettext('Add Timesheet Row'),

                plugins : [
                    {
                        ptype : 'criterion_sidebar',
                        modal : true,
                        height : 500,
                        width : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_WIDTH
                    }
                ],

                viewModel : rowVm,

                scrollable : 'vertical',

                alwaysOnTop : true,

                defaults : criterion.Consts.UI_CONFIG.ONE_COL_FORM_WIDE,

                items : addRowFormItems,

                buttons : [
                    {
                        xtype : 'button',
                        ui : 'light',
                        text : i18n.gettext('Close'),
                        handler : function(cmp) {
                            cmp.up('criterion_form').close();
                            me.setCorrectMaskZIndex(false);
                        }
                    },
                    ' ',
                    {
                        xtype : 'button',

                        text : i18n.gettext('Add'),

                        handler : function(cmp) {
                            let emptyListHolder = tasksContainer.down('[reference=emptyListHolder]'),
                                emptyFTEHolder = tasksFTEHours.down('[reference=emptyFTEHolder]');

                            timesheetRecord.timesheetTasks().add(timesheetTask);

                            tasksContainer.add({
                                xtype : 'criterion_employee_timesheet_aggregate_task',
                                taskId : timesheetTaskId,
                                hasMultiLocations : vm.get('hasMultiLocations'),
                                hasMultiAssignments : vm.get('hasMultiAssignments'),
                                customFields : customFields,
                                timesheetRecord : timesheetRecord,
                                timesheetTask : timesheetTask,
                                isFTE : vm.get('isFTE'),

                                viewModel : {
                                    data : {
                                        timesheetTask : timesheetTask
                                    },
                                    stores : {
                                        incomes : incomeStore
                                    }
                                }
                            });

                            emptyListHolder && tasksContainer.remove(emptyListHolder);
                            emptyFTEHolder && tasksFTEHours.remove(emptyFTEHolder);

                            tasksFTEHours.add({
                                xtype : 'criterion_employee_timesheet_aggregate_task_fte_hours',
                                taskId : timesheetTaskId,
                                timesheetTask : timesheetTask,
                                isFTE : vm.get('isFTE'),

                                viewModel : {
                                    data : {
                                        timesheetTask : timesheetTask
                                    }
                                }
                            });

                            Ext.defer(function() {
                                tasksContainerWrap.fireEvent('resize', tasksContainerWrap);
                            }, 100);

                            cmp.up('criterion_form').close();
                            me.setCorrectMaskZIndex(false);
                        }
                    }
                ]
            }).show();

            me.setCorrectMaskZIndex(true);
        },

        removeTask : function(timesheetTask) {
            let vm = this.getViewModel(),
                timesheet = vm.get('timesheetRecord'),
                tasksContainer = this.lookup('tasksContainer');

            tasksContainer.remove(tasksContainer.down('[taskId=' + timesheetTask.getId() + ']'));

            timesheet.timesheetTasks().remove(timesheetTask);
        },

        submit : function() {
            if (this.hasInvalidFields()) {
                return
            }

            let view = this.getView(),
                vm = this.getViewModel(),
                timesheetRecord = vm.get('timesheetRecord'),
                employeeId = timesheetRecord.get('employeeId'),
                isFTE = vm.get('isFTE'),
                me = this;

            // delay for correct find the mask element
            Ext.defer(function() {
                me.setCorrectMaskZIndex(true);
            }, 10);

            this.actWorkflowConfirm(employeeId, criterion.Consts.WORKFLOW_TYPE_CODE.TIMESHEET).then(function(signature) {
                let jsonData;

                me.setCorrectMaskZIndex(false);

                if (signature) {
                    jsonData = {
                        signature : signature
                    };
                }

                me._checkFTE(
                    isFTE,
                    timesheetRecord,
                    i18n.gettext('Do you want to submit this timesheet?')
                ).then(() => {
                    view.setLoading(true);
                    vm.set('blockedState', true);

                    timesheetRecord.saveWithPromise().then(function() {
                        criterion.Api.requestWithPromise({
                            url : criterion.consts.Api.API.EMPLOYEE_TIMESHEET_SUBMIT + '?timesheetId=' + timesheetRecord.getId() + '&employeeId=' + employeeId,
                            method : 'PUT',
                            jsonData : jsonData
                        }).then({
                            success : function() {
                                vm.set('blockedState', false);
                                me.fireViewEvent('afterSave');
                                view.close();
                            },
                            failure : function() {
                                criterion.Utils.toast(i18n.gettext('Something went wrong.'));
                                vm.set('blockedState', false);
                            }
                        }).always(function() {
                            view.setLoading(false);
                        })
                    }).otherwise(function() {
                        view.setLoading(false);
                    });
                });
            });

        },

        hasInvalidFields : function() {
            return criterion.Utils.hasInvalidFields(this.getView().query('field'));
        },

        onAfterRenderTimesheet : function() {
            let tasksContainer = this.lookup('tasksContainer'),
                tasksFTEHours = this.lookup('tasksFTEHours'),
                timesheetHeader = this.lookup('timesheetHeader');

            tasksFTEHours.getScrollable().on('scroll', function(cmp, x, y) {
                if (y >= 0) {
                    tasksContainer.getScrollable().suspendEvent('scroll');
                    tasksContainer.scrollTo(null, y);
                    Ext.defer(function() {
                        tasksContainer.getScrollable().resumeEvent('scroll');
                    }, 1000);
                }
            });

            tasksContainer.getScrollable().on('scroll', function(cmp, x, y) {
                if (!Ext.isDefined(timesheetHeader.initialX)) {
                    timesheetHeader.initialX = timesheetHeader.getX();
                }

                timesheetHeader.setX(timesheetHeader.initialX - x);

                if (y >= 0) {
                    tasksFTEHours.getScrollable().suspendEvent('scroll');
                    tasksFTEHours.scrollTo(null, y);
                    Ext.defer(function() {
                        tasksFTEHours.getScrollable().resumeEvent('scroll');
                    }, 1000);
                }
            });
        },

        onTasksContainerWrapResize : function(cmp) {
            let timesheetHeader = this.lookup('timesheetHeader'),
                tasksFTEHours = this.lookup('tasksFTEHours'),
                tasksContainer = this.lookup('tasksContainer'),
                tasksContainerWrapWidth = cmp.getWidth(),
                domEl, clientWidth, offsetWidth, clientHeight, offsetHeight;

            timesheetHeader.setWidth(tasksContainer.getWidth());

            if (!tasksContainer.el) {
                return;
            }

            domEl = tasksContainer.el.dom;
            clientWidth = domEl.clientWidth;
            offsetWidth = domEl.offsetWidth;
            clientHeight = domEl.clientHeight;
            offsetHeight = domEl.offsetHeight;

            tasksContainer.items.each(function(taskRow) {
                let tasksRowWidth = 0;

                taskRow && taskRow.items && taskRow.items.each(function(item) {
                    if (item.isVisible()) {
                        tasksRowWidth += item.getWidth() + 20;
                    }
                });

                taskRow && taskRow.setWidth(tasksRowWidth > tasksContainerWrapWidth ? tasksRowWidth : '100%');
            });

            tasksFTEHours.setStyle('padding-bottom', offsetHeight - clientHeight + 'px');
            tasksFTEHours.updateLayout();

            if (clientWidth !== offsetWidth) {
                tasksContainerWrapWidth += offsetWidth - clientWidth;
            }

            tasksContainer.setWidth(tasksContainerWrapWidth);
        },

        init : function() {
            let view = this.getView();

            this.callParent(arguments);

            if (!view.viewDetailOnly) {
                Ext.GlobalEvents.on('beforeHideForm', function() {
                    if (view) {
                        view._preventReRoute = true;
                        view.destroy();
                    }
                }, this, {
                    buffer : 1,
                    single : true
                });
            }
        }
    };

});

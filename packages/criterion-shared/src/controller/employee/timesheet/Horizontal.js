Ext.define('criterion.controller.employee.timesheet.Horizontal', function() {

    const WORKFLOW_STATUSES = criterion.Consts.WORKFLOW_STATUSES;

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_employee_timesheet_horizontal',

        requires : [
            'criterion.view.employee.SubmitConfirm'
        ],

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex',
            'criterion.controller.employee.timesheet.mixin.NotesHandler',
            'criterion.controller.employee.timesheet.mixin.SummaryHandler',
            'criterion.controller.employee.timesheet.mixin.ManagerOptionsHandler',
            'criterion.controller.mixin.WorkflowConfirmation',
            'criterion.store.workLocation.Areas',
            'criterion.store.employee.timesheet.AvailableTasks',
            'criterion.store.employee.timesheet.AvailableProjects',
            'criterion.model.CustomData'
        ],

        config : {
            closeAfterSave : true
        },

        onToggleDetails : function() {
            let vm = this.getViewModel();

            vm.set('showTotals', !vm.get('showTotals'));
        },

        onAddTask : function() {
            this.addNewTask();
        },

        onCancel : function() {
            this.getViewModel().get('timesheetRecord').reject();
            this.fireViewEvent('editorCancel');
            this.getView().close();
        },

        onSubmitTimesheet : function() {
            if (this.hasInvalidFields()) {
                return
            }

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

        onSave : function() {
            if (this.hasInvalidFields()) {
                return
            }

            let me = this,
                view = this.getView(),
                vm = this.getViewModel();

            view.setLoading(true);
            vm.set('blockedState', true);

            this.save()
            .then(() => {
                vm.set('blockedState', false);
                view.setLoading(false);

                me.load();
            }, () => {
                vm.set('blockedState', false);
                view.setLoading(false);
            });
        },

        handleSaveAndClose : function() {
            if (this.hasInvalidFields()) {
                return
            }

            let view = this.getView(),
                vm = this.getViewModel();

            view.setLoading(true);
            vm.set('blockedState', true);

            this.save()
                .then({
                    scope : this,
                    success : function() {
                        view.setLoading(false);
                        vm.set('blockedState', false);
                        this.fireViewEvent('afterSave');
                    },
                    failure : function() {
                        view.setLoading(false);
                        criterion.Utils.toast(i18n.gettext('Something went wrong.'));
                        vm.set('blockedState', false);
                    }
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
                availableTasks = vm.getStore('availableTasks'),
                availableProjects = vm.getStore('availableProjects'),
                promises = [],
                timesheetHorizontal,
                delegatedByEmployeeId = vm.get('delegatedByEmployeeId'),
                codeDataStore = criterion.CodeDataManager.getStore(criterion.consts.Dict.DATA_TYPE);

            vm.set({
                showTotals : false,
                isWorkflowView : view.isWorkflowView,
                viewDetailOnly : view.viewDetailOnly
            });

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

            vm.set('blockedState', true);

            !view.viewDetailOnly && promises.push(
                me.loadWorkflowData(employeeId, criterion.Consts.WORKFLOW_TYPE_CODE.TIMESHEET),
                vm.getStore('workLocations').loadWithPromise({
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
                vm.getStore('availableAssignments').loadWithPromise({
                    params : Ext.Object.merge(
                        {
                            timesheetId : timesheetId
                        },
                        (delegatedByEmployeeId ? {delegatedByEmployeeId : delegatedByEmployeeId} : {})
                    )
                }),
                vm.getStore('workLocationAreas').loadWithPromise()
            );

            promises.push(
                incomeCodes.loadWithPromise({
                    params : Ext.Object.merge(
                        {
                            timesheetId : timesheetId
                        },
                        (delegatedByEmployeeId ? {delegatedByEmployeeId : delegatedByEmployeeId} : {})
                    )
                })
            );

            if (!codeDataStore.isLoaded() && !codeDataStore.isLoading()) {
                promises.push(criterion.CodeDataManager.load([criterion.consts.Dict.DATA_TYPE]));
            }

            view.setLoading(true);

            Ext.Deferred.all(promises).then(function() {
                if (persistRecord) {
                    timesheetHorizontal = vm.get('timesheetRecord');

                    me.loadTimesheet(timesheetHorizontal);
                } else {
                    timesheetHorizontal = Ext.create('criterion.model.employee.Timesheet', {
                        id : timesheetId
                    });

                    if (vm.get('managerMode')) {
                        timesheetHorizontal.getProxy().setUrl(criterion.consts.Api.API.EMPLOYEE_SUBORDINATE_TIMESHEET_HORIZONTAL);
                    } else {
                        timesheetHorizontal.getProxy().setUrl(criterion.consts.Api.API.EMPLOYEE_TIMESHEET);
                    }

                    timesheetHorizontal.loadWithPromise().then(function() {
                        vm.set('timesheetRecord', timesheetHorizontal);

                        me.loadTimesheet(timesheetHorizontal);
                    });
                }
            }).otherwise(function() {
                vm.set('blockedState', false);
                view.setLoading(false);
            });
        },

        loadTimesheet : function(timesheetHorizontal) {
            let vm = this.getViewModel();

            //Prevent quick browser's back button clicks
            if (this.destroyed) {
                return;
            }

            this.getWorkflowRelatedParams(timesheetHorizontal);
            this.prepareCustomFields();
            this.createComponents();
            vm.set('blockedState', false);
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

        prepareCustomFields : function() {
            let vm = this.getViewModel(),
                customFieldsTitlesCleaner = {};

            // Clean Custom Fields Titles
            Ext.Array.each(criterion.Utils.range(1, 4), function(index) {
                customFieldsTitlesCleaner[Ext.String.format('customField{0}Title', index)] = '';
            });
            vm.set(customFieldsTitlesCleaner);

            Ext.Array.each(vm.get('timesheetRecord').get('customFields'), function(customField, index) {
                if (!customField) {
                    return;
                }

                vm.set(Ext.String.format('customField{0}Title', index + 1), customField.isHidden ? '' : customField.label);
            });
        },

        createComponents : function() {
            let vm = this.getViewModel(),
                timesheet = vm.get('timesheetRecord'),
                tasksContainer = this.lookupReference('tasksContainer'),
                taskComponents = [],
                datesLabelsContainer = this.lookupReference('datesLabels'),
                datesLabels = [],
                datesContainer = this.lookupReference('datesContainer'),
                dateComponents = [],
                incomes = vm.getStore('incomeCodes'),
                incomesOnlyIncome = Ext.create('criterion.store.employee.timesheet.Incomes', {
                    filters : [
                        {
                            property : 'paycode',
                            value : criterion.Consts.PAYCODE.INCOME,
                            exactMatch : true
                        }
                    ]
                });

            tasksContainer.removeAll();
            datesContainer.removeAll();
            datesLabelsContainer.removeAll();

            incomes.cloneToStore(incomesOnlyIncome);

            timesheet.timesheetTasks().each(function(timesheetTask) {
                let isTaskDisabled = timesheetTask.get('isApplicableToApprover') === false,
                    timesheetTaskId = timesheetTask.getId();

                taskComponents.push({
                    xtype : 'criterion_employee_timesheet_horizontal_task',
                    taskId : timesheetTaskId,
                    mouseOverAnchor : timesheetTaskId,
                    cls : isTaskDisabled ? 'task-container timesheet-task-disabled' : 'task-container',
                    viewModel : {
                        data : {
                            timesheetTask : timesheetTask
                        },
                        stores : {
                            incomes : incomes,
                            incomesOnlyIncome : incomesOnlyIncome
                        }
                    }
                });

                dateComponents.push({
                    xtype : 'criterion_employee_timesheet_horizontal_dates',
                    taskId : timesheetTaskId,
                    mouseOverAnchor : timesheetTaskId,
                    cls : isTaskDisabled ? 'days-container timesheet-task-disabled' : 'days-container',
                    viewModel : {
                        data : {
                            timesheetTask : timesheetTask
                        }
                    }
                });
            });

            tasksContainer.add(taskComponents);

            let start = new Date(timesheet.get('startDate')),
                end = new Date(timesheet.get('endDate'));

            // eslint-disable-next-line no-unmodified-loop-condition
            for (let d = start, i = 1; d <= end; d.setDate(d.getDate() + 1), i++) {
                datesLabels.push({
                    html : Ext.Date.format(d, 'd M D'),
                    bind : criterion.view.employee.timesheet.Horizontal.applySizeBinding('dateCol')
                })
            }

            datesLabelsContainer.add(datesLabels);
            datesContainer.add(dateComponents);

            this.lookup('totalsContainer').update();

            this.getView().setLoading(false);

            // wait layout to be updated
            Ext.defer(function() {
                this.onTasksContainerWrapUpdateLayout();
                this.normilizeColsWidth();
                tasksContainer.detectTaskChanges = true;
            }, 100, this);
        },

        normilizeColsWidth : function() {
            let datesContainerWrap = this.lookup('datesContainerWrap'),
                timesheetContainer = this.lookup('timesheetContainer'),
                timesheetContainerWidth = timesheetContainer && timesheetContainer.getWidth(),
                anyTaskColsContainer = timesheetContainer && timesheetContainer.down('#colsContainer'),
                anyTaskColsContainerWidth = anyTaskColsContainer && anyTaskColsContainer.getWidth();

            if (anyTaskColsContainer) {
                datesContainerWrap.setWidth(timesheetContainerWidth - anyTaskColsContainerWidth);
            }
        },

        // eslint-disable-next-line complexity
        addNewTask : function() {
            let me = this,
                vm = this.getViewModel(),
                timesheet = vm.get('timesheetRecord'),
                timesheetType = timesheet.getTimesheetType(),
                workLocations = vm.get('workLocations'),
                availableAssignments = vm.get('availableAssignments'),
                isAutopopulateHours = !vm.get('isButtonEntry') && timesheetType.get('isAutopopulateHours'),
                managerMode = vm.get('managerMode'),
                isEnterTimeoff = timesheetType.get('isEnterTimeoff'),
                isEnterHoliday = timesheetType.get('isEnterHoliday'),
                tasksContainer = this.lookupReference('tasksContainer'),
                datesContainer = this.lookupReference('datesContainer'),
                errors = [],
                timesheetTask,
                incomes = vm.get('incomeCodes'),
                incomesOnlyIncome = Ext.create('criterion.store.employee.timesheet.Incomes', {
                    filters : [
                        {
                            property : 'paycode',
                            value : criterion.Consts.PAYCODE.INCOME,
                            exactMatch : true
                        }
                    ]
                }),
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

                            return income && (income.get('hasAvailableDates') || income.get('isTrackableNow')) && allowTimeOff && allowHoliday;
                        }
                    ]
                }),
                hasMultiLocations = vm.get('hasMultiLocations'),
                hasMultiAssignments = vm.get('hasMultiAssignments'),
                customFields = timesheet.get('customFields'),
                workLocationAreasData = vm.get('workLocationAreas').getRange(),
                taskRef = 'taskCombo_' + criterion.Utils.generateRndString(10);

            incomes.cloneToStore(incomeStore);
            incomes.cloneToStore(incomesOnlyIncome);

            !incomes.count() && errors.push(i18n.gettext('No Income Codes found.'));
            !workLocations.count() && errors.push(i18n.gettext('No Work Locations found.'));
            !availableAssignments.count() && errors.push(i18n.gettext('No Assignments found.'));

            let defaultAssignment = availableAssignments.findRecord('isPrimary', true) || availableAssignments.getAt(0),
                defaultIncome = incomeStore.findRecord('isDefault', true) || incomeStore.getAt(0),
                defaultIncomeIsTimeOff = defaultIncome && defaultIncome['isTimeOff'],
                defaultWorkLocation = workLocations.findRecord('isPrimary', true) || workLocations.getAt(0),
                defaultEmployerWorkLocationId = defaultWorkLocation.get('employerWorkLocationId'),
                addRowFormItems = [];

            if (errors.length) {
                criterion.Msg.error({
                    title : i18n.gettext('Task can not be added.'),
                    message : errors.join('<br>')
                });

                return;
            }

            timesheetTask = Ext.create('criterion.model.employee.timesheet.Task', {
                timesheetId : timesheet.getId(),
                paycodeDetail : defaultIncome.getData(),
                isTimeOff : defaultIncomeIsTimeOff,
                assignmentId : defaultAssignment.get('assignmentId'),
                employerWorkLocationId : defaultEmployerWorkLocationId
            });

            let rowVm = Ext.create('Ext.app.ViewModel', {
                data : {
                    timesheetTask : timesheetTask,
                    timesheet : timesheet
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
                            let paycodeData = cmp.getStore().getById(value).getData();

                            timesheetTask.set({
                                paycodeDetail : paycodeData,
                                isTimeOff : paycodeData['isTimeOff']
                            });
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

                        value : defaultEmployerWorkLocationId,

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
                            timesheet.timesheetTasks().add(timesheetTask);

                            tasksContainer.add({
                                xtype : 'criterion_employee_timesheet_horizontal_task',
                                taskId : timesheetTask.getId(),
                                viewModel : {
                                    data : {
                                        timesheetTask : timesheetTask,
                                        isAutopopulateHours : isAutopopulateHours,
                                        autoPopulate : isAutopopulateHours ? timesheet.autoPopulate() : null
                                    },

                                    stores : {
                                        incomes : incomeStore,
                                        incomesOnlyIncome : incomesOnlyIncome
                                    }
                                }
                            });

                            datesContainer.add({
                                xtype : 'criterion_employee_timesheet_horizontal_dates',
                                taskId : timesheetTask.getId(),
                                viewModel : {
                                    data : {
                                        timesheetTask : timesheetTask
                                    }
                                }
                            });

                            cmp.up('criterion_form').close();
                            me.setCorrectMaskZIndex(false);

                            // wait layout to be updated
                            Ext.defer(function() {
                                me.normilizeColsWidth();
                            }, 300, this);
                        }
                    }
                ]
            }).show();

            me.setCorrectMaskZIndex(true);
        },

        removeTask(timesheetTask) {
            let vm = this.getViewModel(),
                timesheet = vm.get('timesheetRecord'),
                tasksContainer = this.lookupReference('tasksContainer'),
                datesContainer = this.lookupReference('datesContainer');

            tasksContainer.remove(tasksContainer.down('[taskId=' + timesheetTask.getId() + ']'));
            datesContainer.remove(datesContainer.down('[taskId=' + timesheetTask.getId() + ']'));

            timesheet.timesheetTasks().remove(timesheetTask);
        },

        startStopTask(timesheetTask) {
            let me = this,
                vm = this.getViewModel(),
                isStarted = timesheetTask.get('isStarted'),
                attestationMessage = vm.get('timesheetRecord.timesheetType.attestationMessage');

            if (isStarted && attestationMessage) {
                criterion.Msg.confirm(
                    {
                        icon : criterion.Msg.QUESTION,
                        message : attestationMessage,
                        buttons : criterion.Msg.OKCANCEL,
                        closable : false,
                        callback : btn => {
                            if (btn === 'ok') {
                                me._actStartStopTask(timesheetTask);
                            }
                        }
                    }
                );
            } else {
                this._actStartStopTask(timesheetTask);
            }
        },

        _actStartStopTask : function(timesheetTask) {
            let me = this,
                view = this.getView(),
                vm = this.getViewModel(),
                timesheet = vm.get('timesheetRecord'),
                isStarted = timesheetTask.get('isStarted'),
                dfd = Ext.create('Ext.Deferred'),
                url;

            if (timesheetTask.phantom) {
                view.setLoading(true);
                timesheetTask.saveWithPromise()
                .then(function() {
                    dfd.resolve();
                }).always(function() {
                    view.setLoading(false);
                });
            } else {
                dfd.resolve();
            }

            dfd.promise.then(function() {
                url = Ext.String.format(
                    isStarted ? criterion.consts.Api.API.EMPLOYEE_TIMESHEET_TASK_STOP : criterion.consts.Api.API.EMPLOYEE_TIMESHEET_TASK_START,
                    timesheetTask.getId()
                );

                return criterion.Api.requestWithPromise({
                    url : url,
                    method : 'GET'
                });
            }).then(function() {
                timesheet.timesheetTasks().each(function(timesheetTask) {
                    timesheetTask.set('isStarted', false);
                });
                timesheetTask.set('isStarted', !isStarted);

                if (isStarted) {
                    // reload data after stop
                    me.load();
                }
            });
        },

        save : function() {
            let vm = this.getViewModel(),
                timesheet = vm.get('timesheetRecord'),
                timesheetTasks = [],
                url,
                availableAssignments = vm.get('availableAssignments');

            timesheet.timesheetTasks().each(function(task) {
                if (availableAssignments.find('assignmentId', task.get('assignmentId'), 0, false, false, true) === -1) {
                    return;
                }

                if (task.needSync() || task.dirty) {
                    let notValidDetails = [];

                    task.timesheetTaskDetails().each(function(taskDetail) {
                        if (taskDetail.get('isBlockedInCurrentPaycode')) {
                            notValidDetails.push(taskDetail);
                        }
                    });

                    task.timesheetTaskDetails().remove(notValidDetails);

                    if (task.get('paycodeChanged')) {
                        let replacedTask = task.copy(null),
                            replacedTaskId = replacedTask.getId(),
                            replacedTaskDetails = replacedTask.timesheetTaskDetails();

                        replacedTask.setPaycodeDetail(task.getPaycodeDetail());

                        replacedTaskDetails.add(task.timesheetTaskDetails().getRange());

                        replacedTaskDetails.each(function(detail) {
                            detail.set('timesheetTaskId', replacedTaskId);
                        });

                        timesheetTasks.push(replacedTask.getData({
                            serialize : true,
                            associated : true
                        }));

                        task.drop();

                    } else {
                        timesheetTasks.push(task.getData({
                            serialize : true,
                            associated : true
                        }));

                    }
                }
            });

            Ext.Array.each(timesheet.timesheetTasks().getRemovedRecords(), function(timesheetTask) {
                let timesheetTaskData = timesheetTask.getData();

                timesheetTaskData['$delete'] = true;

                timesheetTasks.push(timesheetTaskData);
            });

            if (vm.get('managerMode')) {
                url = criterion.consts.Api.API.EMPLOYEE_SUBORDINATE_TIMESHEET_HORIZONTAL;
            } else {
                // default mode
                url = criterion.consts.Api.API.EMPLOYEE_TIMESHEET_HORIZONTAL;
            }

            return criterion.Api.requestWithPromise({
                url : Ext.String.format('{0}/{1}', url, timesheet.getId()),
                method : 'PUT',
                jsonData : {
                    timesheetTasks : timesheetTasks
                }
            });
        },

        submit : function() {
            let view = this.getView(),
                vm = this.getViewModel(),
                timesheetRecord = vm.get('timesheetRecord'),
                employeeId = timesheetRecord.get('employeeId'),
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

                vm.set('blockedState', true);

                me.save().then(function() {
                    criterion.Api.requestWithPromise({
                        url : criterion.consts.Api.API.EMPLOYEE_TIMESHEET_SUBMIT + '?timesheetId=' + timesheetRecord.getId() + '&employeeId=' + employeeId,
                        method : 'PUT',
                        jsonData : jsonData
                    })
                        .then({
                            success : function() {
                                vm.set('blockedState', false);
                                me.fireViewEvent('afterSave');
                            },
                            failure : function() {
                                criterion.Utils.toast(i18n.gettext('Something went wrong.'));
                                vm.set('blockedState', false);

                                me.load();
                            }
                        });
                }).otherwise(function() {
                    view.setLoading(false);
                });
            });

        },

        hasInvalidFields : function() {
            return criterion.Utils.hasInvalidFields(this.getView().query('field'));
        },

        onTasksContainerWrapUpdateLayout : function() {
            let datesContainer = this.lookup('datesContainer'),
                tasksContainer = this.lookup('tasksContainer'),
                tasksContainerWrap = this.lookup('tasksContainerWrap');

            if (!datesContainer || !tasksContainer || !tasksContainerWrap) {
                return;
            }

            let tasksContainerWrapWidth = tasksContainerWrap.getWidth(),
                tasksContainerWrapHeight = tasksContainerWrap.getHeight(),
                domEl = tasksContainer.el.dom,
                clientHeight = domEl.clientHeight,
                offsetHeight = domEl.offsetHeight,
                clientWidth = domEl.clientWidth,
                offsetWidth = domEl.offsetWidth,
                horizontalScrollerWidth = offsetHeight - clientHeight,
                verticalScrollerWidth = offsetWidth - clientWidth;

            tasksContainer.setWidth(tasksContainerWrapWidth + verticalScrollerWidth);

            // wait layout to be updated
            Ext.defer(function() {
                if (!datesContainer.el || !datesContainer.el.dom) {
                    return;
                }

                let domEl = datesContainer.el.dom,
                    datesContainerClientHeight = domEl.clientHeight,
                    datesContainerOffsetHeight = domEl.offsetHeight,
                    datesContainerHorizontalScrollerWidth = datesContainerOffsetHeight - datesContainerClientHeight;

                datesContainer.setStyle('padding-bottom', horizontalScrollerWidth + 'px');
                datesContainer.setHeight(tasksContainerWrapHeight + (horizontalScrollerWidth || datesContainerHorizontalScrollerWidth));
            }, 100, this);
        },

        onAfterRenderTimesheet : function() {
            let tasksLabels = this.lookup('tasksLabels'),
                datesLabels = this.lookup('datesLabels'),
                datesContainer = this.lookup('datesContainer'),
                tasksContainer = this.lookup('tasksContainer'),
                totalsContainer = this.lookup('totalsContainer'),
                datesScroll = datesContainer.getScrollable(),
                tasksScroll = tasksContainer.getScrollable(),
                totalsScroll = totalsContainer.getScrollable();

            tasksScroll.on('scroll', function(cmp, x, y) {
                if (y >= 0) {
                    datesLabels.scrollTo(null, y);

                    datesScroll.suspendEvent('scroll');
                    datesContainer.scrollTo(null, y);
                    Ext.defer(function() {
                        datesScroll.resumeEvent('scroll');
                    }, 1000);
                }
                if (x >= 0) {
                    tasksLabels.scrollTo(x);
                }
            });

            datesScroll.on('scroll', function(cmp, x, y) {
                if (y >= 0) {
                    tasksScroll.suspendEvent('scroll');
                    tasksContainer.scrollTo(null, y);
                    Ext.defer(function() {
                        tasksScroll.resumeEvent('scroll');
                    }, 1000);
                }
                if (x >= 0) {
                    datesLabels.scrollTo(x);

                    totalsScroll.suspendEvent('scroll');
                    totalsContainer.scrollTo(x);
                    Ext.defer(function() {
                        totalsScroll.resumeEvent('scroll');
                    }, 1000);
                }
            });

            totalsScroll.on('scroll', function(cmp, x) {
                if (x >= 0) {
                    datesLabels.scrollTo(x);

                    datesScroll.suspendEvent('scroll');
                    datesContainer.scrollTo(x);
                    Ext.defer(function() {
                        datesScroll.resumeEvent('scroll');
                    }, 1000);
                }
            });
        },

        onDatesContainerAdd : function() {
            let i = 1,
                timesheetContainer = this.lookup('timesheetContainer'),
                tasksComponents = timesheetContainer.query('criterion_employee_timesheet_horizontal_task'),
                datesComponents = timesheetContainer.query('criterion_employee_timesheet_horizontal_dates');

            if (tasksComponents.length === datesComponents.length) {
                Ext.Array.each(tasksComponents, function(container, idx) {
                    let datesContainer = datesComponents[idx];

                    Ext.Array.each(Ext.Array.merge(container.query('field'), datesContainer.query('field')), function(field) {
                        field.setTabIndex(i);
                        i++;
                    });
                });
            }
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

            if (this.getCloseAfterSave()) {
                view.on('afterSave', function() {
                    view.close();
                }, view);
            } else {
                view.on('afterSave', function() {
                    this.load();
                }, this);
            }
        }
    };

});

Ext.define('criterion.view.employee.timesheet.vertical.Day', function() {

    function parseTime(timeValue) {
        let parsed, hours, minutes;

        if (timeValue.search('d|h|m') > -1) {
            parsed = criterion.Utils.parseDuration(timeValue, false, true);

            hours = parsed.hours;
            minutes = parsed.minutes;
        } else if (timeValue.indexOf(':') > -1) {
            parsed = timeValue.split(':');

            hours = parseInt(parsed[0], 10);
            minutes = parseInt(parsed[1], 10);
        } else {
            parsed = criterion.Utils.hoursToDuration(timeValue);

            hours = parsed.hours;
            minutes = parsed.minutes;
        }

        return {
            hours : hours,
            minutes : minutes
        }
    }

    function changeWidget(cmp, value) {
        cmp.getWidgetRecord().set(cmp.getWidgetColumn().dataIndex, cmp.isDateCustomField ? Ext.Date.format(value, criterion.consts.Api.DATE_FORMAT) : value);
    }

    return {

        extend : 'Ext.container.Container',

        requires : [
            'criterion.view.employee.timesheet.IncomeCombo',
            'criterion.vm.timesheet.vertical.Task',
            'criterion.plugin.MouseOver',
            'criterion.ux.form.field.Time',
            'criterion.view.employee.timesheet.vertical.CheckIn',
            'criterion.store.workLocation.Areas',
            'criterion.store.employee.timesheet.Incomes',
            'criterion.store.employee.timesheet.Tasks',
            'criterion.store.employee.WorkLocations',
            'criterion.model.employee.timesheet.vertical.SplittedTask',
            'criterion.store.employee.timesheet.AvailableTasks',
            'criterion.store.employee.timesheet.AvailableProjects',
            'criterion.model.CustomData'
        ],

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex'
        ],

        alias : 'widget.criterion_employee_timesheet_day',

        viewModel : {
            data : {
                /**
                 * @link criterion.model.employee.timesheet.vertical.Day
                 */
                timesheetDay : null,
                /**
                 * @link criterion.store.employee.timesheet.Tasks
                 */
                timesheetTasks : null,

                dayIndex : 0,

                startDayOfWeek : Ext.Date.firstDayOfWeek // from TS layout
            },

            formulas : {
                dayContainerCls : data => {
                    let isWeekly = data('timesheetVertical.timesheetType.frequencyCode') === criterion.Consts.PAY_FREQUENCY_CODE.WEEKLY;

                    return !isWeekly && Ext.Date.clearTime(new Date(data('timesheetDay.date'))).getDay() === (data('startDayOfWeek') - 1) ? 'first-day-of-week' : ''
                }
            }
        },

        items : [
            // dynamic
        ],

        cls : 'day-container',

        bind : {
            userCls : '{dayContainerCls}'
        },

        layout : {
            type : 'vbox',
            align : 'stretchmax'
        },

        plugins : [
            {
                ptype : 'criterion_mouse_over',
                // Highlighted selector.
                delegate : '.day-container .task-detail-row'
            }
        ],

        initComponent : function() {
            this.callParent(arguments);

            this.addTasks();
        },

        getDetailsContainer() {
            return this.getViewModel().get('detailsContainer');
        },

        getFieldsContainerContainer() {
            return this.getViewModel().get('fieldsContainer');
        },

        findDefaultIncome(isButtonEntryType, managerMode, incomeCodes, isEnterTimeoff) {
            return (isButtonEntryType && !managerMode) ? incomeCodes.getAt(incomeCodes.findBy(rec => {
                if (isEnterTimeoff) {
                    return !rec.get('isIncome');
                } else {
                    return !rec.get('isIncome') && !rec.get('isTimeOff');
                }
            })) : incomeCodes.findRecord('isDefault', true)
        },

        createDefaultDetail : function(date) {
            let vm = this.getViewModel(),
                incomeCodes = vm.get('incomes'),
                workLocations = vm.get('workLocations'),
                availableAssignments = vm.get('availableAssignments'),
                defaultAssignment = availableAssignments.findRecord('isPrimary', true) || availableAssignments.getAt(0),
                timesheetVertical = vm.get('timesheetVertical'),
                timesheetType = timesheetVertical && timesheetVertical['getTimesheetType'] && timesheetVertical.getTimesheetType(),
                isButtonEntryType = timesheetType && (timesheetType.get('entryType') === criterion.Consts.TIMESHEET_LAYOUT_ENTRY_TYPE.BUTTON),
                defaultIncome = this.findDefaultIncome(isButtonEntryType, vm.get('managerMode'), incomeCodes, vm.get('timesheetVertical.timesheetType.isEnterTimeoff')),
                defaultWorkLocation = workLocations.findRecord('isPrimary', true) || workLocations.getAt(0);

            if (!isButtonEntryType && !defaultIncome) {
                incomeCodes.each(incomeCode => {
                    if (incomeCode.get('isIncome') && incomeCode.isDateAvailable(date)) {
                        defaultIncome = incomeCode;

                        return false;
                    }
                });
            }

            return Ext.create('criterion.model.employee.timesheet.vertical.TaskDetail', {
                paycodeDetail : defaultIncome && defaultIncome.getData() || {},
                assignmentId : defaultAssignment && defaultAssignment.get('assignmentId'),
                employerWorkLocationId : defaultWorkLocation && defaultWorkLocation.get('employerWorkLocationId')
            });
        },

        addTasks() {
            let vm = this.getViewModel(),
                incomeCodes = vm.get('incomes'),
                timesheetVertical = vm.get('timesheetVertical'),
                timesheetType = timesheetVertical && timesheetVertical['getTimesheetType'] && timesheetVertical.getTimesheetType(),
                isButtonEntryType = timesheetType && (timesheetType.get('entryType') === criterion.Consts.TIMESHEET_LAYOUT_ENTRY_TYPE.BUTTON),
                defaultPayCode = this.findDefaultIncome(isButtonEntryType, vm.get('managerMode'), incomeCodes, vm.get('timesheetVertical.timesheetType.isEnterTimeoff')),
                timesheetDay = vm.get('timesheetDay'),
                details = timesheetDay.details(),
                tasks = vm.get('timesheetTasks'),
                detailsCount = details.count(),
                detailsContainer = this.getDetailsContainer();

            if (!detailsCount) {
                this.createEmptyTaskDetailRow(timesheetDay.get('date'), timesheetDay);
            }

            details.each(function(taskDetail, idx) {
                let taskId = taskDetail.getId(),
                    isFirstTask = idx === 0,
                    isLastTask = idx === detailsCount - 1,
                    task;

                if (this.down('[detailId=' + taskId + ']')) {
                    let det = detailsContainer.down('[detailId=' + taskId + ']');

                    if (!isFirstTask) {
                        det.removeCls('day-details-container-first');
                    }

                    if (!isLastTask) {
                        det.removeCls('day-details-container-border');
                    }

                    return;
                }

                task = tasks && tasks.getById(taskDetail.get('timesheetTaskId'));

                if (isFirstTask) {
                    if (taskDetail.phantom && defaultPayCode) {
                        taskDetail.set('paycodeDetail', defaultPayCode.getData());
                    }
                }

                this.createTaskDetailRow(taskDetail, isFirstTask, isLastTask, task, idx);
            }, this);
        },

        removeTask(taskDetail) {
            let me = this,
                vm = this.getViewModel(),
                detailsContainer = this.getDetailsContainer(),
                details = vm.get('timesheetDay').details();

            Ext.suspendLayouts();

            // clean all details for recreate
            details.each(item => {
                let detContainer = me.down('[detailId=' + item.getId() + ']');

                detailsContainer.down('[rowContainerId=' + detContainer.getId() + ']').destroy();
                detContainer.destroy();
            });

            details.remove(taskDetail);

            me.addTasks();

            Ext.resumeLayouts(true);
        },

        handleAddTask(timesheetDay) {
            let isEmptyDateContainer = this.down('[isEmptyDateContainer]'),
                detailsContainer = this.getDetailsContainer(),
                isEmptyDateTotalContainer = isEmptyDateContainer && detailsContainer.down('[rowContainerId=' + isEmptyDateContainer.getId() + ']');

            timesheetDay.details().add(this.createDefaultDetail(timesheetDay.get('date')));

            Ext.suspendLayouts();

            if (isEmptyDateContainer) {
                isEmptyDateContainer.destroy();
                isEmptyDateTotalContainer.destroy();
            }

            this.addTasks();

            Ext.resumeLayouts(true);
        },

        handleRemoveTask(rowContainerVM) {
            this.removeTask(rowContainerVM.get('taskDetail'));
        },

        createEmptyTaskDetailRow(date, timesheetDay) {
            let me = this,
                vm = this.getViewModel();

            let preventEditing = vm.get('preventEditing'),
                timesheetVertical = vm.get('timesheetVertical'),
                isWeekly = vm.get('timesheetVertical.timesheetType.frequencyCode') === criterion.Consts.PAY_FREQUENCY_CODE.WEEKLY,
                isLastAdditionalDate = date && (date > timesheetVertical.get('endDate')),
                isButtonEntryType = vm.get('timesheetVertical.timesheetType.entryType') === criterion.Consts.TIMESHEET_LAYOUT_ENTRY_TYPE.BUTTON,
                isEnterTimeoff = vm.get('timesheetVertical.timesheetType.isEnterTimeoff'),
                isEnterHoliday = vm.get('timesheetVertical.timesheetType.isEnterHoliday'),
                canAddTask = (!vm.get('managerMode') ? (!isButtonEntryType || (isButtonEntryType && (isEnterTimeoff || isEnterHoliday))) : true) && !preventEditing && !isLastAdditionalDate,
                fieldsContainer = this.getFieldsContainerContainer(),
                detailsContainer = this.getDetailsContainer(),
                currentDayCls = Ext.Date.isEqual(Ext.Date.clearTime(new Date(date)), Ext.Date.clearTime(new Date())) ? 'current-day' : '',
                startDayOfWeek = vm.get('timesheetVertical.timesheetType.startDayOfWeek'),
                dayContainerCls = !isWeekly && Ext.Date.clearTime(date).getDay() === (startDayOfWeek - 1) ? 'first-day-of-week' : '';

            let rowContainer = Ext.create({
                xtype : 'container',
                cls : 'task-detail-row',
                layout : {
                    type : 'hbox',
                    align : 'stretch'
                },
                width : '100%',
                isEmptyDateContainer : true,
                defaults : {
                    margin : '0 5',
                    height : 45,
                    layout : {
                        type : 'vbox',
                        pack : 'center'
                    }
                },

                items : [
                    {
                        xtype : 'container',
                        width : 25,
                        bind : criterion.view.employee.timesheet.Vertical.applySizeBinding('actionCol'),
                        cls : 'timesheet-action-col',
                        padding : '0 0 0 5',
                        items : canAddTask ? [
                            {
                                xtype : 'button',
                                glyph : criterion.consts.Glyph['ios7-plus-outline'],
                                tooltip : i18n.gettext('Add Task'),
                                margin : 0,
                                cls : 'criterion-btn-transparent',
                                handler : () => {
                                    me.handleAddTask(timesheetDay);
                                }
                            }
                        ] : []
                    },

                    {
                        xtype : 'container',
                        width : 70,
                        bind : criterion.view.employee.timesheet.Vertical.applySizeBinding('dateCol'),
                        items : [
                            {
                                xtype : 'component',
                                cls : 'timesheet-vertical-align strong',
                                html : Ext.Date.format(date, 'm/d D'),
                                userCls : currentDayCls
                            }
                        ]
                    }
                ]
            });

            let detailsRow = {
                xtype : 'container',
                cls : 'day-details-container day-details-container-border day-details-container-first',
                isEmptyDateTotalContainer : true,

                userCls : dayContainerCls,

                layout : {
                    type : 'hbox',
                    pack : 'end'
                },

                defaults : {
                    margin : '0 0 0 10',
                    height : 45,
                    layout : {
                        type : 'vbox',
                        pack : 'center'
                    }
                },
                items : [
                    {
                        xtype : 'container',
                        bind : criterion.view.employee.timesheet.Vertical.applySizeBinding('totalHoursCol'),
                        cls : 'timesheet-detail-value-column',
                        margin : 0,
                        items : []
                    },
                    {
                        xtype : 'container',
                        bind : criterion.view.employee.timesheet.Vertical.applySizeBinding('totalDaysCol'),
                        cls : 'timesheet-detail-value-column',
                        margin : 0,
                        hidden : true,
                        items : []
                    },
                    {
                        xtype : 'container',
                        bind : criterion.view.employee.timesheet.Vertical.applySizeBinding('regIncomeHoursCol', {
                            hidden : '{!showExtraColumns || isManualDay}'
                        }),
                        cls : 'timesheet-detail-value-column',
                        margin : 0,
                        hidden : true,
                        items : []
                    },
                    {
                        xtype : 'container',
                        bind : criterion.view.employee.timesheet.Vertical.applySizeBinding('regIncomeDaysCol', {
                            hidden : '{!showExtraColumns || !isManualDay}'
                        }),
                        cls : 'timesheet-detail-value-column',
                        margin : 0,
                        hidden : true,
                        items : []
                    },
                    {
                        xtype : 'container',
                        bind : criterion.view.employee.timesheet.Vertical.applySizeBinding('overtimeCol', {
                            hidden : '{!showExtraColumns}'
                        }),
                        cls : 'timesheet-detail-value-column',
                        margin : 0,
                        hidden : true,
                        items : []
                    },
                    {
                        xtype : 'container',
                        bind : criterion.view.employee.timesheet.Vertical.applySizeBinding('autoBreaksCol', {
                            hidden : '{!showExtraColumns || !timesheetVertical.hasAutoBreaks}'
                        }),
                        cls : 'timesheet-detail-value-column',
                        margin : 0,
                        hidden : true,
                        items : []
                    },
                    {
                        xtype : 'container',
                        bind : criterion.view.employee.timesheet.Vertical.applySizeBinding('fillUXCol'),
                        cls : 'timesheet-fillUXCol'
                    }
                ]
            };

            Ext.suspendLayouts();

            rowContainer = this.add(rowContainer);

            detailsRow['rowContainerId'] = rowContainer.getId();

            detailsContainer.insert(fieldsContainer.query('[cls~=task-detail-row]').indexOf(rowContainer), detailsRow);

            Ext.resumeLayouts();
        },

        createTaskDetailRow : function(taskDetail, isFirstTask, isLastTask, task, idx) {
            let me = this,
                vm = this.getViewModel();

            let fieldsContainer = this.getFieldsContainerContainer(),
                detailsContainer = this.getDetailsContainer();

            let incomeStore = Ext.create('criterion.store.employee.timesheet.Incomes', {
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
                incomesOnlyIncome = Ext.create('criterion.store.employee.timesheet.Incomes', {
                    filters : [
                        {
                            property : 'paycode',
                            value : criterion.Consts.PAYCODE.INCOME,
                            exactMatch : true
                        }
                    ]
                }),
                incomes = vm.get('incomes');

            let timesheetController = vm.get('parentController'), // support not good way, temporary, possible. ref to event
                isPhantom = taskDetail.phantom,
                paycodeDetail = taskDetail.getPaycodeDetail(),
                isIncome = paycodeDetail && paycodeDetail.get('isIncome'),
                isTrackable = paycodeDetail && paycodeDetail.get('isTrackable'),
                timesheetVertical = vm.get('timesheetVertical'),
                dayIndex = vm.get('dayIndex'),
                tabIndex = parseInt(dayIndex + '' + idx, 10),
                timesheetType = timesheetVertical && timesheetVertical['getTimesheetType'] && timesheetVertical.getTimesheetType(),
                managerMode = vm.get('managerMode'),
                isWorkflowView = vm.get('isWorkflowView'),
                isEnterTimeoff = timesheetType && timesheetType.get('isEnterTimeoff'),
                isEnterHoliday = timesheetType && timesheetType.get('isEnterHoliday'),
                workLocations = vm.get('workLocations'),
                availableTasks = vm.get('availableTasks'),
                availableProjects = vm.get('availableProjects'),
                timesheetDay = vm.get('timesheetDay'),
                preventEditing = vm.get('preventEditing'),
                disableInput = vm.get('disableInput'),
                canEditAction = vm.get('canEditAction'),
                columns = [],
                isShowTime = timesheetType && timesheetType.get('isShowTime'),
                viewDetailOnly = vm.get('viewDetailOnly'),
                isManualDay = timesheetType && (timesheetType.get('entryType') === criterion.Consts.TIMESHEET_LAYOUT_ENTRY_TYPE.MANUAL_DAY),
                isButtonEntryType = timesheetType && (timesheetType.get('entryType') === criterion.Consts.TIMESHEET_LAYOUT_ENTRY_TYPE.BUTTON),
                date = timesheetDay.get('date'),
                availableAssignments = vm.get('availableAssignments'),
                workLocationAreasData = vm.get('workLocationAreas').getRange(),
                isApplicableToApprover = task && task.get('isApplicableToApprover'),
                taskNotApplicable = isApplicableToApprover === false,
                isLastAdditionalDate = date && (date > timesheetVertical.get('endDate')),
                showAutoBreaks = timesheetVertical.get('hasAutoBreaks'),
                currentDayCls = Ext.Date.isEqual(Ext.Date.clearTime(new Date(date)), Ext.Date.clearTime(new Date())) ? 'current-day' : '';

            incomes.cloneToStore(incomeStore);
            incomes.cloneToStore(incomesOnlyIncome);

            let incomesCount = incomeStore.count(),
                canAddTask = (!vm.get('managerMode') ? (!isButtonEntryType || (isButtonEntryType && (isEnterTimeoff || isEnterHoliday))) : true) && incomesCount && isFirstTask && !preventEditing && !isLastAdditionalDate,
                incomesComboStore = !isPhantom && isIncome ? incomesOnlyIncome : incomeStore,
                isUpdatable = taskDetail.get('isUpdatable'),
                isRemovable = taskDetail.get('isRemovable'),
                isApprovedTimeOff = taskDetail.get('isApprovedTimeOff'),
                allowManualEntry = isButtonEntryType ? (managerMode || isPhantom || !isTrackable) : !disableInput,
                canEditTask = canEditAction && isUpdatable && allowManualEntry,
                canDeleteTask = canEditTask && isRemovable && !isApprovedTimeOff,
                canEditAnyEntryType = canEditAction && isUpdatable;

            let rowVm = Ext.create('criterion.vm.timesheet.vertical.Task', {
                parent : vm,
                data : {
                    taskDetail : taskDetail,
                    timesheetType : timesheetType,
                    isLastAdditionalDate : isLastAdditionalDate,
                    showAutoBreaks : showAutoBreaks,
                    _canEditTask : canEditTask,
                    // selectedPaycode

                    // hasInOut, isStartedTask

                    isFirstTask : isFirstTask,
                    isApplicableToApprover : isApplicableToApprover,
                    timesheetDay : timesheetDay
                }
            });

            let rowContainer = Ext.create({
                xtype : 'container',
                layout : {
                    type : 'hbox',
                    align : 'stretch'
                },
                cls : [task && task.get('isApplicableToApprover') === false ? 'timesheet-task-disabled' : null, 'task-detail-row'],
                isTaskWrapper : true,
                ref : 'rowContainer',
                detailId : taskDetail.getId(),
                viewModel : rowVm,
                width : '100%',
                defaults : {
                    margin : '0 5',
                    height : isFirstTask ? 45 : 35,
                    layout : {
                        type : 'vbox',
                        pack : isFirstTask ? 'center' : 'start'
                    },
                    defaults : {
                        tabIndex : tabIndex
                    }
                }
            });

            let detailsRow = {
                xtype : 'container',
                cls : 'day-details-container' + (isLastTask ? ' day-details-container-border' : '') + (isFirstTask ? ' day-details-container-first' : ''),

                bind : {
                    userCls : isFirstTask ? '{dayContainerCls}' : ''
                },

                viewModel : rowVm,
                layout : {
                    type : 'hbox',
                    pack : 'end'
                },
                detailId : taskDetail.getId(),
                defaults : {
                    margin : '0 0 0 10',
                    height : isLastTask ? (isFirstTask ? 45 : 34) : (isFirstTask ? 46 : 35),
                    layout : {
                        type : 'vbox',
                        pack : isFirstTask ? 'center' : 'start'
                    },
                    defaults : {
                        tabIndex : tabIndex
                    }
                },
                items : []
            };

            function onHoursBlur(cmp) {
                let hasError = false,
                    parsedTime = parseTime(cmp.getValue());

                if (!isNaN(parsedTime.hours) || !isNaN(parsedTime.minutes)) {
                    taskDetail.set({
                        endTime : null,
                        hours : isNaN(parsedTime.hours) ? 0 : parseInt(parsedTime.hours, 0),
                        minutes : isNaN(parsedTime.minutes) ? 0 : parseInt(parsedTime.minutes, 0)
                    });

                } else {
                    hasError = true;
                }

                if (hasError) {
                    cmp.markInvalid(i18n.gettext('Wrong format, should be : \'12:45\', \'1h 20m\', \'1h\', \'20m\''));
                }
            }

            // ==== actions =====================================================================================
            // add
            columns.push({
                xtype : 'container',
                width : 25,
                bind : criterion.view.employee.timesheet.Vertical.applySizeBinding('actionCol'),
                cls : 'timesheet-action-col',
                padding : '0 0 0 5',
                items : canAddTask ? [
                    {
                        xtype : 'button',
                        glyph : criterion.consts.Glyph['ios7-plus-outline'],
                        tooltip : i18n.gettext('Add Task'),
                        margin : 0,
                        cls : 'criterion-btn-transparent',
                        handler : () => {
                            me.handleAddTask(timesheetDay);
                        }
                    }
                ] : []
            });

            // date
            columns.push({
                xtype : 'container',
                width : 70,
                bind : criterion.view.employee.timesheet.Vertical.applySizeBinding('dateCol'),
                items : isFirstTask ? [
                    {
                        xtype : 'component',
                        cls : 'timesheet-vertical-align strong',
                        html : Ext.Date.format(date, 'm/d D'),
                        userCls : currentDayCls
                    }
                ] : []
            });

            // remove
            columns.push({
                xtype : 'container',
                width : 25,
                bind : criterion.view.employee.timesheet.Vertical.applySizeBinding('actionCol'),
                cls : 'timesheet-action-col',
                items : canDeleteTask ? [
                    {
                        xtype : 'button',
                        glyph : criterion.consts.Glyph['ios7-trash-outline'],
                        tooltip : i18n.gettext('Delete'),
                        margin : 0,
                        cls : 'criterion-btn-transparent delete-button',
                        handler : () => {
                            me.handleRemoveTask(rowVm);
                        }
                    }
                ] : []
            });

            // geofence mark
            let hideGeofence = !isWorkflowView && !managerMode,
                isInsideGeofenceIn = taskDetail.get('isInsideGeofenceIn'),
                isInsideGeofenceOut = taskDetail.get('isInsideGeofenceOut'),
                hasGeofenceIn = isInsideGeofenceIn !== undefined && isInsideGeofenceIn !== null,
                hasGeofenceOut = isInsideGeofenceOut !== undefined && isInsideGeofenceOut !== null,
                geoFenceInTitle = hasGeofenceIn ? (isInsideGeofenceIn ? i18n._('Checked in inside geofence') : i18n._('Checked in outside geofence')) : i18n.gettext('No Data'),
                geoFenceOutTitle = hasGeofenceOut ? (isInsideGeofenceOut ? i18n._('Checked out inside geofence') : i18n._('Checked out outside geofence')) : i18n.gettext('No Data'),
                geoFenceInIconCls = (isInsideGeofenceIn ? 'criterion-geolocation-inside' : 'criterion-geolocation-outside') +
                    (!hasGeofenceIn ? ' disabled' : ''),
                geoFenceOutIconCls = (isInsideGeofenceOut ? 'criterion-geolocation-inside' : 'criterion-geolocation-outside') +
                    (!hasGeofenceOut ? ' disabled' : '');

            columns.push(
                {
                    xtype : 'container',
                    layout : 'hbox',
                    width : 40,
                    bind : criterion.view.employee.timesheet.Vertical.applySizeBinding('markerCol'),
                    hidden : hideGeofence,
                    items : [
                        {
                            xtype : 'button',
                            ui : 'glyph',
                            cls : 'criterion-btn-transparent',
                            glyph : criterion.consts.Glyph['android-pin'],
                            scale : 'small',
                            hidden : !hasGeofenceIn && !hasGeofenceOut,
                            tooltip : geoFenceInTitle,
                            userCls : geoFenceInIconCls,
                            margin : isFirstTask ? '5px 0 0 0' : 0
                        },
                        {
                            xtype : 'button',
                            ui : 'glyph',
                            cls : 'criterion-btn-transparent',
                            glyph : criterion.consts.Glyph['android-pin'],
                            scale : 'small',
                            hidden : !hasGeofenceOut && !hasGeofenceIn,
                            tooltip : geoFenceOutTitle,
                            userCls : geoFenceOutIconCls,
                            margin : isFirstTask ? '5px 0 0 0' : 0
                        }
                    ]
                }
            );

            // ==== paycode =====================================================================================
            let disablePaycodeChange = !(isPhantom || isIncome) || taskNotApplicable,
                paycodeNotFoundText = paycodeDetail ? paycodeDetail.get('name') : taskDetail.get('paycodeDetail')['name'];

            rowVm.set('selectedPaycode', paycodeDetail ? paycodeDetail : taskDetail.get('paycodeDetail'));

            columns.push({
                xtype : 'container',
                bind : criterion.view.employee.timesheet.Vertical.applySizeBinding('paycodeCol'),
                width : 200,
                items : [
                    {
                        xtype : 'criterion_employee_timesheet_income_combo',
                        ui : 'mini',
                        margin : 0,

                        bind : {
                            value : '{taskDetail.paycodeDetail.id}'
                        },

                        value : paycodeDetail ? paycodeDetail.get('id') : null,
                        store : incomesComboStore,
                        readOnly : !canEditTask,
                        disabled : disablePaycodeChange,
                        valueNotFoundText : paycodeNotFoundText,

                        matchFieldWidth : false,

                        listConfig : {
                            minWidth : 200,

                            listeners : {
                                show : function(boundlist) {
                                    if (!isButtonEntryType || managerMode) {
                                        return;
                                    }

                                    boundlist.store.addFilter({
                                        id : 'incomeFilter',
                                        property : 'isIncome',
                                        value : false
                                    });
                                },
                                hide : function(boundlist) {
                                    if (!isButtonEntryType || managerMode) {
                                        return;
                                    }

                                    boundlist.store.removeFilter('incomeFilter');
                                }
                            }
                        },

                        listeners : {
                            scope : this,
                            change : function(cmp, value) {
                                let selectedPaycode = incomes.getById(value),
                                    selectedPaycodeData = selectedPaycode && selectedPaycode.getData();

                                if (!selectedPaycode) {
                                    console && console.warn('taskDetail.paycodeDetail.id not found : ' + value);

                                    return;
                                }

                                rowVm.set('selectedPaycode', selectedPaycode);

                                if (taskDetail.phantom) {
                                    if (taskDetail.get('paycodeDetail') && taskDetail.get('paycodeDetail').id !== selectedPaycode.getId()) {
                                        taskDetail.set('paycodeDetail', selectedPaycodeData);
                                    }
                                } else {
                                    if (taskDetail.getPaycodeDetail().getId() !== selectedPaycode.getId()) {
                                        taskDetail.setPaycodeDetail(selectedPaycode);
                                        taskDetail.set({
                                            paycodeDetail : selectedPaycodeData,
                                            paycodeChanged : true
                                        });
                                    }
                                }
                            }
                        },

                        width : '100%'
                    }
                ]
            });

            // ==== location =====================================================================================
            let employerWorkLocationName = taskDetail.get('employerWorkLocationName'),
                hasMultiLocations = vm.get('hasMultiLocations'),
                isShowWorkLocation = timesheetType.get('isShowWorkLocation'),
                hideWorkLocation = !hasMultiLocations && !isShowWorkLocation,
                wlUID = criterion.Utils.generateRndString(10);

            columns.push(
                {
                    xtype : 'container',
                    width : 150,
                    bind : criterion.view.employee.timesheet.Vertical.applySizeBinding('locationCol'),

                    hidden : hideWorkLocation,

                    items : !hideWorkLocation ? [
                        viewDetailOnly ? {
                            xtype : 'textfield',
                            ui : 'mini',
                            margin : 0,
                            readOnly : true,
                            value : employerWorkLocationName,
                            width : '100%'
                        } : {
                            xtype : 'combo',
                            ui : 'mini',
                            margin : 0,
                            editable : true,
                            forceSelection : true,
                            matchFieldWidth : false,
                            reference : 'workLocationCombo' + wlUID,
                            anyMatch : true,
                            listConfig : {
                                minWidth : 150
                            },
                            store : {
                                type : 'criterion_employee_work_locations',
                                data : workLocations.getRange()
                            },

                            valueNotFoundText : employerWorkLocationName,
                            readOnly : !canEditAnyEntryType,
                            disabled : taskNotApplicable,
                            value : taskDetail.get('employerWorkLocationId'),

                            bind : {
                                value : '{taskDetail.employerWorkLocationId}'
                            },

                            queryMode : 'local',
                            valueField : 'employerWorkLocationId',
                            displayField : 'employerLocationName',

                            width : '100%'
                        }
                    ] : []
                }
            );

            // ==== area =====================================================================================
            let workLocationAreaName = taskDetail.get('workLocationAreaName'),
                isShowWorkArea = timesheetType.get('isShowWorkArea'),
                hideWorkArea = !isShowWorkArea;

            columns.push(
                {
                    xtype : 'container',
                    width : 150,
                    bind : criterion.view.employee.timesheet.Vertical.applySizeBinding('areaCol'),

                    hidden : hideWorkArea,

                    items : !hideWorkArea ? [
                        viewDetailOnly ? {
                            xtype : 'textfield',
                            margin : 0,
                            ui : 'mini',
                            readOnly : true,
                            value : workLocationAreaName,
                            width : '100%'
                        } : {
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
                            anyMatch : true,
                            listConfig : {
                                minWidth : 150
                            },

                            value : taskDetail.get('workLocationAreaId'),
                            valueNotFoundText : workLocationAreaName,
                            readOnly : !canEditAnyEntryType,
                            disabled : taskNotApplicable,

                            bind : {
                                filters : [
                                    {
                                        property : 'workLocationId',
                                        value : '{workLocationCombo' + wlUID + '.selection.workLocationId}',
                                        exactMatch : true
                                    }
                                ],
                                value : '{taskDetail.workLocationAreaId}'
                            },
                            queryMode : 'local',
                            valueField : 'id',
                            displayField : 'name',
                            width : '100%'
                        }
                    ] : []
                }
            );

            // ==== project =====================================================================================
            let projectName = taskDetail.get('projectName'),
                isShowProject = timesheetType.get('isShowProject'),
                hideProject = !isShowProject;

            columns.push(
                {
                    xtype : 'container',
                    width : 150,
                    bind : criterion.view.employee.timesheet.Vertical.applySizeBinding('projectCol'),

                    hidden : hideProject,

                    items : !hideProject ? [
                        viewDetailOnly ? {
                            xtype : 'textfield',
                            margin : 0,
                            ui : 'mini',
                            readOnly : true,
                            value : projectName,
                            width : '100%'
                        } : {
                            xtype : 'combo',
                            ui : 'mini',
                            ref : 'projectCombo',
                            margin : 0,
                            store : {
                                type : 'criterion_employee_timesheet_available_projects',
                                data : availableProjects.getRange()
                            },

                            value : taskDetail.get('projectId'),
                            valueNotFoundText : projectName,
                            readOnly : !canEditAnyEntryType,
                            disabled : taskNotApplicable,

                            bind : {
                                value : '{taskDetail.projectId}'
                            },

                            queryMode : 'local',
                            valueField : 'id',
                            displayField : 'name',
                            editable : true,
                            forceSelection : true,
                            matchFieldWidth : false,
                            listConfig : {
                                minWidth : 150
                            },
                            width : '100%'
                        }
                    ] : []
                }
            );

            // ==== task =====================================================================================
            let employeeTaskName = taskDetail.get('employeeTaskName'),
                isShowTasks = timesheetType.get('isShowTasks'),
                hideTasks = !isShowTasks,
                taskRef = 'taskCombo_' + criterion.Utils.generateRndString(10);

            columns.push(
                {
                    xtype : 'container',
                    width : 150,
                    bind : criterion.view.employee.timesheet.Vertical.applySizeBinding('taskCol'),

                    hidden : hideTasks,

                    items : !hideTasks ? [
                        viewDetailOnly ? {
                            xtype : 'textfield',
                            margin : 0,
                            ui : 'mini',
                            readOnly : true,
                            value : employeeTaskName,
                            bind : {
                                value : '{taskDetail.employeeTaskName}'
                            },
                            width : '100%'
                        } : {
                            xtype : 'combo',
                            ui : 'mini',
                            ref : 'tasksCombo',
                            margin : 0,
                            store : {
                                type : 'criterion_employee_timesheet_available_tasks',
                                data : availableTasks.getRange()
                            },

                            value : taskDetail.get('taskId'),
                            valueNotFoundText : employeeTaskName,
                            readOnly : !canEditAnyEntryType,
                            disabled : taskNotApplicable,

                            bind : {
                                value : '{taskDetail.taskId}',

                                filters : [
                                    {
                                        property : 'projectId',
                                        value : '{taskDetail.projectId}',
                                        exactMatch : true
                                    },
                                    {
                                        property : 'isActive', // strange that this need here
                                        value : true
                                    },
                                    {
                                        property : 'id', // for binding
                                        value : '{taskDetail.workLocationAreaId}',
                                        disabled : true // this need
                                    },
                                    {
                                        filterFn : function(record) {
                                            let projectId = rowVm.get('taskDetail.projectId'),
                                                workLocationAreaId = rowVm.get('taskDetail.workLocationAreaId'),
                                                workLocationAreaIds = record.get('workLocationAreaIds');

                                            return projectId ? true : (
                                                !workLocationAreaIds.length || Ext.Array.contains(workLocationAreaIds, workLocationAreaId)
                                            );
                                        }
                                    }
                                ]
                            },

                            reference : taskRef,
                            queryMode : 'local',
                            valueField : 'id',
                            displayField : 'name',
                            editable : true,
                            anyMatch : true,
                            forceSelection : true,
                            matchFieldWidth : false,
                            listConfig : {
                                minWidth : 150
                            },

                            width : '100%',

                            listeners : {
                                change : function(cmp, value) {
                                    if (value && fieldsContainer.detectTaskChanges) {
                                        criterion.Utils.fillCustomFieldsDefaultValuesFromCodes(cmp.up('[ref=rowContainer]'), cmp.getSelection().get('classificationCodesAndValues'));
                                    }
                                }
                            }
                        }
                    ] : []
                }
            );

            // ==== assignment =====================================================================================
            let assignmentName = taskDetail.get('assignmentName'),
                hasMultiAssignments = vm.get('hasMultiAssignments'),
                isShowAssignment = timesheetType.get('isShowAssignment'),
                hideAssignment = !hasMultiAssignments && !isShowAssignment;

            columns.push(
                {
                    xtype : 'container',
                    width : 150,
                    bind : criterion.view.employee.timesheet.Vertical.applySizeBinding('assignmentCol'),

                    hidden : hideAssignment,

                    items : !hideAssignment ? [
                        viewDetailOnly ? {
                            xtype : 'textfield',
                            ui : 'mini',
                            margin : 0,
                            readOnly : true,
                            value : assignmentName,
                            width : '100%'
                        } : {
                            xtype : 'combo',
                            ui : 'mini',
                            margin : 0,

                            value : taskDetail.get('assignmentId'),
                            valueNotFoundText : assignmentName,
                            readOnly : !canEditAnyEntryType,
                            disabled : taskNotApplicable,

                            store : availableAssignments,

                            bind : {
                                value : '{taskDetail.assignmentId}'
                            },

                            valueField : 'assignmentId',
                            displayField : 'title',
                            queryMode : 'local',
                            matchFieldWidth : false,
                            listConfig : {
                                minWidth : 150
                            },
                            width : '100%',

                            tpl : Ext.create('Ext.XTemplate',
                                '<ul class="x-list-plain"><tpl for=".">',
                                '  <tpl if="this.isAvailable(assignmentId)">',
                                '    <li role="option" class="x-boundlist-item">',
                                '      {title}',
                                '    </li>',
                                '  </tpl>',
                                '</tpl></ul>',
                                {
                                    isAvailable : function(assignmentId) {
                                        let availableAssignmentIndex = availableAssignments.findBy(function(assignment) {
                                            return assignment.get('assignmentId') === assignmentId && assignment.isAvailableByDate(date);
                                        });

                                        return availableAssignmentIndex > -1;
                                    }
                                })
                        }
                    ] : []
                }
            );

            // ==== custom fields =====================================================================================
            let customFields = timesheetVertical.get('customFields'),
                customFieldSplitTaskColumns = [];

            Ext.Array.each(criterion.Utils.range(1, 4), index => {
                let hideCustomField = !vm.get('customField' + index + 'Title');

                let container = {
                        xtype : 'container',
                        width : hideCustomField ? 0 : 150,
                        bind : criterion.view.employee.timesheet.Vertical.applySizeBinding('customCol' + index),
                        hidden : hideCustomField,
                        items : []
                    },
                    customFieldConf = customFields[index - 1];

                if (customFieldConf && !hideCustomField) {
                    let customField = criterion.model.CustomData.loadData(customFieldConf),
                        dataType = criterion.CodeDataManager.getCodeDetailRecord('id', customField.get('dataTypeCd'), criterion.consts.Dict.DATA_TYPE).get('code'),
                        isDateCustomField = dataType === criterion.Consts.DATA_TYPE.DATE,
                        fieldName = Ext.String.format('customValue{0}', index),
                        title = Ext.String.format('{customField{0}Title}', index),
                        value = taskDetail.get(fieldName),
                        cmp = Ext.merge({
                            ui : 'mini',
                            margin : 0,
                            matchFieldWidth : false,
                            bind : Ext.apply({
                                readOnly : '{!canEditAnyEntryType}',
                                disabled : '{taskNotApplicable}'
                            }, criterion.Utils.getCustomFieldBindFilters(customField, 'taskDetail', rowVm, taskRef)),
                            value : value,
                            width : '100%',

                            listeners : {
                                change : function(_cmp, newVal) {
                                    if (!(newVal !== value && Ext.isEmpty(value) && _cmp.readOnly)) {
                                        taskDetail.set(fieldName, newVal);
                                    }
                                }
                            }
                        }, criterion.Utils.getCustomFieldEditorConfig(customField, value, taskDetail, fieldName));

                    container.items.push(cmp);
                    customFieldSplitTaskColumns.push({
                        xtype : 'widgetcolumn',
                        dataIndex : fieldName,
                        flex : 1,
                        bind : {
                            text : title
                        },
                        widget : Ext.merge({
                            ui : 'mini',
                            listeners : {
                                change : changeWidget
                            }
                        }, criterion.Utils.getCustomFieldEditorConfig(customField, value, taskDetail, fieldName), isDateCustomField ? {
                            isDateCustomField : true,
                            format : criterion.consts.Api.DATE_FORMAT
                        } : {})
                    });
                }

                columns.push(container);
            });

            // ==== time elements =====================================================================================
            let startTimeOfDay = timesheetType && timesheetType.get('startTimeOfDay'),
                startTimeThreshold = date && Ext.Date.isEqual(date, timesheetVertical.get('startDate')) && startTimeOfDay ? startTimeOfDay : null;

            if (isShowTime && !isManualDay) {
                columns.push(
                    {
                        xtype : 'container',
                        width : 120,
                        bind : criterion.view.employee.timesheet.Vertical.applySizeBinding('inCol'),
                        items : [
                            {
                                xtype : 'criterion_time_field',
                                ui : 'mini',
                                margin : 0,
                                triggerCls : Ext.baseCSSPrefix + 'form-trigger-clock',

                                publishInvalid : true,
                                value : taskDetail.get('startTime'),
                                startTime : startTimeThreshold,

                                bind : {
                                    value : '{taskDetail.startTime}',
                                    hidden : '{hasInOut}',
                                    disabled : '{!_canEditTask || isStartedTask || isLastAdditionalDate}'
                                },
                                width : '100%'
                            }
                        ]
                    },
                    {
                        xtype : 'container',
                        width : 120,
                        bind : criterion.view.employee.timesheet.Vertical.applySizeBinding('outCol'),
                        items : [
                            {
                                xtype : 'criterion_time_field',
                                ui : 'mini',
                                margin : 0,

                                publishInvalid : true,
                                value : taskDetail.get('endTime'),
                                startTime : startTimeThreshold,

                                bind : {
                                    value : '{taskDetail.endTime}',
                                    hidden : '{hasInOut}',
                                    disabled : '{!_canEditTask || isStartedTask || isLastAdditionalDate}'
                                },
                                width : '100%'
                            }
                        ]
                    }
                );
            }

            if (isManualDay) {
                columns.push(
                    {
                        xtype : 'container',
                        bind : criterion.view.employee.timesheet.Vertical.applySizeBinding('daysCol'),
                        width : 80,
                        items : [
                            {
                                xtype : 'textfield',
                                ui : 'mini',
                                userCls : currentDayCls,
                                bind : {
                                    value : '{taskDetail.units}',
                                    hidden : '{!isUnits}',
                                    disabled : '{!isUnits || !_canEditTask}'
                                },
                                width : '100%',
                                hidden : true
                            },
                            {
                                xtype : 'numberfield',
                                ui : 'mini',
                                hidden : true,
                                width : '100%',
                                margin : 0,
                                userCls : currentDayCls,
                                bind : {
                                    value : '{taskDetail.days}',
                                    hidden : '{isUnits}',
                                    disabled : '{isUnits || !_canEditTask}'
                                }
                            }
                        ]
                    }
                );

                detailsRow.items.push(
                    {
                        xtype : 'container',
                        bind : criterion.view.employee.timesheet.Vertical.applySizeBinding('totalDaysCol'),
                        width : 80,
                        margin : 0,
                        cls : 'timesheet-detail-value-column',
                        items : [
                            {
                                xtype : 'component',
                                cls : 'timesheet-vertical-align strong pad',
                                userCls : currentDayCls,
                                bind : {
                                    html : '{timesheetDay.totalDays}',
                                    hidden : '{!isFirstTask}'
                                }
                            }
                        ]
                    },
                    {
                        xtype : 'container',
                        bind : criterion.view.employee.timesheet.Vertical.applySizeBinding('regIncomeDaysCol', {
                            hidden : '{!showExtraColumns || !isManualDay}'
                        }),
                        width : 80,
                        margin : 0,
                        cls : 'timesheet-detail-value-column',
                        hidden : true,
                        items : [
                            {
                                xtype : 'component',
                                cls : 'timesheet-vertical-align strong pad',
                                userCls : currentDayCls,
                                bind : {
                                    html : '{timesheetDay.regDays}',
                                    hidden : '{!isFirstTask}'
                                }
                            }
                        ]
                    },
                    {
                        xtype : 'container',
                        bind : criterion.view.employee.timesheet.Vertical.applySizeBinding('overtimeCol', {
                            hidden : '{!showExtraColumns}'
                        }),
                        width : 80,
                        margin : 0,
                        cls : 'timesheet-detail-value-column',
                        hidden : true,
                        items : [
                            {
                                xtype : 'component',
                                cls : 'timesheet-vertical-align strong pad',
                                userCls : currentDayCls,
                                bind : {
                                    html : '{timesheetDay.overtimeDays}',
                                    hidden : '{!isFirstTask}'
                                }
                            }
                        ]
                    },
                    {
                        xtype : 'container',
                        bind : criterion.view.employee.timesheet.Vertical.applySizeBinding('autoBreaksCol', {
                            hidden : '{!showExtraColumns || !timesheetVertical.hasAutoBreaks}'
                        }),
                        width : 100,
                        margin : 0,
                        cls : 'timesheet-detail-value-column',
                        hidden : true,
                        items : [
                            {
                                xtype : 'component',
                                cls : 'timesheet-vertical-align strong pad',
                                userCls : currentDayCls,
                                bind : {
                                    html : '{timesheetDay.autoBreakHours}',
                                    hidden : '{!isFirstTask}'
                                }
                            }
                        ]
                    },
                    {
                        xtype : 'container',
                        width : 0,
                        bind : criterion.view.employee.timesheet.Vertical.applySizeBinding('fillUXCol'),
                        cls : 'timesheet-fillUXCol'
                    }
                );
            } else {

                if (isShowTime) {
                    // show time = TRUE, "Hours/Items" fields should be disabled for manual entering, except Units income and Comp Time Earned time off
                    columns.push(
                        {
                            xtype : 'container',
                            bind : criterion.view.employee.timesheet.Vertical.applySizeBinding('hoursCol'),
                            width : 80,
                            items : [
                                // Hrs./Items
                                {
                                    xtype : 'component',
                                    cls : 'timesheet-vertical-align',
                                    userCls : currentDayCls,
                                    bind : {
                                        html : '{taskDetail.taskHoursString}',
                                        hidden : '{hasHrsItems}'
                                    }
                                },
                                {
                                    xtype : 'textfield',
                                    ui : 'mini',
                                    userCls : currentDayCls,
                                    bind : {
                                        value : '{taskDetail.units}',
                                        hidden : '{!isUnits}',
                                        disabled : '{!isUnits || !_canEditTask}'
                                    },
                                    margin : 0,
                                    width : '100%',
                                    hidden : true
                                },
                                {
                                    xtype : 'textfield',
                                    ui : 'mini',
                                    itemId : 'taskHoursString',
                                    userCls : currentDayCls,
                                    bind : {
                                        value : '{taskDetail.taskHoursString}',
                                        hidden : '{!isCompEarned}',
                                        disabled : '{!isCompEarned || !_canEditTask}'
                                    },
                                    margin : 0,
                                    width : '100%',
                                    hidden : true,
                                    listeners : {
                                        blur : onHoursBlur
                                    }
                                }
                            ]
                        }
                    );
                } else if (isButtonEntryType) {
                    // show time = FALSE, (entry type = Button) "Hours/Items" fields should be disabled for manual entering,
                    // except Units income, Comp Time Earned, Time off and Holidays paycodes
                    columns.push(
                        {
                            xtype : 'container',
                            bind : criterion.view.employee.timesheet.Vertical.applySizeBinding('hoursCol'),
                            width : 80,
                            items : [
                                {
                                    xtype : 'component',
                                    cls : 'timesheet-vertical-align',
                                    userCls : currentDayCls,
                                    bind : {
                                        html : '{taskDetail.taskHoursString}',
                                        hidden : '{managerMode || hasInOut || isNotIncome}'
                                    }
                                },
                                {
                                    xtype : 'textfield',
                                    ui : 'mini',
                                    userCls : currentDayCls,
                                    bind : {
                                        value : '{taskDetail.units}',
                                        hidden : '{!isUnits}',
                                        disabled : '{!isUnits || !_canEditTask}'
                                    },
                                    margin : 0,
                                    width : '100%',
                                    hidden : true
                                },
                                {
                                    xtype : 'textfield',
                                    ui : 'mini',
                                    itemId : 'taskHoursString',
                                    userCls : currentDayCls,
                                    bind : {
                                        value : '{taskDetail.taskHoursString}',
                                        hidden : '{!((managerMode && !isUnits) || (isCompEarned || isNotIncome))}',
                                        disabled : '{!((managerMode && !isUnits) || (isCompEarned || isNotIncome)) || !_canEditTask}'
                                    },
                                    margin : 0,
                                    width : '100%',
                                    hidden : true,
                                    listeners : {
                                        blur : onHoursBlur
                                    }
                                }
                            ]
                        }
                    );
                } else {
                    // show time = FALSE, (entry type = Manual/Manual & Button) "Hours/Items" fields should be available to enter time for all types of incomes
                    columns.push(
                        {
                            xtype : 'container',
                            bind : criterion.view.employee.timesheet.Vertical.applySizeBinding('hoursCol'),
                            width : 80,
                            items : [
                                {
                                    xtype : 'textfield',
                                    ui : 'mini',
                                    userCls : currentDayCls,
                                    bind : {
                                        value : '{taskDetail.units}',
                                        hidden : '{!isUnits}',
                                        disabled : '{!isUnits || !_canEditTask}'
                                    },
                                    margin : 0,
                                    width : '100%',
                                    hidden : true
                                },
                                {
                                    xtype : 'textfield',
                                    ui : 'mini',
                                    itemId : 'taskHoursString',
                                    userCls : currentDayCls,
                                    bind : {
                                        value : '{taskDetail.taskHoursString}',
                                        hidden : '{isUnits}',
                                        disabled : '{isUnits || !_canEditTask}'
                                    },
                                    margin : 0,
                                    width : '100%',
                                    hidden : true,
                                    listeners : {
                                        blur : onHoursBlur
                                    }
                                }
                            ]
                        }
                    );
                }

                detailsRow.items.push(
                    {
                        xtype : 'container',
                        bind : criterion.view.employee.timesheet.Vertical.applySizeBinding('totalHoursCol'),
                        width : 80,
                        cls : 'timesheet-detail-value-column',
                        margin : 0,
                        items : [
                            {
                                xtype : 'component',
                                cls : 'timesheet-vertical-align strong pad',
                                userCls : currentDayCls,
                                bind : {
                                    html : '{timesheetDay.totalHours}',
                                    hidden : '{!isFirstTask}'
                                }
                            }
                        ]
                    },
                    {
                        xtype : 'container',
                        bind : criterion.view.employee.timesheet.Vertical.applySizeBinding('regIncomeHoursCol', {
                            hidden : '{!showExtraColumns || isManualDay}'
                        }),
                        width : 80,
                        cls : 'timesheet-detail-value-column',
                        margin : 0,
                        hidden : true,
                        items : [
                            {
                                xtype : 'component',
                                cls : 'timesheet-vertical-align strong pad',
                                userCls : currentDayCls,
                                bind : {
                                    html : '{timesheetDay.regHours}',
                                    hidden : '{!isFirstTask}'
                                }
                            }
                        ]
                    },
                    {
                        xtype : 'container',
                        bind : criterion.view.employee.timesheet.Vertical.applySizeBinding('overtimeCol', {
                            hidden : '{!showExtraColumns}'
                        }),
                        width : 80,
                        cls : 'timesheet-detail-value-column',
                        margin : 0,
                        hidden : true,
                        items : [
                            {
                                xtype : 'component',
                                cls : 'timesheet-vertical-align strong pad',
                                userCls : currentDayCls,
                                bind : {
                                    html : '{timesheetDay.overtimeHours}',
                                    hidden : '{!isFirstTask}'
                                }
                            }
                        ]
                    },
                    {
                        xtype : 'container',
                        bind : criterion.view.employee.timesheet.Vertical.applySizeBinding('autoBreaksCol', {
                            hidden : '{!showExtraColumns || !timesheetVertical.hasAutoBreaks}'
                        }),
                        width : 100,
                        cls : 'timesheet-detail-value-column',
                        margin : 0,
                        hidden : true,
                        items : [
                            {
                                xtype : 'component',
                                cls : 'timesheet-vertical-align strong pad',
                                userCls : currentDayCls,
                                bind : {
                                    html : '{timesheetDay.autoBreakHours}',
                                    hidden : '{!isFirstTask}'
                                }
                            }
                        ]
                    },
                    {
                        xtype : 'container',
                        width : 0,
                        bind : criterion.view.employee.timesheet.Vertical.applySizeBinding('fillUXCol'),
                        cls : 'timesheet-fillUXCol'
                    }
                );
            }

            // ==== split =====================================================================================

            if (
                !managerMode && isButtonEntryType && paycodeDetail
                && (paycodeDetail.get('isIncome') || paycodeDetail.get('isTimeOff'))
                && taskDetail.get('endTime')
            ) {

                columns.push(
                    {
                        xtype : 'container',
                        bind : criterion.view.employee.timesheet.Vertical.applySizeBinding('splitCol'),
                        width : 25,
                        cls : 'timesheet-action-col',
                        padding : '0 0 0 5',
                        defaults : {
                            margin : 0,
                            cls : 'criterion-btn-transparent'
                        },
                        items : [
                            {
                                xtype : 'button',
                                glyph : criterion.consts.Glyph['ios7-copy-outline'],
                                tooltip : i18n.gettext('Split Time'),
                                handler : function() {
                                    me.splitTime({
                                        employeeTaskName,
                                        availableAssignments,
                                        customFieldSplitTaskColumns,
                                        date,
                                        taskDetail,
                                        timesheetController
                                    });
                                }
                            }
                        ]
                    }
                );
            }

            Ext.suspendLayouts();

            rowContainer.add(columns);

            this.add(rowContainer);

            detailsRow['rowContainerId'] = rowContainer.getId();

            detailsContainer.insert(fieldsContainer.query('[cls~=task-detail-row]').indexOf(rowContainer), detailsRow);

            Ext.resumeLayouts();
        },

        splitTime(data) {
            let vm = this.getViewModel(),
                splitTaskItems = [],
                showAssignments = vm.get('hasMultiAssignments') && vm.get('timesheetVertical.timesheetType.isShowAssignment');

            let {employeeTaskName, availableAssignments, customFieldSplitTaskColumns, date, taskDetail, timesheetController} = data;

            vm.get('timesheetVertical.timesheetType.isShowTasks') &&
            splitTaskItems.push(
                {
                    xtype : 'widgetcolumn',
                    text : vm.get('timesheetVertical.timesheetType.labelTask') || i18n.gettext('Task'),
                    dataIndex : 'taskId',
                    flex : 1,
                    widget : {
                        xtype : 'combo',
                        ui : 'mini',
                        bind : {
                            store : '{availableTasks}'
                        },
                        queryMode : 'local',
                        valueField : 'id',
                        displayField : 'name',
                        valueNotFoundText : employeeTaskName,
                        listeners : {
                            change : changeWidget
                        }
                    }
                }
            );

            showAssignments && splitTaskItems.push(
                {
                    xtype : 'widgetcolumn',
                    text : vm.get('timesheetVertical.timesheetType.labelAssignment') || i18n.gettext('Assignment'),
                    dataIndex : 'assignmentId',
                    flex : 1,
                    widget : {
                        xtype : 'combo',
                        ui : 'mini',
                        bind : {
                            store : '{availableAssignments}'
                        },

                        forceSelection : true,
                        valueField : 'assignmentId',
                        displayField : 'title',
                        queryMode : 'local',

                        width : '100%',

                        allowBlank : false,

                        msgTarget : 'qtip',

                        tpl : Ext.create('Ext.XTemplate',
                            '<ul class="x-list-plain"><tpl for=".">',
                            '  <tpl if="this.isAvailable(assignmentId)">',
                            '    <li role="option" class="x-boundlist-item">',
                            '      {title}',
                            '    </li>',
                            '  </tpl>',
                            '</tpl></ul>',
                            {
                                isAvailable : function(assignmentId) {
                                    let availableAssignmentIndex = availableAssignments.findBy(function(assignment) {
                                        return assignment.get('assignmentId') === assignmentId && assignment.isAvailableByDate(date);
                                    });

                                    return availableAssignmentIndex > -1;
                                }
                            }),
                        listeners : {
                            change : changeWidget
                        }
                    },
                    onWidgetAttach : function(column, widget, record) {
                        record._assignmentWidget = widget;
                    }
                }
            );

            splitTaskItems = Ext.Array.merge(splitTaskItems, customFieldSplitTaskColumns, [
                {
                    xtype : 'widgetcolumn',
                    text : i18n.gettext('Hrs'),
                    dataIndex : 'taskHoursString',
                    flex : 1,
                    widget : {
                        xtype : 'textfield',
                        ui : 'mini',
                        msgTarget : 'qtip',
                        listeners : {
                            blur : function(cmp) {
                                let parsedTime = parseTime(cmp.getValue());

                                cmp.getWidgetRecord().set({
                                    hours : parsedTime.hours || 0,
                                    minutes : parsedTime.minutes || 0
                                });

                                cmp.clearInvalid();
                            }
                        }
                    },
                    onWidgetAttach : function(column, widget, record) {
                        record._hrsWidget = widget;
                    }
                },
                {
                    xtype : 'criterion_actioncolumn',
                    width : criterion.Consts.UI_DEFAULTS.ACTION_COL_ITEM_WIDTH,
                    items : [
                        {
                            glyph : criterion.consts.Glyph['ios7-trash-outline'],
                            tooltip : i18n.gettext('Delete'),
                            action : 'removeaction'
                        }
                    ]
                }
            ]);

            Ext.create('criterion.view.GridView', {
                viewModel : {
                    data : {
                        taskDate : date,
                        customField1Title : vm.get('customField1Title'),
                        customField2Title : vm.get('customField2Title'),
                        customField3Title : vm.get('customField3Title'),
                        customField4Title : vm.get('customField4Title'),
                        totalHours : taskDetail.get('taskHoursString')
                    },
                    stores : {
                        availableTasks : vm.get('availableTasks'),
                        availableAssignments : vm.get('availableAssignments'),
                        detailsStore : {
                            model : 'criterion.model.employee.timesheet.vertical.SplittedTask'
                        }
                    },
                    formulas : {
                        availableMinutes : {
                            bind : {
                                bindTo : '{detailsStore}',
                                deep : true
                            },
                            get : function(detailsStore) {
                                let totalHours = detailsStore.sum('hours') || 0,
                                    totalMinutes = detailsStore.sum('minutes') || 0,
                                    result = taskDetail.get('hours') * 60 + taskDetail.get('minutes') - (totalHours * 60 + totalMinutes);

                                return (result >= 0) ? result : 0;
                            }
                        },
                        availableHours : function(get) {
                            return criterion.Utils.minutesToTimeStr(get('availableMinutes'));
                        },
                        totalMinutes : function(get) {
                            return taskDetail.get('hours') * 60 + taskDetail.get('minutes')
                        },
                        canSave : {
                            bind : {
                                bindTo : '{detailsStore}',
                                deep : true
                            },
                            get : function(detailsStore) {
                                let totalMinutes = this.get('totalMinutes'),
                                    usedMinutes = detailsStore.sum('hours') * 60 + detailsStore.sum('minutes'),
                                    storeIsValid = true;

                                if (!detailsStore.count() || !totalMinutes) {
                                    return false;
                                }

                                detailsStore.each(function(record) {
                                    if (!record.isValid()) {
                                        storeIsValid = false;
                                        return false;
                                    }
                                });

                                return usedMinutes <= totalMinutes && storeIsValid;
                            }
                        }
                    }
                },

                tbar : null,

                viewConfig : {
                    markDirty : false
                },

                preventStoreLoad : true,

                controller : {
                    confirmDelete : false
                },

                header : {
                    title : {
                        text : i18n.gettext('Manage Tracked Time'),
                        minimizeWidth : true
                    },

                    items : [
                        {
                            xtype : 'component',

                            userCls : 'sub-title',

                            bind : {
                                html : '{taskDate:date("m/d l")}'
                            }
                        },
                        {
                            xtype : 'tbfill'
                        },
                        {
                            xtype : 'button',
                            reference : 'addButton',
                            ui : 'feature',
                            text : i18n.gettext('Add'),
                            listeners : {
                                click : function(cmp) {
                                    this.up('grid').getStore().add({
                                        assignmentId : !showAssignments ? taskDetail.get('assignmentId') : null,
                                        hours : 0,
                                        minutes : 0
                                    });
                                }
                            }
                        }
                    ]
                },

                plugins : [
                    {
                        ptype : 'criterion_sidebar',
                        modal : true,
                        height : 500,
                        width : criterion.Consts.UI_DEFAULTS.MODAL_WIDE_WIDTH
                    }
                ],

                alwaysOnTop : true,

                defaults : {
                    defaults : {
                        padding : '0 10'
                    }
                },

                bind : {
                    store : '{detailsStore}'
                },

                columns : splitTaskItems,

                dockedItems : [
                    {
                        xtype : 'toolbar',

                        dock : 'bottom',

                        weight : 0,

                        items : [
                            '->',
                            {
                                xtype : 'container',
                                layout : 'vbox',
                                items : [
                                    {
                                        xtype : 'displayfield',
                                        ui : 'mini',
                                        fieldLabel : i18n.gettext('Available Hours'),
                                        bind : {
                                            value : '{availableHours}'
                                        }
                                    },
                                    {
                                        xtype : 'displayfield',
                                        ui : 'mini',
                                        fieldLabel : i18n.gettext('Total Hours'),
                                        bind : {
                                            value : '{totalHours}'
                                        }
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        xtype : 'toolbar',

                        dock : 'bottom',

                        weight : 1,

                        ui : 'footer',

                        padding : '25 0 0 0',

                        items : [
                            '->',
                            {
                                xtype : 'button',

                                ui : 'light',

                                text : i18n.gettext('Close'),

                                handler : function(cmp) {
                                    cmp.up('criterion_gridview').close();
                                    timesheetController.setCorrectMaskZIndex(false);
                                }
                            },
                            ' ',
                            {
                                xtype : 'button',

                                text : i18n.gettext('Save'),

                                disabled : true,

                                bind : {
                                    disabled : '{!canSave}'
                                },

                                handler : function(cmp) {
                                    let view = cmp.up('criterion_gridview'),
                                        hasInvalid = false,
                                        splittedTasks = Ext.JSON.encode(
                                            Ext.Array.map(this.lookupViewModel().getStore('detailsStore').getRange(), function(item) {
                                                if (item && item._hrsWidget) {
                                                    if (item.get('hours') === 0 && item.get('minutes') === 0) {
                                                        item._hrsWidget.markInvalid(i18n.gettext('Wrong format, should be : \'12:45\', \'1h 20m\', \'1h\', \'20m\' and greater than \'00:00\''));
                                                        hasInvalid = true;
                                                    }
                                                }
                                                if (!showAssignments || (item._assignmentWidget && item._assignmentWidget.isValid())) {
                                                    return item.getData({persist : true});
                                                } else {
                                                    hasInvalid = true;
                                                    return false;
                                                }
                                            })
                                        );

                                    if (hasInvalid) {
                                        return;
                                    }

                                    view.setLoading(true);

                                    criterion.Api.requestWithPromise({
                                        method : 'POST',
                                        url : Ext.String.format(criterion.consts.Api.API.EMPLOYEE_TIMESHEET_VERTICAL_SPLIT, taskDetail.get('timesheetTaskId')),
                                        jsonData : splittedTasks
                                    }).then(function() {
                                        view.close();
                                        timesheetController.setCorrectMaskZIndex(false);
                                        timesheetController.load();
                                    }).otherwise(function() {
                                        view.setLoading(false);
                                    });
                                }
                            }
                        ]
                    }
                ]
            }).show();

            timesheetController.setCorrectMaskZIndex(true);
        }

    }
});

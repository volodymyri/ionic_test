Ext.define('ess.controller.time.timesheet.Vertical', function() {

    return {

        alias : 'controller.ess_modern_time_timesheet_vertical',

        extend : 'criterion.app.ViewController',

        requires : [
            'criterion.model.employee.timesheet.Vertical',
            'criterion.view.employee.SubmitConfirm',
            'criterion.model.employee.timesheet.Income',
            'criterion.store.employee.timesheet.LIncomes'
        ],

        mixins : [
            'ess.controller.time.timesheet.mixin.BaseActions',
            'criterion.controller.mixin.WorkflowConfirmation'
        ],

        handleActivate : function() {},

        listen : {
            global : {
                employeeTimezone : 'onEmployeeTimezoneUpdate'
            }
        },

        init() {
            this.getViewModel().bind('{timesheetRecord}', this.handleTimesheetChange, this);

            this.callParent(arguments);
        },

        onEmployeeTimezoneUpdate(timezoneCd, timezoneRec) {
            this.getViewModel().set('timezone', (timezoneRec ? timezoneRec.get('description') : ''));
        },

        getTimesheetRecord() {
            return this.getViewModel().get('timesheetVertical');
        },

        handleTimesheetChange(timesheetRecord) {
            let me = this,
                view = this.getView(),
                vm = this.getViewModel(),
                timesheetVertical = vm.get('timesheetVertical'),
                promises = [],
                dfd = Ext.create('Ext.Deferred'),
                employeeId, timesheetId,
                incomeCodes = this.getStore('incomeCodes');

            if (!timesheetRecord) {
                return;
            }

            incomeCodes.clearFilter();
            incomeCodes.setFilters([
                {
                    property : 'isActive',
                    value : true
                }
            ]);

            employeeId = timesheetRecord.get('employeeId');
            timesheetId = timesheetRecord.getId();

            promises.push(criterion.model.employee.timesheet.Vertical.loadWithPromise(timesheetRecord.getId(), {
                params : {
                    timesheetId : timesheetRecord.getId(),
                    timezoneOffset : new Date().getTimezoneOffset()
                }
            }));

            promises.push(
                me.loadWorkflowData(employeeId, criterion.Consts.WORKFLOW_TYPE_CODE.TIMESHEET),
                this.getStore('workLocations').loadWithPromise({
                    params : {
                        employeeId : employeeId
                    }
                }),
                this.getStore('workLocationAreas').loadWithPromise(),
                this.getStore('availableProjects').loadWithPromise({
                    params : {
                        timesheetId : timesheetId
                    }
                }),
                this.getStore('availableTasks').loadWithPromise({
                    params : {
                        timesheetId : timesheetId
                    }
                }),
                this.getStore('availableAssignments').loadWithPromise({
                    params : {
                        timesheetId : timesheetId
                    }
                }),
                incomeCodes.loadWithPromise({
                    params : {
                        timesheetId : timesheetId
                    }
                })
            );

            view.setLoading(true);

            Ext.promise.Promise.all(promises)
            .then(function(results) {
                timesheetVertical = results[0];
                vm.set('timesheetVertical', timesheetVertical);

                let timesheetType = timesheetVertical.getTimesheetType(),
                    isEnterTimeoff = timesheetType.get('isEnterTimeoff'),
                    isEnterHoliday = timesheetType.get('isEnterHoliday'),
                    incomeStore = Ext.create('criterion.store.employee.timesheet.LIncomes', {
                        filters : [
                            function(income) {
                                var allowTimeOff = true,
                                    allowHoliday = true;

                                if (income.get('paycode') === criterion.Consts.PAYCODE.TIME_OFF && !isEnterTimeoff) {
                                    allowTimeOff = false;
                                }

                                if (income.get('paycode') === criterion.Consts.PAYCODE.HOLIDAY && !isEnterHoliday) {
                                    allowHoliday = false;
                                }

                                return income && allowTimeOff && allowHoliday;
                            }
                        ]
                    });

                incomeCodes.cloneToStore(incomeStore);
                vm.set('incomeStore', incomeStore);

                // change total
                vm.set('timesheetRecord.formattedTotalHours', timesheetVertical.get('formattedTotalHours'));

                dfd.resolve();
            })
            .always(function() {
                view.setLoading(false);
            });

            return dfd.promise;
        },

        reloadTimesheetData(timesheetRecord) {
            let dfd = Ext.create('Ext.Deferred'),
                view = this.getView(),
                vm = this.getViewModel();

            view.setLoading(true);

            criterion.model.employee.timesheet.Vertical.loadWithPromise(timesheetRecord.getId(), {
                params : {
                    timesheetId : timesheetRecord.getId(),
                    timezoneOffset : new Date().getTimezoneOffset()
                }
            }).then(function(timesheetVertical) {
                vm.set('timesheetVertical', timesheetVertical);
                dfd.resolve();
            }).always(function() {
                view.setLoading(false);
            });

            return dfd.promise;
        },

        handleEditAction(grid, ind, row, record) {
            let view = this.getView();

            this.getViewModel().set('timesheetDayDetailsRecord', record);

            view.getLayout().setAnimation({
                    type : 'slide',
                    direction : 'left'
                }
            );

            view.setActiveItem(this.lookup('timesheetVerticalDayDetailsGrid'));
        },

        resetCardState() {
            this.getView().setActiveItem(this.lookup('timesheetVerticalDaysGrid'));
        },

        handleCancelDayDetailsGrid() {
            let view = this.getView();

            view.getLayout().setAnimation({
                    type : 'slide',
                    direction : 'right'
                }
            );

            view.setActiveItem(this.lookup('timesheetVerticalDaysGrid'));
        },

        handleAddTimesheetDetail() {
            let vm = this.getViewModel(),
                timesheetDayDetailsRecord = vm.get('timesheetDayDetailsRecord'),
                newTask,
                incomeCodes = vm.get('incomeCodes'),
                workLocations = vm.get('workLocations'),
                availableAssignments = vm.get('availableAssignments'),
                errors = [];

            !incomeCodes.count() && errors.push(i18n.gettext('No Income Codes found.'));
            !workLocations.count() && errors.push(i18n.gettext('No Work Locations found.'));
            !availableAssignments.count() && errors.push(i18n.gettext('No Assignments found.'));

            let defaultAssignment = availableAssignments.findRecord('isPrimary', true) || availableAssignments.getAt(0),
                defaultWorkLocation = workLocations.findRecord('isPrimary', true) || workLocations.getAt(0);

            if (errors.length) {
                criterion.Msg.error({
                    title : i18n.gettext('Task can not be added.'),
                    message : errors.join('<br>')
                });
                return;
            }

            newTask = timesheetDayDetailsRecord.details().add({
                assignmentId : defaultAssignment.get('assignmentId'),
                employerWorkLocationId : defaultWorkLocation.get('employerWorkLocationId'),
                timesheetId : timesheetDayDetailsRecord.get('timesheetId'),
                date : timesheetDayDetailsRecord.get('date')
            })[0];

            if (!newTask.getPaycodeDetail()) {
                newTask.setPaycodeDetail(Ext.create('criterion.model.employee.timesheet.Income'));
            }

            this.editDetail(newTask);
        },

        handleEditTimesheetDetail(grid, ind, row, record) {
            this.editDetail(record);
        },

        editDetail(record) {
            let view = this.getView(),
                vm = this.getViewModel(),
                date = record.get('date'),
                timesheet = vm.get('timesheetVertical'),
                incomes = Ext.create('criterion.store.employee.timesheet.LIncomes'),
                incomeStore = vm.get('incomeStore'),
                res = [],
                timesheetVerticalDetailForm = this.lookup('timesheetVerticalDetailForm');

            incomeStore.each(function(income) {
                if (income.isDateAvailable(date) || income.get('isBreak')) {
                    res.push(income.getData());
                }
            });

            incomes.setData(res);

            view.getLayout().setAnimation({
                    type : 'slide',
                    direction : 'right'
                }
            );

            timesheetVerticalDetailForm.removeAll();
            timesheetVerticalDetailForm.add({
                xtype : 'ess_modern_time_timesheet_vertical_detail_form',

                viewModel : {
                    data : {
                        taskDetail : record,
                        date : date,
                        timesheet : timesheet,
                        incomes : incomes
                    }
                },

                listeners : {
                    close : this.handleCloseDetailsForm,
                    scope : this
                }
            });

            view.setActiveItem(timesheetVerticalDetailForm);
        },

        handleCloseDetailsForm : function() {
            let view = this.getView(),
                vm = this.getViewModel(),
                date = vm.get('timesheetDayDetailsRecord').get('date');

            view.getLayout().setAnimation({
                    type : 'slide',
                    direction : 'right'
                }
            );

            view.setActiveItem(this.lookup('timesheetVerticalDayDetailsGrid'));

            this.reloadTimesheetData(vm.get('timesheetRecord')).then(_ => {
                vm.set('timesheetDayDetailsRecord', vm.get('timesheetVertical').days().findRecord('date', date, 0, false, false, true));
            });
        },

        handleBack : function() {
            this.getView().fireEvent('back');
        }

    };

});


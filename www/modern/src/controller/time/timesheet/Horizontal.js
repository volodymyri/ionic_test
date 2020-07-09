Ext.define('ess.controller.time.timesheet.Horizontal', function() {

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.ess_modern_time_timesheet_horizontal',

        requires : [
            'criterion.model.mobile.employee.timesheet.task.Detail',
            'criterion.store.employee.timesheet.LIncomes',
            'criterion.view.employee.SubmitConfirm'
        ],

        mixins : [
            'ess.controller.time.timesheet.mixin.BaseActions',
            'criterion.controller.mixin.WorkflowConfirmation'
        ],

        getTimesheetRecord : function() {
            return this.getViewModel().get('timesheetRecord');
        },

        handleActivate : function() {
            var me = this,
                vm = this.getViewModel(),
                employeeId = vm.get('employeeId'),
                timesheetRecord = this.getTimesheetRecord(),
                promises = [],
                timesheetId;

            if (!timesheetRecord) {
                return;
            }

            timesheetId = timesheetRecord.getId();

            promises.push(
                timesheetRecord.loadWithPromise(),
                me.loadWorkflowData(employeeId, criterion.Consts.WORKFLOW_TYPE_CODE.TIMESHEET),
                vm.getStore('workLocations').loadWithPromise({
                    params : {
                        employeeId : employeeId
                    }
                }),
                vm.getStore('workLocationAreas').loadWithPromise(),
                vm.getStore('availableProjects').loadWithPromise({
                    params : {
                        timesheetId : timesheetId
                    }
                }),
                vm.getStore('availableTasks').loadWithPromise({
                    params : {
                        timesheetId : timesheetId
                    }
                }),
                vm.getStore('availableAssignments').loadWithPromise({
                    params : {
                        timesheetId : timesheetId
                    }
                }),
                vm.getStore('incomeCodes').loadWithPromise({
                    params : {
                        timesheetId : timesheetId
                    }
                }),
                vm.getStore('timesheetDetailsByDate').loadWithPromise({
                    params : {
                        timesheetId : timesheetId
                    }
                })
            );

            Ext.Deferred.all(promises);
        },

        handleEditAction : function(grid, ind, row, record) {
            var view = this.getView(),
                wrapper;

            if (grid && grid.id === 'timesheetDetailsGridOne') {
                wrapper = view.down('#timesheetDetailsGridTwoWrapper');

                this.curDate = record.get('date');
                this.getViewModel().set('timesheetDayDetailsRecord', record);

                view.getLayout().setAnimation({
                        type : 'slide',
                        direction : 'left'
                    }
                );

                view.setActiveItem(wrapper);
            }
        },

        resetCardState : function() {
            var view = this.getView();

            view.setActiveItem(view.down('#timesheetDetailsGridOneWrapper'));
        },

        handleCancelViewDetailTwo : function() {
            var view = this.getView();

            view.down('#timesheetDetailsGridTwo').deselectAll();

            view.getLayout().setAnimation({
                    type : 'slide',
                    direction : 'right'
                }
            );

            view.setActiveItem(view.down('#timesheetDetailsGridOneWrapper'));
        },

        handleAddTaskAction : function() {
            var vm = this.getViewModel(),
                timesheetRecord = this.getTimesheetRecord(),
                timesheetDayDetailsRecord,
                workLocations = vm.get('workLocations'),
                availableAssignments = vm.get('availableAssignments'),
                defaultAssignment,
                defaultWorkLocation;

            defaultAssignment = availableAssignments.findRecord('isPrimary', true) || availableAssignments.getAt(0);
            defaultWorkLocation = workLocations.findRecord('isPrimary', true) || workLocations.getAt(0);

            timesheetDayDetailsRecord = Ext.create('criterion.model.mobile.employee.timesheet.task.Detail', {
                timesheetId : timesheetRecord.getId(),
                date : this.curDate,
                entityRef : 1,
                assignmentId : defaultAssignment.get('assignmentId'),
                employerWorkLocationId : defaultWorkLocation.get('employerWorkLocationId')
            });

            this.editTimesheetDetail(timesheetDayDetailsRecord);
        },

        handleEditTimesheetDetail : function(a, b, c, record) {
            var data = record.getData(),
                timesheetDayDetailsRecord = Ext.create('criterion.model.mobile.employee.timesheet.task.Detail', data);

            timesheetDayDetailsRecord.dirty = false;
            timesheetDayDetailsRecord.phantom = false;
            timesheetDayDetailsRecord.modified = {};

            this.editTimesheetDetail(timesheetDayDetailsRecord);
        },

        /**
         * @protected
         * @param timesheetDayDetailsRecord
         */
        editTimesheetDetail : function(timesheetDayDetailsRecord) {
            var view = this.getView(),
                criterion_time_timesheet_horizontal_form = view.down('criterion_time_timesheet_horizontal_form'),
                incomes = this.getViewModel().get('incomeCodes'),
                incomeStore = Ext.create('criterion.store.employee.timesheet.LIncomes', {
                    filters : timesheetDayDetailsRecord.phantom ? [
                        {
                            property : 'hasAvailableDates',
                            value : true
                        }
                    ] : []
                }),
                date = timesheetDayDetailsRecord.get('date');

            incomes.cloneToStore(incomeStore);

            incomeStore.each(function(income) {
                if (!income.isDateAvailable(date) && !income.get('isBreak')) {
                    incomeStore.remove(income);
                }
            });

            criterion_time_timesheet_horizontal_form.getViewModel().set({
                record : timesheetDayDetailsRecord,
                create : timesheetDayDetailsRecord.phantom,

                incomes : incomeStore
            });

            Ext.Function.defer(function() {
                criterion_time_timesheet_horizontal_form.getController().setMainRecord();
            }, 100);

            view.getLayout().setAnimation({
                    type : 'slide',
                    direction : 'left'
                }
            );

            view.setActiveItem(criterion_time_timesheet_horizontal_form);
        },

        handleTimesheetDetailModificateFinish : function() {
            var view = this.getView(),
                timesheetsDetailGridWrapper = view.down('#timesheetDetailsGridTwoWrapper'),
                vm = this.getViewModel(),
                timesheetRecord = this.getTimesheetRecord(),
                timesheetDetailsByDate = vm.getStore('timesheetDetailsByDate'),
                timesheetDayDetailsRecord = vm.get('timesheetDayDetailsRecord');

            view.getLayout().setAnimation({
                    type : 'slide',
                    direction : 'right'
                }
            );

            view.setActiveItem(timesheetsDetailGridWrapper);
            timesheetsDetailGridWrapper.down('#timesheetDetailsGridTwo').deselectAll();
            timesheetDetailsByDate.loadWithPromise({
                params : {
                    timesheetId : timesheetRecord.getId()
                }
            }).then(function() {
                // reload
                vm.set('timesheetDayDetailsRecord', timesheetDetailsByDate.getById(timesheetDayDetailsRecord.getId()));
            })
        },

        handleBack : function() {
            this.getView().fireEvent('back');
        }
    };
});

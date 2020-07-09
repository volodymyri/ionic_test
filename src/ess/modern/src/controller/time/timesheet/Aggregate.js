Ext.define('ess.controller.time.timesheet.Aggregate', function() {

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.ess_modern_time_timesheet_aggregate',

        requires : [
            'criterion.model.employee.timesheet.Aggregate',
            'criterion.model.employee.timesheet.aggregate.Task'
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
                timesheetId,
                incomeCodes = vm.getStore('incomeCodes');

            if (!timesheetRecord) {
                return;
            }

            timesheetId = timesheetRecord.getId();

            promises.push(
                me.loadWorkflowData(employeeId, criterion.Consts.WORKFLOW_TYPE_CODE.TIMESHEET),
                criterion.model.employee.timesheet.Aggregate.loadWithPromise(timesheetId).then(function(timesheetRecord) {
                    vm.set({
                        timesheetRecord : timesheetRecord,
                        timesheetTasks : timesheetRecord.timesheetTasks()
                    });
                }),
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
                incomeCodes.loadWithPromise({
                    params : {
                        timesheetId : timesheetId,
                        incomePaycodesOnly : true
                    }
                })
            );

            Ext.Deferred.all(promises);
        },

        handleBack : function() {
            this.getView().fireEvent('back');
        },

        resetCardState : Ext.emptyFn,

        handleAddTimesheetTask : function() {
            var vm = this.getViewModel(),
                incomeCodes = vm.get('incomeCodes'),
                workLocations = vm.get('workLocations'),
                availableAssignments = vm.get('availableAssignments'),
                timesheetRecord = this.getTimesheetRecord(),
                errors = [],
                timesheetTask;

            !incomeCodes.count() && errors.push(i18n.gettext('No Income Codes found.'));
            !workLocations.count() && errors.push(i18n.gettext('No Work Locations found.'));
            !availableAssignments.count() && errors.push(i18n.gettext('No Assignments found.'));

            var defaultAssignment = availableAssignments.findRecord('isPrimary', true) || availableAssignments.getAt(0),
                defaultIncome = incomeCodes.findRecord('isDefault', true) || incomeCodes.getAt(0),
                defaultWorkLocation = workLocations.findRecord('isPrimary', true) || workLocations.getAt(0);

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

            timesheetRecord.timesheetTasks().add(timesheetTask);

            this.editTimesheetDetail(timesheetTask);
        },

        handleEditTimesheetTask : function(a, b, c, record) {
            this.editTimesheetDetail(record);
        },

        editTimesheetDetail : function(record) {
            var view = this.getView(),
                criterion_time_timesheet_aggregate_form = view.down('criterion_time_timesheet_aggregate_form'),
                incomes = this.getViewModel().get('incomeCodes');

            criterion_time_timesheet_aggregate_form.getViewModel().set({
                record : record,
                create : record.phantom,

                incomes : incomes
            });

            Ext.Function.defer(function() {
                criterion_time_timesheet_aggregate_form.getController().setMainRecord();
            }, 100);

            view.getLayout().setAnimation({
                    type : 'slide',
                    direction : 'left'
                }
            );

            view.setActiveItem(criterion_time_timesheet_aggregate_form);
        },

        handleTimesheetTaskModificateFinish : function() {
            var view = this.getView(),
                timesheetTasksGridWrapper = this.lookup('timesheetTasksGridWrapper');

            view.getLayout().setAnimation({
                    type : 'slide',
                    direction : 'right'
                }
            );

            view.setActiveItem(timesheetTasksGridWrapper);
        }
    }
});

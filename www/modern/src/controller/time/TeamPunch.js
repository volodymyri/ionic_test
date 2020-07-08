Ext.define('ess.controller.time.TeamPunch', function() {

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.ess_modern_time_team_punch',

        onActivate() {
            this.handleBackToFilter();
        },

        handleActivate : Ext.emptyFn,

        load() {
            let vm = this.getViewModel(),
                promises = [
                    vm.getStore('timesheetTypes').loadWithPromise(),
                    vm.getStore('employeeGroups').loadWithPromise(),
                    vm.getStore('payrollSchedules').loadWithPromise()
                ];

            Ext.Deferred.all(promises);
        },

        handleBackToFilter() {
            let view = this.getView(),
                form = this.lookup('teamPunchFilterForm');

            view.getLayout().setAnimation({
                    type : 'slide',
                    direction : 'right'
                }
            );

            view.setActiveItem(form);
        },

        handleBackToForm() {
            let view = this.getView();

            view.getLayout().setAnimation({
                    type : 'slide',
                    direction : 'left'
                }
            );

            view.setActiveItem(this.lookup('teamPunchForm'));
        },

        getLoadParams() {
            let vm = this.getViewModel(),
                timesheetTypeId = vm.get('options.timesheetTypeId'),
                payrollPeriodId = vm.get('options.payrollPeriodId'),
                employeeGroupIds = vm.get('options.employeeGroupIds'),
                params;

            if (vm.get('options.isCustomPeriod')) {
                params = {
                    startDate : Ext.Date.format(vm.get('options.startDate'), criterion.consts.Api.DATE_FORMAT),
                    endDate : Ext.Date.format(vm.get('options.endDate'), criterion.consts.Api.DATE_FORMAT)
                }
            } else if (payrollPeriodId) {
                params = {
                    payrollPeriodId : payrollPeriodId
                }
            }

            if (timesheetTypeId) {
                params['timesheetTypeId'] = timesheetTypeId;
            }

            if (employeeGroupIds && employeeGroupIds.length) {
                params['employeeGroups'] = employeeGroupIds.join(', ')
            }

            return params;
        },

        handleShowPunchParams(options) {
            let view = this.getView(),
                form = this.lookup('teamPunchForm'),
                vm = this.getViewModel(),
                payrollPeriodId,
                startDate, endDate,
                timesheetType;

            vm.set('options', options);

            payrollPeriodId = options['payrollPeriodId'];

            if (vm.get('options.isCustomPeriod')) {
                startDate = vm.get('options.startDate');
                endDate = vm.get('options.endDate');
            } else if (payrollPeriodId) {
                let payrollPeriod = vm.getStore('payrollPeriods').getById(payrollPeriodId);

                startDate = payrollPeriod.get('periodStartDate');
                endDate = payrollPeriod.get('periodEndDate');
            }

            timesheetType = vm.getStore('timesheetTypes').getById(vm.get('options.timesheetTypeId'));

            form.getViewModel().set({
                loadParams : this.getLoadParams(),

                date : startDate,
                startDate : startDate,
                endDate : endDate,
                timesheetType : timesheetType,
                timesheetTypeTypeIsManual : Ext.Array.contains([
                    criterion.Consts.TIMESHEET_LAYOUT_ENTRY_TYPE.MANUAL,
                    criterion.Consts.TIMESHEET_LAYOUT_ENTRY_TYPE.MANUAL_DAY], timesheetType.get('entryType'))
            });

            form.fireEvent('loadFieldsData');
            view.getLayout().setAnimation({
                    type : 'slide',
                    direction : 'left'
                }
            );

            view.setActiveItem(form);
        },

        handleShowEmployees() {
            let view = this.getView(),
                teamPunchEmployees = this.lookup('teamPunchEmployees');

            view.getLayout().setAnimation({
                    type : 'slide',
                    direction : 'right'
                }
            );

            view.setActiveItem(teamPunchEmployees);
        },

        handleSelectAllEmployees() {
            this.lookup('teamPunchEmployees').selectAllEmployees();
        },

        onEmployeeSelectionChange(grid, record, selecting, selectionModel) {
            if (!record) {
                return;
            }

            let selections = selectionModel.getSelected(),
                employeeIds = [];

            selections.each((selection) => {
                employeeIds.push(selection.get('employeeId'));
            });

            this.getViewModel().set({
                employeesSelected : selections.count(),
                selectedEmployeeIds : employeeIds
            })
        },

        handleExecutePunch() {
            let vm = this.getViewModel(),
                me = this,
                employeeIds = vm.get('selectedEmployeeIds'),
                teamPunchFormController = this.lookup('teamPunchForm').getController(),
                punchParams = teamPunchFormController.getPunchParams();

            if (!teamPunchFormController.isPunchFormValid()) {
                criterion.Utils.toast(i18n.gettext('Please fill required fields'));
                return;
            }

            if (!vm.get('employeesSelected')) {
                criterion.Utils.toast(i18n.gettext('You should select employees'));
                return;
            }

            criterion.Api.requestWithPromise({
                url : criterion.consts.Api.API.DASHBOARD_SUBORDINATE_TIMESHEETS_TEAM_PUNCH,
                method : 'POST',
                jsonData : Ext.Object.merge(punchParams, {employeeIds : employeeIds})
            }).then(function(count) {
                criterion.Msg.info(
                    count + ' ' + i18n.gettext(i18n.gettext('timesheets successfully updated')),
                    function() {
                        me.handleBackToFilter()
                    }
                );
            }, function() {
                criterion.Utils.toast(i18n.gettext('Something went wrong'));
            });
        }

    };
});

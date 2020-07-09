Ext.define('criterion.controller.employee.timesheet.dashboard.Options', function() {

    let TIMESHEET_OPTION_PERIOD = criterion.Consts.TIMESHEET_OPTION_PERIOD,
        PERIODS_TO_SHOW = 7,
        ALL_PERIODS_REC_ID = -100,
        SEC_31_DAYS = 1000 * 60 * 60 * 24 * 31;
    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_employee_timesheet_dashboard_options',

        onCancel : function() {
            let view = this.getView();

            view.fireEvent('cancel', view.initialOptions);
            view.close();
        },

        onSelect : function() {
            let view = this.getView();

            if (view.isValid()) {
                this.updateOptionsDescriptions();

                view.fireEvent('select', Ext.clone(this.getViewModel().get('options')));

                view.close();
            }
        },

        updateOptionsDescriptions : function() {
            var vm = this.getViewModel(),
                period = vm.get('options.period'),
                timesheetTypeId = vm.get('options.timesheetTypeId'),
                employeeGroupIds = vm.get('options.employeeGroupIds'),
                employeeGroups = vm.get('employeeGroups'),
                descriptions = {
                    employeeGroupsFullText : ''
                },
                TIMESHEET_OPTION_PERIOD = {};

            Ext.Object.each(criterion.Consts.TIMESHEET_OPTION_PERIOD, function(key, val) {
                TIMESHEET_OPTION_PERIOD[val.value] = val.text;
            });

            if (timesheetTypeId) {
                descriptions.timesheetType = vm.get('timesheetTypes').getById(timesheetTypeId).get('name')
            } else {
                descriptions.timesheetType = '&mdash;'
            }

            descriptions.periodName = period ? TIMESHEET_OPTION_PERIOD[period] : '&mdash;';

            if (employeeGroupIds && employeeGroupIds.length) {
                var groupNames = [];

                Ext.Array.each(employeeGroupIds, function(id) {
                    groupNames.push(employeeGroups.getById(id).get('name'));
                });

                descriptions.employeeGroupsFullText = descriptions.employeeGroups = groupNames.join(', ');

            } else {
                descriptions.employeeGroupsFullText = '&mdash;'
            }

            if (vm.get('options.isCustomPeriod')) {
                Ext.apply(descriptions, {
                    payrollSchedule : i18n.gettext('Custom Dates'),
                    startDate : vm.get('options.startDate'),
                    endDate : vm.get('options.endDate')
                });
            } else {
                var payrollPeriod = vm.get('payrollPeriods').getById(vm.get('options.payrollPeriodId')),
                    payrollSchedule = vm.get('payrollSchedules').getById(vm.get('options.payrollScheduleId'));

                Ext.apply(descriptions, {
                    payrollSchedule : payrollSchedule.get('name'),
                    startDate : payrollPeriod.get('periodStartDate'),
                    endDate : payrollPeriod.get('periodEndDate')
                });
            }

            this.getView().fireEvent('updateOptionDescription', descriptions);
        },

        onPayrollScheduleChange : function(cmp, payrollScheduleId) {
            let vm = this.getViewModel();

            if (vm.get('options.payrollScheduleId') !== payrollScheduleId) {
                vm.set('options.payrollPeriodId', null);
            }

            this.loadPayrollPeriods(payrollScheduleId);
        },

        handlePeriodChange : function(cmp, val) {
            let vm = this.getViewModel(),
                now = new Date(),
                quarter = Math.floor((now.getMonth() / 3)),
                year,
                firstDate,
                prevMonth = Ext.Date.add(now, Ext.Date.MONTH, -1);

            if (val !== TIMESHEET_OPTION_PERIOD.PAY_PERIOD.value) {
                vm.set('options.isCustomPeriod', true);
            } else {
                vm.set('options.isCustomPeriod', false);
            }

            switch (val) {
                case TIMESHEET_OPTION_PERIOD.THIS_MONTH.value:
                    vm.set('options.startDate', Ext.Date.getFirstDateOfMonth(now));
                    vm.set('options.endDate', Ext.Date.getLastDateOfMonth(now));
                    break;

                case TIMESHEET_OPTION_PERIOD.THIS_QUARTER.value:
                    firstDate = new Date(now.getFullYear(), quarter * 3, 1);
                    vm.set('options.startDate', firstDate);
                    vm.set('options.endDate', new Date(firstDate.getFullYear(), firstDate.getMonth() + 3, 0));
                    break;

                case TIMESHEET_OPTION_PERIOD.THIS_YEAR.value:
                    vm.set('options.startDate', new Date(now.getFullYear(), 0, 1));
                    vm.set('options.endDate', new Date(now.getFullYear(), 11, 31));
                    break;

                case TIMESHEET_OPTION_PERIOD.LAST_MONTH.value:
                    vm.set('options.startDate', Ext.Date.getFirstDateOfMonth(prevMonth));
                    vm.set('options.endDate', Ext.Date.getLastDateOfMonth(prevMonth));
                    break;

                case TIMESHEET_OPTION_PERIOD.LAST_QUARTER.value:
                    year = now.getFullYear();

                    if (quarter > 1) {
                        quarter--;
                    } else {
                        quarter = 3;
                        year--;
                    }

                    firstDate = new Date(year, quarter * 3, 1);
                    vm.set('options.startDate', firstDate);
                    vm.set('options.endDate', new Date(firstDate.getFullYear(), firstDate.getMonth() + 3, 0));
                    break;

                case TIMESHEET_OPTION_PERIOD.LAST_YEAR.value:
                    year = now.getFullYear() - 1;

                    vm.set('options.startDate', new Date(year, 0, 1));
                    vm.set('options.endDate', new Date(year, 11, 31));
                    break;
            }
        },

        handleLayoutChange : function(cmp, val) {
            let vm = this.getViewModel(),
                tsLayout = cmp.getSelection(),
                isAggregateTimesheet = tsLayout ? tsLayout.get('isAggregate') : false;

            vm.set('options.isAggregateTimesheet', isAggregateTimesheet);
            vm.set('options.isFTE', isAggregateTimesheet ? tsLayout.get('isFTE') : false);
        },

        loadPayrollPeriods : function(payrollScheduleId) {
            let view = this.getView(),
                vm = this.getViewModel(),
                payrollPeriods = vm.get('payrollPeriods');

            if (!payrollScheduleId) {
                return
            }

            view.setLoading(true);

            payrollPeriods.clearFilter();

            payrollPeriods.loadWithPromise({
                params : {
                    payrollScheduleId : payrollScheduleId
                }
            }).then({
                scope : this,
                success : function(records) {
                    let currentPeriod;

                    payrollPeriods.clearFilter();

                    currentPeriod = Ext.Array.findBy(payrollPeriods.getRange().reverse(), period => {
                        return period.get('periodStartDate') < new Date();
                    });

                    if (currentPeriod) {
                        vm.set('options.payrollPeriodId', currentPeriod.getId());
                    }

                    if (records.length > PERIODS_TO_SHOW) {
                        payrollPeriods.filter([{
                            property : 'periodStartDate',
                            value : new Date(Date.now() - SEC_31_DAYS),
                            operator : '>'
                        }, {
                            property : 'periodEndDate',
                            value : new Date(Date.now() + SEC_31_DAYS),
                            operator : '<'
                        }]);

                        payrollPeriods.add({
                            id : ALL_PERIODS_REC_ID,
                            periodStartDate : new Date(),
                            periodEndDate : new Date()
                        });
                    }

                    view.setLoading(false);
                }
            });
        }
    }
});
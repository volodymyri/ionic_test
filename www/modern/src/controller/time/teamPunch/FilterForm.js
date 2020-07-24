Ext.define('ess.controller.time.teamPunch.FilterForm', function() {

    const TIMESHEET_OPTION_PERIOD = criterion.Consts.TIMESHEET_OPTION_PERIOD;

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.ess_modern_time_team_punch_filter_form',

        handleTimesheetLayoutChange(cmp, val) {
            let vm = this.getViewModel(),
                selRec = cmp.getSelection(),
                employerId = selRec.get('employerId'),
                payrollSchedules = vm.get('payrollSchedules'),
                employeeGroups = vm.get('employeeGroups');

            payrollSchedules.clearFilter();
            payrollSchedules.setFilters(
                [
                    {
                        property : 'employerId',
                        value : employerId,
                        exactMatch : true
                    }
                ]
            );

            employeeGroups.clearFilter();
            employeeGroups.setFilters(
                [
                    {
                        property : 'employerId',
                        value : employerId,
                        exactMatch : true
                    }
                ]
            );
        },

        handlePeriodChange(cmp, val) {
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

        handlePayrollScheduleChange(cmp, payrollScheduleId) {
            let vm = this.getViewModel();

            if (vm.get('options.payrollScheduleId') !== payrollScheduleId) {
                vm.set('options.payrollPeriodId', null);
            }

            this.loadPayrollPeriods(payrollScheduleId);
        },

        loadPayrollPeriods(payrollScheduleId) {
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
                success : function() {
                    view.setLoading(false);
                }
            })
        },

        handleNext() {
            let filterForm = this.lookup('filterForm'),
                vm = this.getViewModel();

            if (filterForm.isValid()) {
                this.getView().fireEvent('showPunchParams', vm.get('options'));
            }
        }
    };
});

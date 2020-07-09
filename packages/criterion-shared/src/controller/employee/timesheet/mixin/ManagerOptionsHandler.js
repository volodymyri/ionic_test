Ext.define('criterion.controller.employee.timesheet.mixin.ManagerOptionsHandler', function() {

    let timesheetTypes;

    return {

        mixinId : 'criterion_employee_timesheet_mixin_manager_options_handler',

        requires : [
            'criterion.store.TimesheetTypes',
            'criterion.store.employer.payroll.Schedules',
            'criterion.store.EmployeeGroups',
            'criterion.store.employer.payroll.payrollSchedule.PayrollPeriods'
        ],

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex'
        ],

        onAfterRenderOptionsButton() {
            let vm = this.getViewModel(),
                timesheetNeighborsStore = vm.getStore('timesheetNeighbors'),
                options = criterion.Utils.getRuntimeValue(criterion.Consts.RUNTIME_VALUES.TEAM_TIMESHEET_OPTIONS),
                optionsDescription = criterion.Utils.getRuntimeValue(criterion.Consts.RUNTIME_VALUES.TEAM_TIMESHEET_OPTIONS_DESCRIPTIONS),
                timesheetNeighborsStoreData = criterion.Utils.getRuntimeValue(criterion.Consts.RUNTIME_VALUES.TEAM_TIMESHEET_LIST),
                params = {
                    timesheetId : vm.get('timesheetId')
                },
                employeeName = criterion.Utils.getRuntimeValue(criterion.Consts.RUNTIME_VALUES.TEAM_TIMESHEET_EMPLOYEE_NAME);

            if (timesheetNeighborsStore) {
                if (timesheetNeighborsStoreData) {
                    timesheetNeighborsStore.loadData(timesheetNeighborsStoreData);
                } else if (options && !timesheetNeighborsStore.isLoaded()) {
                    if (options.isCustomPeriod) {
                        params['startDate'] = Ext.Date.format(options.startDate, criterion.consts.Api.DATE_FORMAT);
                        params['endDate'] = Ext.Date.format(options.endDate, criterion.consts.Api.DATE_FORMAT);
                    } else if (options.payrollPeriodId) {
                        params['payrollPeriodId'] = options.payrollPeriodId;
                    }

                    if (options.timesheetTypeId) {
                        params['timesheetTypeId'] = options.timesheetTypeId;
                    }

                    if (employeeName) {
                        params['employeeName'] = employeeName;
                    }

                    if (options.employeeGroupIds && options.employeeGroupIds.length) {
                        params['employeeGroups'] = options.employeeGroupIds.join(', ');
                    }

                    timesheetNeighborsStore.load({
                        params : params
                    });
                }
            }

            if (options) {
                vm.set('options', options);
            }

            if (optionsDescription) {
                vm.set('optionDescription', optionsDescription);
            }
        },

        onShowOptions() {
            let me = this,
                vm = me.getViewModel(),
                optionsWindow = Ext.create('criterion.view.employee.timesheet.dashboard.Options', {
                    viewModel : {
                        data : {
                            options : criterion.Utils.getRuntimeValue(criterion.Consts.RUNTIME_VALUES.TEAM_TIMESHEET_OPTIONS)
                        },
                        stores : {
                            payrollSchedules : {
                                type : 'criterion_employer_payroll_schedules',
                                sorters : [
                                    {
                                        property : 'periodStartDate',
                                        direction : 'ASC'
                                    }
                                ]
                            },
                            timesheetTypes : {
                                type : 'criterion_timesheet_types'
                            },
                            payrollPeriods : {
                                type : 'criterion_employer_payroll_payroll_schedule_payroll_periods'
                            },
                            employeeGroups : {
                                type : 'criterion_employee_groups'
                            }
                        }
                    },

                    listeners : {
                        show : () => {
                            let vm = optionsWindow.getViewModel(),
                                timesheetTypes = vm.get('timesheetTypes'),
                                employeeGroups = vm.get('employeeGroups'),
                                payrollPeriods = vm.get('payrollPeriods'),
                                payrollSchedules = vm.get('payrollSchedules');

                            optionsWindow.initialOptions = Ext.clone(this.getViewModel().get('options'));
                            optionsWindow.setLoading(true);

                            Ext.Deferred.all([
                                timesheetTypes.loadWithPromise(),
                                employeeGroups.loadWithPromise(),
                                payrollPeriods.loadWithPromise(),
                                payrollSchedules.loadWithPromise()
                            ]).then(() => {
                                optionsWindow.initialOptions = Ext.clone(vm.get('options'));
                                optionsWindow.lookup('timesheetType').focus();
                            }).always(() => optionsWindow.setLoading(false));
                        },

                        select : options => {
                            let timesheetNeighborsStore = vm.getStore('timesheetNeighbors'),
                                params = {
                                    timesheetId : vm.get('timesheetId')
                                },
                                employeeName = criterion.Utils.getRuntimeValue(criterion.Consts.RUNTIME_VALUES.TEAM_TIMESHEET_EMPLOYEE_NAME);

                            criterion.Utils.setRuntimeValue(criterion.Consts.RUNTIME_VALUES.TEAM_TIMESHEET_OPTIONS, options);

                            vm.set('options', options);

                            if (options.isCustomPeriod) {
                                params['startDate'] = Ext.Date.format(options.startDate, criterion.consts.Api.DATE_FORMAT);
                                params['endDate'] = Ext.Date.format(options.endDate, criterion.consts.Api.DATE_FORMAT);
                            } else if (options.payrollPeriodId) {
                                params['payrollPeriodId'] = options.payrollPeriodId;
                            }

                            if (options.timesheetTypeId) {
                                params['timesheetTypeId'] = options.timesheetTypeId;
                            }

                            if (employeeName) {
                                params['employeeName'] = employeeName;
                            }

                            if (options.employeeGroupIds && options.employeeGroupIds.length) {
                                params['employeeGroups'] = options.employeeGroupIds.join(', ');
                            }

                            timesheetNeighborsStore.loadWithPromise({
                                params : params
                            }).then(function() {
                                criterion.Utils.setRuntimeValue(criterion.Consts.RUNTIME_VALUES.TEAM_TIMESHEET_LIST, timesheetNeighborsStore.getRange());
                            });
                        },

                        cancel : initialOptions => vm.set('options', initialOptions),

                        destroy : () => {
                            me.setCorrectMaskZIndex(false);
                        },

                        updateOptionDescription : description => {
                            vm.set('optionDescription', description);
                            criterion.Utils.setRuntimeValue(criterion.Consts.RUNTIME_VALUES.TEAM_TIMESHEET_OPTIONS_DESCRIPTIONS, description);
                        }
                    }
                });

            optionsWindow.show();

            this.setCorrectMaskZIndex(true);
        },

        handleTimesheetChange(cmp, value) {
            if (value && this.getViewModel().get('timesheetId') !== value) {
                this.redirectTo(criterion.consts.Route.SELF_SERVICE.TIME_TIMESHEETS + '/' + value + '-manager');
            }
        },

        handlePrev() {
            let timesheetNeighborsStore = this.getViewModel().getStore('timesheetNeighbors'),
                teamMember = this.lookup('teamMember'),
                currentRecord = teamMember && teamMember.getSelection(),
                currentIndex = timesheetNeighborsStore && currentRecord && timesheetNeighborsStore.indexOf(currentRecord),
                prevRecord = timesheetNeighborsStore.getAt(currentIndex - 1);

            if (timesheetNeighborsStore && teamMember) {
                if (prevRecord) {
                    teamMember.select(prevRecord);
                } else {
                    teamMember.select(timesheetNeighborsStore.getAt(timesheetNeighborsStore.count() - 1));
                }
            }
        },

        handleNext() {
            let timesheetNeighborsStore = this.getViewModel().getStore('timesheetNeighbors'),
                teamMember = this.lookup('teamMember'),
                currentRecord = teamMember && teamMember.getSelection(),
                currentIndex = timesheetNeighborsStore && currentRecord && timesheetNeighborsStore.indexOf(currentRecord),
                nextRecord = timesheetNeighborsStore.getAt(currentIndex + 1);

            if (timesheetNeighborsStore && teamMember) {
                if (nextRecord) {
                    teamMember.select(nextRecord);
                } else {
                    teamMember.select(timesheetNeighborsStore.getAt(0));
                }
            }
        }
    }
});

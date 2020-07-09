Ext.define('criterion.controller.ess.time.AttendanceDashboard', function() {

    return {

        extend : 'criterion.controller.GridView',

        alias : 'controller.criterion_selfservice_time_attendance_dashboard',

        requires : [
            'criterion.view.ess.time.attendanceDashboard.Options',
            'criterion.view.ess.time.attendanceDashboard.Exception',
            'criterion.view.ess.time.attendanceDashboard.OptionsOvertime'
        ],

        suppressIdentity : ['employeeContext'],

        load(opts) {
            let view = this.getView(),
                vm = this.getViewModel(),
                isOvertime = vm.get('isOvertime'),
                employeeGroupIds = vm.get('employeeGroupIds'),
                dailyHrsGrt = vm.get('dailyHrsGrt'),
                weeklyHrsGrt = vm.get('weeklyHrsGrt'),
                shiftGapGrt = vm.get('shiftGapGrt'),
                isCurrentlyWorking = vm.get('isCurrentlyWorking'),
                params = {};

            if (Ext.isArray(employeeGroupIds) && employeeGroupIds.length) {
                params.employeeGroupIds = employeeGroupIds.join(',');
            } else {
                return;
            }

            if (isOvertime) {
                dailyHrsGrt && (params.dailyHrsGrt = dailyHrsGrt);
                weeklyHrsGrt && (params.weeklyHrsGrt = weeklyHrsGrt);
                shiftGapGrt && (params.shiftGapGrt = shiftGapGrt);
                isCurrentlyWorking && (params.isCurrentlyWorking = isCurrentlyWorking);
            }

            view.getStore().loadWithPromise({
                params : params
            }).then(data => {
                if (!isOvertime) {
                    let hasScheduledHours = false,
                        hasVariance = false;

                    Ext.Array.each(data, rec => {
                        if (rec.get('scheduledHours')) {
                            hasScheduledHours = true;
                        }

                        if (rec.get('variance')) {
                            hasVariance = true;
                        }
                    });

                    vm.set({
                        hideScheduledHours : !hasScheduledHours,
                        hideVariance : !hasVariance
                    });
                }
            });
        },

        handleActivate() {
            let me = this,
                vm = me.getViewModel();

            if (this.checkViewIsActive()) {
                vm.getStore('employeeGroups').loadWithPromise();
            }
        },

        handleChangeDate(cmp, value) {
            this.load();
        },

        handleOptionsVariance() {
            let optionWnd,
                me = this,
                vm = this.getViewModel();

            optionWnd = Ext.create('criterion.view.ess.time.attendanceDashboard.Options', {
                viewModel : {
                    data : {
                        date : vm.get('date'),
                        employeeGroupIds : vm.get('employeeGroupIds')
                    },
                    stores : {
                        employeeGroups : vm.getStore('employeeGroups')
                    }
                }
            });

            optionWnd.on({
                cancel : () => {
                    optionWnd.destroy();
                },
                applyOptions : data => {
                    vm.set({
                        date : data.date,
                        employeeGroupIds : data.employeeGroupIds
                    });

                    me.load();
                    optionWnd.destroy();
                }
            });
            optionWnd.show();
        },

        handleOptionsOvertime() {
            let optionWnd,
                me = this,
                vm = this.getViewModel();

            optionWnd = Ext.create('criterion.view.ess.time.attendanceDashboard.OptionsOvertime', {
                viewModel : {
                    data : {
                        date : vm.get('date'),
                        employeeGroupIds : vm.get('employeeGroupIds'),

                        dailyHrsGrt : vm.get('dailyHrsGrt'),
                        weeklyHrsGrt : vm.get('weeklyHrsGrt'),
                        shiftGapGrt : vm.get('shiftGapGrt'),
                        isCurrentlyWorking : vm.get('isCurrentlyWorking')
                    },
                    stores : {
                        employeeGroups : vm.getStore('employeeGroups')
                    }
                }
            });

            optionWnd.on({
                cancel : () => {
                    optionWnd.destroy();
                },
                applyOptions : data => {
                    vm.set({
                        date : data.date,
                        employeeGroupIds : data.employeeGroupIds,

                        dailyHrsGrt : data.dailyHrsGrt,
                        weeklyHrsGrt : data.weeklyHrsGrt,
                        shiftGapGrt : data.shiftGapGrt,
                        isCurrentlyWorking : data.isCurrentlyWorking
                    });

                    me.load();
                    optionWnd.destroy();
                }
            });
            optionWnd.show();
        },

        createExceptionEditor(globalException, record) {
            let exceptionWnd,
                me = this,
                vm = this.getViewModel();

            exceptionWnd = Ext.create('criterion.view.ess.time.attendanceDashboard.Exception', {
                viewModel : {
                    data : {
                        globalException : globalException,
                        date : vm.get('date'),
                        employeeGroupIds : vm.get('employeeGroupIds'),
                        employeeId : record && record.get('employeeId'),
                        employeeName : record && record.get('fullName'),
                        hasExceptions : record && record.get('hasExceptions')
                    }
                }
            });

            exceptionWnd.on({
                cancel : () => {
                    exceptionWnd.destroy();
                },
                afterModified : data => {
                    me.load();
                    exceptionWnd.destroy();
                }
            });
            exceptionWnd.show();
        },

        handleGlobalException() {
            this.createExceptionEditor(true);
        },

        handleEditEmployeeException(record) {
            this.createExceptionEditor(false, record);
        },

        dateSelectorSelect(datemenu, value) {
            this.getViewModel().set('date', value);
            this.getView().fireEvent('changeDate');
        },

        dateSelectorShow(datemenu) {
            datemenu.picker.setValue(this.getViewModel().get('date'));
        }
    };
});

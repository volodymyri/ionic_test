Ext.define('criterion.controller.moduleToolbar.EssActions', function() {

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_moduletoolbar_ess_actions',

        requires : [
            'criterion.store.employee.WorkLocations',
            'criterion.store.employee.timesheet.AvailableTasks',
            'criterion.store.employee.timesheet.AvailableAssignments',
            'criterion.store.employee.timesheet.Incomes',
            'criterion.store.employee.timesheet.AvailableProjects',
            'criterion.store.workLocation.Areas',
            'criterion.model.employee.timesheet.Task',
            'criterion.model.employee.timesheet.Vertical',
            'criterion.view.employee.timesheet.vertical.CheckIn'
        ],

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex'
        ],

        listen : {
            global : {
                timeEntryInOut : 'loadStartData'
            }
        },

        init : function() {
            this.callParent(arguments);

            this.loadStartData();
        },

        loadStartData : function() {
            let vm = this.getViewModel();

            vm.set({
                startData : null,
                startedTask : null,
                timesheetVertical : null
            });

            return criterion.Api.requestWithPromise({
                url : criterion.consts.Api.API.TIME_ENTRY_START_DATA,
                method : 'GET'
            }).then(function(startData) {
                if (startData && startData.startedTask) {
                    vm.set('startedTask', Ext.create('criterion.model.employee.timesheet.Task', startData.startedTask));
                }

                vm.set('startData', startData);
            });
        },

        onMenuShow : function(button, menu) {
            let vm = this.getViewModel(),
                startData = vm.get('startData'),
                timesheetVerticalId = startData && startData.timesheetVerticalId,
                timesheetVertical;

            if (timesheetVerticalId) {
                vm.set('timesheetVertical', null);

                timesheetVertical = Ext.create('criterion.model.employee.timesheet.Vertical', {id : timesheetVerticalId});

                menu.setLoading(true);
                timesheetVertical.loadWithPromise({
                    params : {
                        timesheetId : timesheetVerticalId,
                        timezoneOffset : new Date().getTimezoneOffset()
                    }
                }).then({
                    scope : this,
                    success : function() {
                        vm.set('timesheetVertical', timesheetVertical);
                        menu.setLoading(false);
                    },
                    failure : function() {
                        menu.setLoading(false);
                    }
                });
            }
        },

        onInOutClick : function() {
            let me = this,
                vm = this.getViewModel(),
                isStarted = vm.get('isStarted'),
                attestationMessage = vm.get('timesheetVertical.timesheetType.attestationMessage');

            if (!isStarted) {
                this.createCheckInPicker();
            } else {
                if (attestationMessage) {
                    criterion.Msg.confirm(
                        {
                            icon : criterion.Msg.QUESTION,
                            message : attestationMessage,
                            buttons : criterion.Msg.OKCANCEL,
                            closable : false,
                            callback : btn => {
                                if (btn === 'ok') {
                                    me.timeEntryStop();
                                }
                            }
                        }
                    );
                } else {
                    this.timeEntryStop();
                }
            }
        },

        createCheckInPicker() {
            let me = this,
                vm = this.getViewModel(),
                startData = vm.get('startData'),
                picker;

            if (!startData) {
                criterion.Utils.toast(i18n.gettext('Something went wrong'));

                return;
            }

            picker = Ext.create('criterion.view.employee.timesheet.vertical.CheckIn', {
                viewModel : {
                    data : {
                        timesheetRecord : vm.get('timesheetVertical')
                    },
                    stores : {
                        workLocations : {
                            type : 'criterion_employee_work_locations',
                            data : startData.employeeWorkLocations
                        },
                        availableProjects : {
                            type : 'criterion_employee_timesheet_available_projects',
                            data : startData.availableProjects
                        },
                        availableTasks : {
                            type : 'criterion_employee_timesheet_available_tasks',
                            data : startData.availableTasks
                        },
                        availableAssignments : {
                            type : 'criterion_employee_timesheet_available_assignments',
                            data : startData.assignments
                        },
                        incomeCodes : {
                            type : 'criterion_employee_timesheet_available_incomes',
                            data : startData.employeePaycodes
                        },
                        workLocationAreas : {
                            type : 'work_location_areas',
                            data : startData.workLocationAreas
                        }
                    }
                }
            });

            picker.on('close', function() {
                me.setCorrectMaskZIndex(false);
                picker.destroy();
            });

            picker.show();

            me.setCorrectMaskZIndex(true, picker);
        },

        timeEntryStop() {
            let vm = this.getViewModel(),
                startedTask = vm.get('startedTask');

            criterion.Api.requestWithPromise({
                url : criterion.consts.Api.API.TIME_ENTRY_STOP,
                method : 'PUT',
                jsonData : {
                    employerWorkLocationId : startedTask.get('employerWorkLocationId')
                }
            }).then(function() {
                Ext.GlobalEvents.fireEvent('timeEntryInOut');
            });
        },

        handleRequestTimeOff : function() {
            // this need for init procedure in the time off dashboard controller
            this.redirectTo(criterion.consts.Route.SELF_SERVICE.TIME_TIME_OFF_DASHBOARD, null);
            Ext.defer(function() {
                Ext.GlobalEvents.fireEvent('requestTimeOff');
            }, 2000);
        }
    }
});

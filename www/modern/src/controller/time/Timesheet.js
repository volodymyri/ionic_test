Ext.define('ess.controller.time.Timesheet', function() {

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.ess_modern_time_timesheet',

        onActivate : function() {
            this.handleBack();
        },

        handleActivate : Ext.emptyFn,

        load : function() {
            let vm = this.getViewModel(),
                employeeId = vm.get('employeeId'),
                employeeTimesheets = vm.getStore('employeeTimesheets'),
                promises = [
                    vm.getStore('customdata').loadWithPromise({
                        params : {
                            entityTypeCd : criterion.CodeDataManager.getCodeDetailRecord('code', criterion.Consts.getCustomizableEntities().CUSTOMIZABLE_ENTITY_TIMESHEET_DETAIL.code, criterion.consts.Dict.ENTITY_TYPE).getId()
                        }
                    }),
                    employeeTimesheets.loadWithPromise({
                        params : {
                            employeeId : employeeId
                        }
                    })
                ];

            Ext.Deferred.all(promises).then(function() {
                let isManualDay = employeeTimesheets.find('isManualDay', true, 0, false, false, true) !== -1;

                vm.set('hideAddTimesheetButton', isManualDay);

                if (isManualDay) {
                    employeeTimesheets.removeAll();
                }
            });
        },

        setTimesheet : function(timesheet) {
            var view = this.getView(),
                wrapper;

            switch (timesheet.get('formatCode')) {
                case criterion.Consts.TIMESHEET_FORMAT.VERTICAL:
                    wrapper = view.down('#timesheetsVerticalGrid');
                    break;
                case criterion.Consts.TIMESHEET_FORMAT.HORIZONTAL:
                    wrapper = view.down('#timesheetsHorizontalGrid');
                    break;
                case criterion.Consts.TIMESHEET_FORMAT.AGGREGATE:
                    wrapper = view.down('#timesheetsAggregateGrid');
                    break;
                default :
                    throw new Error('Unsupported Timesheet Type');
                    break;
            }

            wrapper.getViewModel().set('timesheetRecord', timesheet);
            wrapper.getController().resetCardState();
            view.setActiveItem(wrapper);
        },

        handleBack : function() {
            var view = this.getView(),
                vm = this.getViewModel();

            view.setActiveItem(view.down('#timesheetsList'));
            vm.getStore('employeeTimesheets').loadWithPromise({
                params : {
                    employeeId : vm.get('employeeId')
                }
            });
        },

        handleAddTimesheet : function() {
            var me = this,
                vm = this.getViewModel(),
                offset = new Date().getTimezoneOffset(),
                employeeId = vm.get('employeeId');

            criterion.Api.requestWithPromise({
                url : criterion.consts.Api.API.EMPLOYEE_TIMESHEET,
                method : 'POST',
                urlParams : {
                    employeeId : employeeId, // initiator
                    isNext : true,
                    timezoneOffset : offset
                },
                jsonData : {
                    employeeId : employeeId // target
                }
            }).then({
                scope : this,
                success : function(result) {
                    var store = vm.getStore('employeeTimesheets'),
                        recs;

                    recs = store.insert(0, result);
                    me.setTimesheet(recs[0]);
                }
            })
        },

        handleEditAction : function(view, num, row, record) {
            this.setTimesheet(record);
        }

    };
});

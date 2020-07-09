Ext.define('ess.controller.dashboard.timesheet.Vertical', function() {

    return {

        extend : 'ess.controller.dashboard.timesheet.Base',

        alias : 'controller.ess_modern_dashboard_timesheet_vertical',

        requires : [
            'criterion.model.employee.timesheet.Vertical'
        ],

        getTimesheetDetailStore : function() {
            return this.getViewModel().get('timesheet.days');
        },

        loadTimesheetDetailStore : function() {
            var vm = this.getViewModel(),
                delegatedByEmployeeId = vm.get('delegatedByEmployeeId');

            return criterion.model.employee.timesheet.Vertical.loadWithPromise(vm.get('timesheetRecord.id'), {
                params : Ext.Object.merge(
                    {
                        timesheetId : vm.get('timesheetRecord.id'),
                        timezoneOffset : new Date().getTimezoneOffset()
                    },
                    (delegatedByEmployeeId ? {delegatedByEmployeeId : delegatedByEmployeeId} : {})
                )
            }).then(function(timesheet) {
                vm.set('timesheet', timesheet);
            });
        }
    };
});

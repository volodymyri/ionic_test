Ext.define('ess.controller.time.TimesheetsGridView', function() {

    return {

        extend : 'criterion.controller.employee.GridView',

        alias : 'controller.ess_modern_time_timesheets_gridview',

        requires : [
            'criterion.model.mobile.employee.timesheet.task.Detail'
        ],

        getEmptyRecord : function() {
            return {
                employeeId : this.getViewModel().get('employeeId')
            };
        }
    };
});

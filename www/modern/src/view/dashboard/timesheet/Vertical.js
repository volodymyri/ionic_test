Ext.define('ess.view.dashboard.timesheet.Vertical', function() {

    return {
        alias : 'widget.ess_modern_dashboard_timesheet_vertical',

        extend : 'ess.view.dashboard.timesheet.Base',

        requires : [
            'ess.controller.dashboard.timesheet.Vertical'
        ],

        controller : 'ess_modern_dashboard_timesheet_vertical',

        timesheetDetailStoreName : 'timesheet.days'

    }
});

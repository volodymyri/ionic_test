Ext.define('ess.view.dashboard.timesheet.Horizontal', function() {

    return {
        alias : 'widget.ess_modern_dashboard_timesheet_horizontal',

        extend : 'ess.view.dashboard.timesheet.Base',

        timesheetDetailStoreName : 'timesheetDetails',

        requires : [
            'ess.controller.dashboard.timesheet.Horizontal'
        ],

        controller : 'ess_modern_dashboard_timesheet_horizontal'
    }
});

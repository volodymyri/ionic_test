Ext.define('criterion.controller.ess.dashboard.RightLeftPanel', function() {

    return {
        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_selfservice_dashboard_right_left_panel',

        gotoTimeOffs() {
            this.redirectTo(criterion.consts.Route.SELF_SERVICE.TIME_TIME_OFF_DASHBOARD, null);
        },

        gotoTimesheets() {
            this.redirectTo(criterion.consts.Route.SELF_SERVICE.TIME_TIMESHEETS_CURRENT, null);
        },

        gotoPayrolls() {
            this.redirectTo(criterion.consts.Route.SELF_SERVICE.PAYROLL_PAY_HISTORY_LAST, null);
        },

        gotoEvents() {
            this.redirectTo(criterion.consts.Route.SELF_SERVICE.CALENDAR_EVENTS, null);
        }
    }
});

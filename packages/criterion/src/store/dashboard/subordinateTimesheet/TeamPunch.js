Ext.define('criterion.store.dashboard.subordinateTimesheet.TeamPunch', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.store.AbstractStore',

        alias : 'store.criterion_dashboard_subordinate_timesheet_team_punch',

        model : 'criterion.model.dashboard.subordinateTimesheet.TeamPunch',
        autoLoad : false,
        autoSync : false,

        proxy : {
            type : 'criterion_rest',
            url : API.DASHBOARD_SUBORDINATE_TIMESHEETS_TEAM_PUNCH
        }
    };

});

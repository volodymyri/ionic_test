Ext.define('criterion.store.dashboard.subordinateTimesheet.Grid', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.store.AbstractStore',

        alias : 'store.criterion_dashboard_subordinate_timesheet_grid',
        model : 'criterion.model.dashboard.subordinateTimesheet.Grid',

        autoLoad : false,
        autoSync : false,

        proxy : {
            type : 'criterion_rest',
            url : API.DASHBOARD_SUBORDINATE_TIMESHEETS_GRID
        }
    };

});

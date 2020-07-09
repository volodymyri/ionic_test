Ext.define('criterion.store.dashboard.subordinateTimesheet.Neighbors', function() {

    return {
        extend : 'criterion.store.AbstractStore',

        alias : 'store.criterion_dashboard_subordinate_timesheet_neighbors',

        model : 'criterion.model.dashboard.subordinateTimesheet.Neighbor',
        autoLoad : false,
        autoSync : false,

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.DASHBOARD_SUBORDINATE_TIMESHEETS_NEIGHBORS
        }
    };

});

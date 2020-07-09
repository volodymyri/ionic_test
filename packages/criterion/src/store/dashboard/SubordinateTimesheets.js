Ext.define('criterion.store.dashboard.SubordinateTimesheets', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.store.AbstractStore',

        alias : 'store.criterion_dashboard_subordinate_timesheets',

        model: 'criterion.model.dashboard.SubordinateTimesheet',
        autoLoad : false,
        autoSync : false,

        proxy : {
            type : 'criterion_rest',
            url : API.DASHBOARD_SUBORDINATE_TIMESHEETS
        }
    };

});
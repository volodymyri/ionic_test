Ext.define('criterion.store.dashboard.subordinateTimesheet.AvailableAreas', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.store.AbstractStore',

        alias : 'store.criterion_dashboard_subordinate_timesheet_available_areas',

        model : 'criterion.model.workLocation.Area',

        autoLoad : false,
        autoSync : false,

        proxy : {
            type : 'criterion_rest',
            url : API.DASHBOARD_SUBORDINATE_TIMESHEETS_AVAILABLE_AREAS
        }
    };

});

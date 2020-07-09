Ext.define('criterion.store.dashboard.subordinateTimesheet.AvailableWorkLocations', function() {

    return {
        extend : 'criterion.store.AbstractStore',

        alias : 'store.criterion_dashboard_subordinate_timesheet_available_work_locations',

        model : 'criterion.model.WorkLocation',

        autoLoad : false,
        autoSync : false,

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.DASHBOARD_SUBORDINATE_TIMESHEETS_AVAILABLE_WORK_LOCATIONS
        }
    };

});

Ext.define('criterion.store.dashboard.subordinateTimesheet.MassSubmit', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.store.AbstractStore',

        alias : 'store.criterion_dashboard_subordinate_timesheet_mass_submit',

        model : 'criterion.model.dashboard.subordinateTimesheet.MassSubmit',
        autoLoad : false,
        autoSync : false,

        proxy : {
            type : 'criterion_rest',
            url : API.DASHBOARD_SUBORDINATE_TIMESHEETS_MASS_SUBMIT
        }
    };

});

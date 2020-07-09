Ext.define('criterion.store.dashboard.subordinateTimesheet.AvailableTasks', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.store.AbstractStore',

        alias : 'store.criterion_dashboard_subordinate_timesheet_available_tasks',

        model : 'criterion.model.employer.Task',

        autoLoad : false,
        autoSync : false,

        proxy : {
            type : 'criterion_rest',
            url : API.DASHBOARD_SUBORDINATE_TIMESHEETS_AVAILABLE_TASKS
        }
    };

});

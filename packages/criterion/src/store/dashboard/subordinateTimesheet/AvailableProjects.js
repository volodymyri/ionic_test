Ext.define('criterion.store.dashboard.subordinateTimesheet.AvailableProjects', function() {

    return {
        extend : 'criterion.store.AbstractStore',

        alias : 'store.criterion_dashboard_subordinate_timesheet_available_projects',

        model : 'criterion.model.employer.Project',

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.DASHBOARD_SUBORDINATE_TIMESHEETS_AVAILABLE_PROJECTS
        }
    };

});

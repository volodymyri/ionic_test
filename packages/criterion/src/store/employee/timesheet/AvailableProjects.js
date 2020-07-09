Ext.define('criterion.store.employee.timesheet.AvailableProjects', function() {

    return {

        extend : 'criterion.store.AbstractStore',

        alias : 'store.criterion_employee_timesheet_available_projects',

        model : 'criterion.model.employee.timesheet.AvailableProject',

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.EMPLOYEE_TIMESHEET_AVAILABLE_PROJECTS
        }
    };

});

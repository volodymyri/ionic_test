Ext.define('criterion.store.employee.timesheet.AvailableTasks', function() {

    return {

        extend : 'criterion.store.AbstractStore',

        alias : 'store.criterion_employee_timesheet_available_tasks',

        model : 'criterion.model.employee.timesheet.AvailableTask',

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.EMPLOYEE_TIMESHEET_AVAILABLE_TASKS
        }
    };

});

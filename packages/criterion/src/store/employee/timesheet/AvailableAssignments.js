Ext.define('criterion.store.employee.timesheet.AvailableAssignments', function() {

    var API = criterion.consts.Api.API;

    return {

        extend : 'criterion.data.Store',

        alias : 'store.criterion_employee_timesheet_available_assignments',

        model : 'criterion.model.employee.timesheet.AvailableAssignment',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_TIMESHEET_AVAILABLE_ASSIGNMENTS
        }
    };

});

Ext.define('criterion.store.employee.Timesheets', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.data.Store',
        alias : 'store.criterion_employee_timesheets',

        model : 'criterion.model.employee.Timesheet',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_TIMESHEET
        }
    };

});

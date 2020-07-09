Ext.define('criterion.store.employee.timesheet.ByDate', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.data.Store',
        alias : 'store.criterion_employee_timesheet_details_by_date',

        model : 'criterion.model.employee.timesheet.ByDate',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_TIMESHEET_TASK_BY_DATE
        }
    };

});

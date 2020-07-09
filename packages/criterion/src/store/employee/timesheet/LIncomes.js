Ext.define('criterion.store.employee.timesheet.LIncomes', function() {

    return {
        extend : 'criterion.data.Store',

        alias : 'store.criterion_employee_timesheet_lincomes',

        model : 'criterion.model.employee.timesheet.Income',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.EMPLOYEE_TIMESHEET_INCOME_CODES
        }

    };

});

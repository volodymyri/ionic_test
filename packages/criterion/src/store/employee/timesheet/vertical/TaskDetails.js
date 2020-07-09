Ext.define('criterion.store.employee.timesheet.vertical.TaskDetails', function() {

    return {
        extend : 'criterion.store.AbstractStore',
        model : 'criterion.model.employee.timesheet.vertical.TaskDetail',
        alias : 'store.criterion_employee_timesheet_vertical_task_details',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.EMPLOYEE_TIMESHEET_VERTICAL_TASK_DETAIL,
            batchOrder : 'destroy,create,update' // order was change for a correct validation in the BE part
        }
    };
});


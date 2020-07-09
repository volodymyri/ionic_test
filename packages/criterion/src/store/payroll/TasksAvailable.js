Ext.define('criterion.store.payroll.TasksAvailable', function() {

    return {
        extend : 'criterion.data.Store',

        alias : 'store.criterion_payroll_tasks_available',

        model : 'criterion.model.employer.Task',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.PAYROLL_TASKS_AVAILABLE
        }
    };
});

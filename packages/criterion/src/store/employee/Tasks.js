Ext.define('criterion.store.employee.Tasks', function() {

    return {
        extend : 'criterion.data.Store',

        alias : 'store.criterion_employee_tasks',

        model : 'criterion.model.employee.Task',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.EMPLOYEE_TASK
        }
    };

});

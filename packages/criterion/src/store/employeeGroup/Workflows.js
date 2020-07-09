Ext.define('criterion.store.employeeGroup.Workflows', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.store.AbstractStore',
        alias : 'store.criterion_employee_group_workflows',

        model : 'criterion.model.employeeGroup.Workflow',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_GROUP_WORKFLOW
        }
    };
});

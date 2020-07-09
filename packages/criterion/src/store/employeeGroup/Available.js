Ext.define('criterion.store.employeeGroup.Available', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.store.AbstractStore',
        alias : 'store.criterion_employee_group_available',

        model : 'criterion.model.employeeGroup.Available',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_GROUP_COMPANY_AVAILABLE
        }
    };
});

Ext.define('criterion.store.employeeGroup.Overtimes', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.store.AbstractStore',
        alias : 'store.criterion_employee_group_overtimes',

        model : 'criterion.model.employeeGroup.Overtime',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_GROUP_OVERTIME
        }
    };
});

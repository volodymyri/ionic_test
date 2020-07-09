Ext.define('criterion.store.employeeGroup.PayGroups', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.store.AbstractStore',
        alias : 'store.criterion_employee_group_pay_groups',

        model : 'criterion.model.employeeGroup.PayGroup',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_GROUP_PAY_GROUP
        }
    };
});

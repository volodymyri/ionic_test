Ext.define('criterion.store.payGroup.Employees', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.data.Store',

        alias : 'store.criterion_pay_group_employees',

        model : 'criterion.model.payGroup.Employee',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.PAY_GROUP_EMPLOYEE
        }
    };
});

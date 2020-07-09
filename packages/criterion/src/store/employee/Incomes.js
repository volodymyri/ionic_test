Ext.define('criterion.store.employee.Incomes', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.data.Store',
        alias : 'store.criterion_employee_incomes',

        model : 'criterion.model.employee.Income',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_INCOME
        }
    };

});

Ext.define('criterion.store.employee.Taxes', function() {

    var API = criterion.consts.Api.API;

    return {

        alias : 'store.criterion_employee_taxes',

        extend : 'criterion.store.AbstractStore',

        model : 'criterion.model.employee.Tax',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_TAX
        }
    };

});

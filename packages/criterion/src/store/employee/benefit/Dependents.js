Ext.define('criterion.store.employee.benefit.Dependents', function() {

    var API = criterion.consts.Api.API;

    return {

        extend : 'criterion.data.Store',
        alias : 'store.criterion_employee_benefit_dependents',

        model : 'criterion.model.employee.benefit.Dependent',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_BENEFIT_DEPENDENT
        }
    };

});

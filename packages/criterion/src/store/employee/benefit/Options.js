Ext.define('criterion.store.employee.benefit.Options', function() {

    var API = criterion.consts.Api.API;

    return {

        extend : 'criterion.data.Store',
        alias : 'store.criterion_employee_benefit_options',

        model : 'criterion.model.employee.benefit.Option',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_BENEFIT_OPTION
        }
    };

});

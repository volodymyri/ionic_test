Ext.define('criterion.store.employee.Reviews', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.data.Store',

        alias : 'store.criterion_employee_reviews',

        model : 'criterion.model.employee.Review',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_REVIEW
        }
    };

});

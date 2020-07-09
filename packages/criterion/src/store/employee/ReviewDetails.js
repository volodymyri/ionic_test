Ext.define('criterion.store.employee.ReviewDetails', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.data.Store',

        alias : 'store.criterion_employee_review_details',

        model : 'criterion.model.employee.ReviewDetail',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE
    };

});

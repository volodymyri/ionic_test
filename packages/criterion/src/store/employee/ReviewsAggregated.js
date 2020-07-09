Ext.define('criterion.store.employee.ReviewsAggregated', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.data.Store',

        alias : 'store.criterion_employee_reviews_aggregated',

        model : 'criterion.model.employee.ReviewAggregated',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_REVIEW_AGGREGATED
        }
    };

});

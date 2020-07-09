Ext.define('criterion.store.employee.ReviewsList', function() {

    return {
        extend : 'criterion.data.Store',

        alias : 'store.criterion_employee_reviews_list',

        model : 'criterion.model.employee.ReviewList',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.EMPLOYEE_REVIEW_LIST
        }
    };

});

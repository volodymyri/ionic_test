Ext.define('criterion.store.reviewTemplate.Periods', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.data.Store',

        alias : 'store.criterion_review_template_periods',

        model : 'criterion.model.reviewTemplate.Period',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.REVIEW_TEMPLATE_PERIOD
        }
    };
});

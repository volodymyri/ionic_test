Ext.define('criterion.store.reviewTemplate.period.Goals', function() {

    return {
        extend : 'criterion.data.Store',

        alias : 'store.criterion_review_template_period_goals',

        model : 'criterion.model.reviewTemplate.period.Goal',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.REVIEW_TEMPLATE_PERIOD_GOAL
        }
    };
});

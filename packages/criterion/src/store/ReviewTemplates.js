Ext.define('criterion.store.ReviewTemplates', function() {

    return {
        extend : 'criterion.store.AbstractStore',

        alias : 'store.criterion_review_templates',

        model : 'criterion.model.ReviewTemplate',

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.REVIEW_TEMPLATE
        }
    };
});

Ext.define('criterion.store.review.Reviewers', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.data.Store',

        alias : 'store.criterion_review_reviewers',

        model : 'criterion.model.review.Reviewer',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.REVIEW_REVIEWER
        }
    };
});

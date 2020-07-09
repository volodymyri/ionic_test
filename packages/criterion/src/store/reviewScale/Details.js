Ext.define('criterion.store.reviewScale.Details', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.data.Store',

        alias : 'store.criterion_review_scale_details',

        model : 'criterion.model.reviewScale.Detail',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.REVIEW_SCALE_DETAIL
        }
    };
});

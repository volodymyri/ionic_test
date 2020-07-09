Ext.define('criterion.store.ReviewScales', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.data.Store',

        alias : 'store.criterion_review_scales',

        model : 'criterion.model.ReviewScale',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.REVIEW_SCALE
        }
    };
});

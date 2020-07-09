Ext.define('criterion.store.community.Postings', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.data.Store',

        alias : 'store.criterion_community_postings',

        model : 'criterion.model.community.Posting',

        proxy : {
            type : 'criterion_rest',
            url : API.COMMUNITY_POSTING
        },

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE
    };
});

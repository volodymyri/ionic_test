Ext.define('criterion.store.community.Badges', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.data.Store',

        alias : 'store.criterion_community_badges',

        model : 'criterion.model.community.Badge',

        proxy : {
            type : 'criterion_rest',
            url : API.COMMUNITY_BADGE
        },

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE
    };
});

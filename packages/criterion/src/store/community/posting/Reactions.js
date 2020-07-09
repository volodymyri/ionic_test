Ext.define('criterion.store.community.posting.Reactions', function() {

    return {
        extend : 'criterion.store.AbstractStore',
        model : 'criterion.model.community.posting.Reaction',
        alias : 'store.criterion_community_posting_reactions',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.COMMUNITY_POSTING_REACTION
        }
    };
});


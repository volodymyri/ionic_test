Ext.define('criterion.store.community.posting.Attachments', function() {

    return {
        extend : 'criterion.store.AbstractStore',
        model : 'criterion.model.community.posting.Attachment',
        alias : 'store.criterion_community_posting_attachments',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.COMMUNITY_POSTING_REACTION
        }
    };
});


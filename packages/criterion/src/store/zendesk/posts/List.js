Ext.define('criterion.store.zendesk.posts.List', function() {

    return {
        extend : 'criterion.data.Store',
        alias : 'store.criterion_zendesk_posts_list',

        model : 'criterion.model.zendesk.Post',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.ZENDESK_DEFAULT,

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.ZENDESK_POST_LIST,

            reader : {
                rootProperty : 'posts',
                totalProperty : 'count'
            }
        }
    };
});


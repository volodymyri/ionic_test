Ext.define('criterion.store.zendesk.requests.comments.List', function() {

    return {
        extend : 'criterion.data.Store',
        alias : 'store.criterion_zendesk_requests_comments_list',

        model : 'criterion.model.zendesk.Request',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.ZENDESK_REQUESTS_COMMENTS_LIST,

            reader : {
                rootProperty : 'comments'
            }
        }
    };
});


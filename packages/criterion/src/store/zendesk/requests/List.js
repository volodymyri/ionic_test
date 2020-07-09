Ext.define('criterion.store.zendesk.requests.List', function() {

    return {
        extend : 'criterion.data.Store',
        alias : 'store.criterion_zendesk_requests_list',

        model : 'criterion.model.zendesk.Request',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.ZENDESK_DEFAULT,

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.ZENDESK_REQUESTS_LIST,

            reader : {
                rootProperty : 'requests',
                totalProperty : 'count'
            }
        }
    };
});


Ext.define('criterion.store.zendesk.requests.Search', function() {

    return {
        extend : 'criterion.data.Store',
        alias : 'store.criterion_zendesk_requests_search',

        model : 'criterion.model.zendesk.Request',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.ZENDESK_DEFAULT,

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.ZENDESK_REQUESTS_SEARCH,

            reader : {
                rootProperty : 'requests',
                totalProperty : 'count'
            }
        }
    };
});


Ext.define('criterion.store.zendesk.articles.Search', function() {

    return {
        extend : 'criterion.data.Store',
        alias : 'store.criterion_zendesk_articles_search',

        model : 'criterion.model.zendesk.Article',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.ZENDESK_DEFAULT,

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.ZENDESK_ARTICLES_SEARCH,

            reader : {
                rootProperty : 'results',
                totalProperty : 'count'
            }
        }
    };
});


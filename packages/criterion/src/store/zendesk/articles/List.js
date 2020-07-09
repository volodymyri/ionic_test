Ext.define('criterion.store.zendesk.articles.List', function() {

    return {
        extend : 'criterion.data.Store',
        alias : 'store.criterion_zendesk_articles_list',

        model : 'criterion.model.zendesk.Article',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.ZENDESK_DEFAULT,

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.ZENDESK_ARTICLES_LIST,

            reader : {
                rootProperty : 'articles',
                totalProperty : 'count'
            }
        }
    };
});


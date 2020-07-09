Ext.define('criterion.store.StaticTokens', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.data.Store',

        alias : 'store.criterion_static_tokens',

        model : 'criterion.model.StaticToken',

        proxy : {
            type : 'criterion_rest',
            url : API.STATIC_TOKEN
        },

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE
    };
});

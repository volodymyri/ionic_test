Ext.define('criterion.store.Communities', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.data.Store',

        alias : 'store.criterion_communities',

        model : 'criterion.model.Community',

        proxy : {
            type : 'criterion_rest',
            url : API.COMMUNITY
        },

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE
    };
});

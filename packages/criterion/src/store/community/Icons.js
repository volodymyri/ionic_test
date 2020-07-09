Ext.define('criterion.store.community.Icons', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.data.Store',

        alias : 'store.criterion_community_icons',

        model : 'criterion.model.community.Icon',

        proxy : {
            type : 'criterion_rest',
            url : API.COMMUNITY_ICON
        },

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE
    };
});

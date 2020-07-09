Ext.define('criterion.store.community.Users', function() {

    return {
        extend : 'criterion.store.AbstractStore',
        model : 'criterion.model.community.User',
        alias : 'store.criterion_community_users',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.COMMUNITY_USERS
        }
    };
});


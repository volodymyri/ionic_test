Ext.define('criterion.store.SupportUsers', function() {

    return {
        extend : 'criterion.store.AbstractStore',
        model : 'criterion.model.SupportUser',
        alias : 'store.criterion_support_users',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.SUPPORT_USER
        }
    };
});


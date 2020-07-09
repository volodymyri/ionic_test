Ext.define('criterion.store.AppsAvailable', function() {

    return {
        extend : 'criterion.data.Store',
        alias : 'store.criterion_apps_available',

        model : 'criterion.model.App',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.APP_AVAILABLE
        }
    };
});

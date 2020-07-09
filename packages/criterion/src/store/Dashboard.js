Ext.define('criterion.store.Dashboard', function() {

    return {
        extend : 'criterion.data.Store',

        alias : 'store.criterion_dashboard',
        model : 'criterion.model.Dashboard',

        autoLoad : false,
        autoSync : false,

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.DASHBOARD
        }
    };
});

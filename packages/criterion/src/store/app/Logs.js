Ext.define('criterion.store.app.Logs', function() {

    return {
        alias : 'store.criterion_app_logs',

        extend : 'criterion.store.AbstractStore',

        model : 'criterion.model.app.Log',

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.APP_LOG
        }
    };
});

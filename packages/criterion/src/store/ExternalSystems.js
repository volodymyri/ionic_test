Ext.define('criterion.store.ExternalSystems', function() {

    var API = criterion.consts.Api.API;

    return {
        alias : 'store.criterion_external_systems',

        extend : 'criterion.data.Store',

        model : 'criterion.model.ExternalSystem',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.EXTERNAL_SYSTEM
        }
    };

});

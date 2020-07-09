Ext.define('criterion.store.DocumentLocations', function() {

    const API = criterion.consts.Api.API;

    return {
        alias : 'store.criterion_document_locations',

        extend : 'criterion.data.Store',

        model : 'criterion.model.DocumentLocation',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.DOCUMENT_LOCATION
        }
    };

});

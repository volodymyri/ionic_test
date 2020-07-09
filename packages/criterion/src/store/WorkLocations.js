Ext.define('criterion.store.WorkLocations', function() {

    var API = criterion.consts.Api.API;

    return {

        extend : 'criterion.store.AbstractStore',
        alias : 'store.work_locations',

        model : 'criterion.model.WorkLocation',
        autoLoad : false,
        autoSync : false,

        proxy : {
            type : 'criterion_rest',
            url : API.WORK_LOCATION
        }
    };
});

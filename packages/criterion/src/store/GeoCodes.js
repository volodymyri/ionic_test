Ext.define('criterion.store.GeoCodes', function() {

    return {
        alias : 'store.criterion_geocodes',

        extend : 'criterion.store.AbstractStore',

        model : 'criterion.model.GeoCode',

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.GEOCODE_SEARCH
        }
    };

});

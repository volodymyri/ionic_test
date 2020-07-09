Ext.define('criterion.store.CustomData', function() {

    var API = criterion.consts.Api.API;

    return {
        alternateClassName : [
            'criterion.store.CustomData'
        ],

        alias : 'store.criterion_customdata',

        extend : 'criterion.store.AbstractStore',

        model: 'criterion.model.CustomData',
        autoSync : false,

        proxy: {
            type: 'criterion_rest',
            url: API.CUSTOM_FIELD
        }

    };

});

Ext.define('criterion.data.BufferedStore', function() {

    return {
        extend : 'Ext.data.BufferedStore',

        alias : 'store.criterion_buffered',

        requires : [
            'criterion.data.proxy.Rest'
        ],

        mixins : [
            'criterion.data.mixin.StorePromises'
        ]

    };

});

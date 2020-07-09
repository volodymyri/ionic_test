Ext.define('criterion.store.customField.Items', function() {

    return {
        alias : 'store.criterion_customdata_items',

        extend : 'criterion.store.AbstractStore',

        model: 'criterion.model.customField.Item',

        proxy: {
            type: 'memory'
        }
    };

});
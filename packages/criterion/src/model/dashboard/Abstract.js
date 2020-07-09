Ext.define('criterion.model.dashboard.Abstract', function() {

    return {
        extend : 'criterion.model.Abstract',

        identifier: 'sequential',

        proxy : {
            type: 'memory'
        }
    };
});

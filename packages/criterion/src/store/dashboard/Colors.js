Ext.define('criterion.store.dashboard.Colors', function() {

    return {
        extend : 'Ext.data.Store',

        alias : 'store.criterion_dashboard_colors',

        model: 'criterion.model.dashboard.Color',

        proxy: {
            type: 'memory'
        }
    };

});
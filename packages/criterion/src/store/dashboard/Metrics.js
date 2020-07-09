Ext.define('criterion.store.dashboard.Metrics', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.data.Store',

        alias : 'store.criterion_dashboard_metrics',

        model: 'criterion.model.dashboard.Metric',
        autoLoad: true,

        proxy: {
            type: 'memory'
        }
    };

});
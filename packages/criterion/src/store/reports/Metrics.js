Ext.define('criterion.store.reports.Metrics', function () {

    return {
        extend : 'criterion.data.Store',

        model : 'criterion.model.reports.Metric',
        autoLoad : true,

        proxy : {
            type : 'memory'
        }
    };

});

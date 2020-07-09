Ext.define('criterion.model.dashboard.Metric', function() {

    return {
        extend : 'criterion.model.Abstract',

        fields : [
            {
                name : 'name',
                type : 'string'
            },
            {
                name : 'perUnit',
                type : 'boolean'
            },
            {
                name : 'url'
            },
            {
                name : 'type',
                type : 'string'
            },
            {
                name : 'availableCharts'
            }
        ]
    };

});

Ext.define('criterion.model.reports.Metric', function () {

    return {
        extend : 'criterion.model.Abstract',

        fields : [
            {
                name : 'name',
                type : 'string'
            },
            {
                name : 'url'
            }
        ]
    };

});

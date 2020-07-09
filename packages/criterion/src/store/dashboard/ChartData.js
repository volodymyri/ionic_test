Ext.define('criterion.store.dashboard.ChartData', function() {

    return {
        extend : 'Ext.data.JsonStore',

        fields : [
            {
                name : 'title',
                type : 'string',

                convert: function (value) {
                    return String(value);
                }
            },
            {
                name : 'value'
            },
            {
                name : 'count',
                type : 'int'
            }

        ],

        data : []
    };

});

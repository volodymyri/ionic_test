Ext.define('criterion.model.dataGrid.Criteria', function() {
    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'memory'
        },

        fields : [
            {
                name : 'operator',
                type : 'string'
            },
            {
                name : 'value',
                type : 'string',
                allowNull : true
            }
        ]
    }
});

Ext.define('criterion.model.dataGrid.module.Column', function() {

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'memory'
        },

        idProperty : {
            name : 'columnId',
            type : 'string'
        },

        fields : [
            {
                name : 'index',
                type : 'integer'
            },
            {
                name : 'gridLabel',
                type : 'string'
            },
            {
                name : 'label',
                type : 'string',
                calculate : data => data.gridLabel
            },
            {
                name : 'type',
                type : 'string'
            },
            {
                name : 'isAggregated',
                type : 'boolean'
            }
        ]
    }
});

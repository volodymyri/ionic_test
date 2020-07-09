Ext.define('criterion.model.dataGrid.availableTable.ForeignKey', function() {

    return {

        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'memory'
        },

        fields : [
            {
                name : 'table',
                type : 'string'
            },
            {
                name : 'foreignKey',
                type : 'string'
            },
            {
                name : 'referenceField',
                type : 'string'
            }
        ]
    };
});

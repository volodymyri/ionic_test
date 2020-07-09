Ext.define('criterion.model.dataGrid.Table', function() {
    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'memory'
        },

        fields : [
            {
                name : 'tableName',
                type : 'string'
            },
            {
                name : 'tableAlias',
                type : 'string'
            },
            {
                name : 'joinedBy',
                type : 'string',
                allowNull : true
            },
            {
                name : 'columns',
                type : 'auto',
                defaultValue : []
            }
        ]
    }
});

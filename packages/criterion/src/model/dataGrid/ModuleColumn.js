Ext.define('criterion.model.dataGrid.ModuleColumn', function() {
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
                name : 'position',
                type : 'integer',
                allowNull : true
            },
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
                name : 'sort',
                type : 'string'
            },
            {
                name : 'criteria',
                type : 'auto',
                defaultValue : []
            },
            {
                name : 'type',
                type : 'string'
            }
        ]
    }
});

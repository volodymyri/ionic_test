Ext.define('criterion.model.dataGrid.FormField', function() {
    return {

        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'memory'
        },

        fields : [
            {
                name : 'position',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'columnId',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'label',
                type : 'string'
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

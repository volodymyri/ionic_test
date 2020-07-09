Ext.define('criterion.model.dataGrid.TableColumn', function() {
    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'memory'
        },

        idProperty : 'columnId',

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
                name : 'columnId',
                type : 'string'
            },

            {
                name : 'name',
                type : 'string'
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
            },

            {
                name : 'joinedTo',
                allowNull : true
            },
            {
                name : 'isLinked',
                type : 'boolean',
                calculate : data => !!data.joinedTo
            },
            {
                name : 'isShow',
                type : 'boolean',
                defaultValue : true
            },
            {
                name : 'isLinkable',
                type : 'boolean',
                calculate : data => (data.name && (Ext.Array.contains(['_id', '_cd'], data.name.substr(-3))))
            },
            {
                name : 'isIDField',
                type : 'boolean',
                calculate : data => data.name && (data.name === 'id' || data.name.substr(-3) === '_id')
            },
            {
                name : 'isCTDField',
                type : 'boolean',
                calculate : data => data.name && data.name.substr(-3) === '_cd'
            },
            {
                name : 'isRefField',
                type : 'boolean',
                calculate : data => data.name && data.name.substr(-4) === '_ref'
            }
        ]
    }
});

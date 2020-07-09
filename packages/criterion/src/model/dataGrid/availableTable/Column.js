Ext.define('criterion.model.dataGrid.availableTable.Column', function() {

    return {
        extend : 'Ext.data.Model',

        idProperty : 'name',

        proxy : {
            type : 'memory'
        },

        fields : [
            {
                name : 'name',
                type : 'string'
            },
            {
                name : 'label',
                type : 'string'
            },
            {
                name : 'type',
                type : 'string'
            },
            {
                name : 'isLinkable',
                type : 'boolean',
                calculate : data => data.links.length > 0 || (data.name && (data.name === 'id' || Ext.Array.contains(['Id', 'Cd'], data.name.substr(-2)) || data.name.substr(-3) === 'Ref'))
            },
            {
                name : 'isCTDField',
                type : 'boolean',
                calculate : data => data.name && data.name.substr(-2) === 'Cd'
            },
            {
                name : 'isRefField',
                type : 'boolean',
                calculate : data => data.name && data.name.substr(-3) === 'Ref'
            },
            /**
             [
             {
                    typeJoin : '',
                    table : '',
                    field : '',
                    isLinked : false,
                    isMainTableFK : true
                }
             ],
             */
            {
                name : 'links',
                type : 'auto',
                defaultValue : []
            }
        ]
    };
});

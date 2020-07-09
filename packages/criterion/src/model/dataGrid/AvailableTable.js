Ext.define('criterion.model.dataGrid.AvailableTable', function() {

    return {
        extend : 'criterion.model.Abstract',

        requires : [
            'criterion.model.dataGrid.availableTable.Column',
            'criterion.model.dataGrid.availableTable.ForeignKey'
        ],

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.DATA_GRID_AVAILABLE_TABLES
        },

        idProperty : 'name',

        fields : [
            {
                name : 'name',
                type : 'string'
            },
            {
                name : 'label',
                type : 'string'
            }
        ],

        hasMany : [
            {
                model : 'criterion.model.dataGrid.availableTable.Column',
                name : 'columns',
                associationKey : 'columns'
            },
            {
                model : 'criterion.model.dataGrid.availableTable.ForeignKey',
                name : 'foreignKeys',
                associationKey : 'foreignKeys'
            }
        ]
    };
});

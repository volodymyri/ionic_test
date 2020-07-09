Ext.define('criterion.model.dataGrid.Module', function() {
    return {

        extend : 'criterion.model.Abstract',

        requires : [
            'criterion.model.dataGrid.module.Column'
        ],

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.DATA_GRID_MODULE
        },

        idProperty : {
            name : 'id',
            type : 'string'
        },

        fields : [
            {
                name : 'name',
                type : 'string'
            }
        ],

        hasMany : [
            {
                model : 'criterion.model.dataGrid.module.Column',
                name : 'columns',
                associationKey : 'columns'
            }
        ]
    }
});

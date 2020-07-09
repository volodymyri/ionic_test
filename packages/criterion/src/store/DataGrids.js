Ext.define('criterion.store.DataGrids', function() {

    return {
        alias : 'store.criterion_data_grids',

        extend : 'criterion.store.AbstractStore',

        model : 'criterion.model.DataGrid',

        autoSync : false,

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.DATA_GRID_MEMORIZED
        }
    };
});

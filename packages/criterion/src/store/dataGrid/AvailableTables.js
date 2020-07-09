Ext.define('criterion.store.dataGrid.AvailableTables', function() {

    return {
        alias : 'store.criterion_available_tables',

        extend : 'criterion.store.AbstractStore',

        model : 'criterion.model.dataGrid.AvailableTable',

        autoSync : false,

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.DATA_GRID_AVAILABLE_TABLES
        }
    };
});

Ext.define('criterion.store.dataGrid.Tables', function() {
    return {
        extend : 'criterion.data.Store',

        alias : 'store.criterion_data_grid_tables',

        model : 'criterion.model.dataGrid.Table',

        autoLoad : false,

        pageSize : criterion.Consts.PAGE_SIZE.NONE
    }
});

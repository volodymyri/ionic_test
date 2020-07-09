Ext.define('criterion.store.dataGrid.TableColumns', function() {
    return {
        extend : 'criterion.data.Store',

        alias : 'store.criterion_data_grid_table_columns',

        model : 'criterion.model.dataGrid.TableColumn',

        autoLoad : false,

        pageSize : criterion.Consts.PAGE_SIZE.NONE
    }
});

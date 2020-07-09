Ext.define('criterion.store.dataGrid.ModuleColumns', function() {

    return {

        alias : 'store.criterion_data_grid_module_columns',

        extend : 'criterion.store.AbstractStore',

        model : 'criterion.model.dataGrid.ModuleColumn',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE
    };

});

Ext.define('criterion.store.dataGrid.Modules', function() {

    return {

        alias : 'store.criterion_data_grid_modules',

        extend : 'criterion.store.AbstractStore',

        model : 'criterion.model.dataGrid.Module',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.DATA_GRID_MODULE
        }
    };

});

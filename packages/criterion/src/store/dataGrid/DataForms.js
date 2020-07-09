Ext.define('criterion.store.dataGrid.DataForms', function() {

    return {

        alias : 'store.criterion_data_grid_dataforms',

        extend : 'criterion.store.AbstractStore',

        model : 'criterion.model.DataForm',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.DATA_GRID_DATA_FORM
        }
    };

});

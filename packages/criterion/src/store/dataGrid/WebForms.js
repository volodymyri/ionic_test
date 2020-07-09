Ext.define('criterion.store.dataGrid.WebForms', function() {

    return {

        alias : 'store.criterion_data_grid_webforms',

        extend : 'criterion.store.AbstractStore',

        model : 'criterion.model.WebForm',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.DATA_GRID_WEB_FORM
        }
    };

});

Ext.define('criterion.store.dataGrid.FormFields', function() {

    return {

        alias : 'store.criterion_data_grid_form_fields',

        extend : 'criterion.store.AbstractStore',

        model : 'criterion.model.dataGrid.FormField',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE
    };

});

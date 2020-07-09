Ext.define('criterion.store.dataGrid.Criteria', function() {

    return {

        extend : 'criterion.data.Store',

        alias : 'store.criterion_data_grid_criteria',

        model : 'criterion.model.dataGrid.Criteria',

        autoLoad : false,

        pageSize : criterion.Consts.PAGE_SIZE.NONE

    }
});

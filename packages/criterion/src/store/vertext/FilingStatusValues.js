Ext.define('criterion.store.vertex.FilingStatusValues', function() {

    return {
        extend : 'criterion.data.Store',

        alias : 'store.criterion_vertex_filing_status_values',

        model : 'criterion.model.vertex.FilingStatusValues',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE

    };
});

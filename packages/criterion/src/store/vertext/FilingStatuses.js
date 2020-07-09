Ext.define('criterion.store.vertex.FilingStatuses', function() {

    return {
        extend : 'criterion.data.Store',

        alias : 'store.criterion_vertex_filing_statuses',

        model : 'criterion.model.vertex.FilingStatus',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE

    };
});

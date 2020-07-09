Ext.define('criterion.store.Workflows', function() {

    return {
        extend : 'criterion.data.Store',

        alias : 'store.criterion_workflows',

        model : 'criterion.model.Workflow',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE
    };
});

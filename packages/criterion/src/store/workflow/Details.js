Ext.define('criterion.store.workflow.Details', function() {

    return {
        extend : 'criterion.data.Store',

        alias : 'store.criterion_workflow_details',

        model : 'criterion.model.workflow.Detail',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE
    };
});

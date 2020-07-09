Ext.define('criterion.store.WorkflowLogs', function() {

    return {
        extend : 'criterion.data.Store',

        alias : 'store.criterion_workflow_logs',

        model : 'criterion.model.WorkflowLog',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE
    };
});

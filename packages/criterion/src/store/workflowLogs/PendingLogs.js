Ext.define('criterion.store.workflowLogs.PendingLogs', function() {

    return {
        extend : 'criterion.data.Store',

        alias : 'store.criterion_workflow_log_pending_logs',

        model : 'criterion.model.workflowLog.PendingLog',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE
    };
});

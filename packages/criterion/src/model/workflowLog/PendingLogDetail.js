Ext.define('criterion.model.workflowLog.PendingLogDetail', function() {

    return {
        extend : 'criterion.model.workflowLog.PendingLog',
        idProperty : 'workflowQueueId',

        inheritableStatics : {
            loadWithPromise : function(id, options, session) {
                var rec = new this({
                    workflowQueueId : id
                }, session);

                return rec.loadWithPromise(options)
            }
        }
    };
});

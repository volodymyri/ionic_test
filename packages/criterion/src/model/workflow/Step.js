Ext.define('criterion.model.workflow.Step', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.WORKFLOW_TRANSACTION_STEPS
        },

        idProperty : {
            name : 'id',
            type : 'string'
        },

        fields : [
            {
                name : 'workflowTransactionId',
                type : 'integer'
            },
            {
                name : 'workflowTransactionLogId',
                type : 'integer'
            },
            {
                name : 'stepNumber',
                type : 'integer'
            },
            {
                name : 'performer',
                type : 'string'
            },
            {
                name : 'action',
                type : 'string'
            },
            {
                name : 'assignedEmployeeName',
                type : 'string'
            },
            {
                name : 'executedEmployeeName',
                type : 'string'
            },
            {
                name : 'comment',
                type : 'string'
            },
            {
                name : 'date',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_TIME_FORMAT
            },
            {
                name : 'statusCd',
                type : 'criterion_codedata',
                codeDataId : criterion.consts.Dict.WORKFLOW_STATE
            },
            {
                name : 'statusCode',
                type : 'string'
            },
            {
                name : 'isActiveInWorkflow',
                type : 'boolean'
            },
            {
                name : 'workflowQueueId',
                type : 'integer'
            },
            {
                name : 'isApprovedTimesheet',
                type : 'boolean'
            },
            {
                name : 'isApplied',
                type : 'boolean'
            },
            {
                name : 'canRecall',
                type : 'boolean'
            }
        ]
    };
});

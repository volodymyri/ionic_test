Ext.define('criterion.model.workflow.transaction.Log', function() {

    var API = criterion.consts.Api.API,
        DICT = criterion.consts.Dict;

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.WORKFLOW_TRANSACTION_LOG
        },

        fields : [
            {
                name : 'workflowId',
                type : 'int'
            },
            {
                name : 'workflowTransactionId',
                type : 'int'
            },
            {
                name : 'workflowDetailId',
                type : 'int'
            },
            {
                name : 'delegatedToEmployeeId',
                type : 'int'
            },
            {
                name : 'employeeId',
                type : 'int'
            },
            {
                name : 'performerId',
                type : 'int'
            },
            {
                name : 'actionTime',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_TIME_FORMAT
            },
            {
                name : 'stateCd',
                type : 'criterion_codedata',
                codeDataId : DICT.WORKFLOW_STATE
            },
            {
                name : 'stateCode',
                type : 'criterion_codedatavalue',
                referenceField : 'stateCd',
                dataProperty : 'code'
            },
            {
                name : 'comment',
                type : 'string'
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
                name : 'requestType',
                type : 'string'
            },
            {
                name : 'request',
                type : 'auto'
            }
        ]
    };
});
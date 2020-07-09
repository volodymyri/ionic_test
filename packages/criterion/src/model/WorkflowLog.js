Ext.define('criterion.model.WorkflowLog', function() {

    var API = criterion.consts.Api.API,
        DICT = criterion.consts.Dict;

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.WORKFLOW_LOG
        },

        fields : [
            {
                name : 'workflowId',
                type : 'int'
            },
            {
                name : 'employeeId',
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
                name : 'employeeName',
                type : 'string'
            },
            {
                name : 'actualData'
            },
            {
                name : 'requestData'
            }
        ]
    };
});

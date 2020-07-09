Ext.define('criterion.model.reports.Status', function() {

    return {
        extend : 'criterion.model.Abstract',

        fields : [
            {
                name : 'reportGenerationTaskId',
                type : 'integer'
            },
            {
                name : 'statusCd',
                type : 'criterion_codedata',
                codeDataId : criterion.consts.Dict.REPORT_GENERATION_STATUS
            },
            {
                name : 'processId',
                type : 'string'
            },
            {
                name : 'progress',
                type : 'number'
            },
            {
                name : 'format',
                type : 'string'
            },
            {
                name : 'statusCode',
                type : 'criterion_codedatavalue',
                referenceField : 'statusCd',
                dataProperty : 'code'
            },
            {
                name : 'options',
                type : 'auto'
            }
        ],

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.REPORT_STATUS
        }
    };

});

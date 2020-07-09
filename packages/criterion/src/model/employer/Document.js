Ext.define('criterion.model.employer.Document', function() {

    var API = criterion.consts.Api.API,
        DICT = criterion.consts.Dict;

    return {

        extend : 'criterion.model.Abstract',

        fields : [
            {
                name : 'employerId',
                type : 'int'
            },
            {
                name : 'workflowId',
                type : 'int'
            },
            {
                name : 'fileName',
                type : 'string'
            },
            {
                name : 'description',
                type : 'string'
            },
            {
                name : 'uploadDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_TIME_FORMAT
            },
            {
                name : 'documentTypeCd',
                type : 'criterion_codedata',
                codeDataId : DICT.DOCUMENT_RECORD_TYPE
            },
            {
                name : 'documentTypeDesc',
                type : 'criterion_codedatavalue',
                referenceField : 'documentTypeCd',
                persist : false
            },
            {
                name : 'editBy',
                type : 'integer'
            },
            {
                name : 'size',
                type : 'integer',
                persist : false,
                allowNull : true
            },
            {
                name : 'isShare',
                type : 'boolean'
            },
            {
                name : 'access',
                type : 'integer',
                persist : false
            }
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_DOCUMENT
        }
    };
});

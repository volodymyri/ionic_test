Ext.define('criterion.model.employee.Document', function() {

    var API = criterion.consts.Api.API,
        DICT = criterion.consts.Dict,
        VALIDATOR = criterion.Consts.getValidator();

    return {

        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_DOCUMENT
        },

        fields : [
            {
                name : 'employeeId',
                type : 'int',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'webformId',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'dataformId',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'isDataForm',
                type : 'boolean',
                persist : false,
                calculate : function(data) {
                    return !!data.dataformId;
                }
            },
            {
                name : 'isForm',
                type : 'boolean',
                persist : false,
                calculate : function(data) {
                    return !!data.dataformId || !!data.webformId;
                }
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
                name : 'dueDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
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
                name : 'path',
                type : 'string'
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
                name : 'statusCd',
                type : 'criterion_codedata',
                codeDataId : criterion.consts.Dict.WORKFLOW_STATE,
                allowNull : true,
                persist : false
            },
            {
                name : 'documentLocationCd',
                type : 'criterion_codedata',
                codeDataId : criterion.consts.Dict.DOCUMENT_LOCATION_TYPE,
                persist : false
            },
            {
                name : 'documentLocationCode',
                type : 'criterion_codedatavalue',
                referenceField : 'documentLocationCd',
                dataProperty : 'code'
            },
            {
                name : 'isFillForm',
                type : 'boolean',
                defaultValue : true
            },
            {
                name : 'completedBy',
                type : 'string',
                persist : false
            }
        ]
    };
});

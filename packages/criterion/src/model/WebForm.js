Ext.define('criterion.model.WebForm', function() {

    const API = criterion.consts.Api.API,
        DICT = criterion.consts.Dict,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.Abstract',

        requires : [
            'criterion.model.webForm.Field'
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.WEBFORM
        },

        fields : [
            {
                name : 'name',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'documentTypeCd',
                type : 'criterion_codedata',
                codeDataId : DICT.DOCUMENT_RECORD_TYPE,
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'printSizeCd',
                type : 'criterion_codedata',
                codeDataId : DICT.PRINT_SIZE
            },
            {
                name : 'fieldsCount',
                type : 'integer',
                persist : false
            },
            {
                name : 'totalPages',
                type : 'integer',
                persist : false
            },
            {
                name : 'workflowId',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'initiateByEmployee',
                type : 'string',
                allowNull : true
            },
            {
                name : 'shareWithEmployee',
                type : 'boolean'
            },
            {
                name : 'isSystem',
                type : 'boolean'
            },
            {
                name : 'description',
                type : 'criterion_localization_string'
            }
        ],

        hasMany : [
            {
                model : 'criterion.model.webForm.Field',
                name : 'formFields',
                associationKey : 'formFields'
            }
        ]
    };
});

Ext.define('criterion.model.DataForm', function() {

    const API = criterion.consts.Api.API,
        DICT = criterion.consts.Dict,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.Abstract',

        requires : [
            'criterion.model.dataForm.Field'
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.DATAFORM
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
                name : 'fieldsCount',
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
                allowNull : true,
                critical : true // for compatibility with webforms
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
                model : 'criterion.model.dataForm.Field',
                name : 'formFields',
                associationKey : 'formFields'
            }
        ]
    };
});

Ext.define('criterion.model.form.Available', function() {

    const API = criterion.consts.Api.API,
        DICT = criterion.consts.Dict,
        VALIDATOR = criterion.Consts.getValidator();

    return {

        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.FORM
        },

        idProperty : {
            name : 'id',
            type : 'string'
        },

        fields : [
            {
                name : 'isWebForm',
                type : 'boolean',
                persist : false,
                calculate : function(data) {
                    return data.type === criterion.Consts.FORM_INTERNAL_TYPE.WEB;
                }
            },
            {
                name : 'type',
                type : 'integer'
            },
            {
                name : 'formId',
                type : 'integer'
            },
            {
                name : 'name',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'documentTypeCd',
                type : 'criterion_codedata',
                codeDataId : DICT.DOCUMENT_RECORD_TYPE
            },
            {
                name : 'fieldsCount',
                type : 'integer',
                persist : false
            }
        ]
    };
});

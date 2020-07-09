Ext.define('criterion.model.employer.Form', function() {

    const API = criterion.consts.Api.API;

    return {

        extend : 'criterion.model.Abstract',

        fields : [
            {
                name : 'employerId',
                type : 'int'
            },
            {
                name : 'description',
                type : 'string'
            },
            {
                name : 'documentTypeCd',
                type : 'criterion_codedata',
                codeDataId : criterion.consts.Dict.DOCUMENT_RECORD_TYPE
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
                    return !!data.dataformId;
                }
            }
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_DOCUMENT
        }
    };
});

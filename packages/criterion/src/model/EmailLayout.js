Ext.define('criterion.model.EmailLayout', function() {

    var API = criterion.consts.Api.API,
        DICT = criterion.consts.Dict,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.EMAIL_LAYOUT
        },

        fields : [
            {
                name : 'emailLayoutCd',
                type : 'criterion_codedata',
                codeDataId : DICT.EMAIL_LAYOUT,
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'emailLayoutDesc',
                type : 'criterion_codedatavalue',
                depends : 'emailLayoutCd',
                referenceField : 'emailLayoutCd',
                dataProperty : 'description'
            },
            {
                name : 'emailLayoutCode',
                type : 'criterion_codedatavalue',
                depends : 'emailLayoutCd',
                referenceField : 'emailLayoutCd',
                dataProperty : 'code'
            },
            {
                name : 'fromText',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'toAddress',
                type : 'string'
            },
            {
                name : 'subject',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'subjectProcessed',
                type : 'string',
                persist : false
            },
            {
                name : 'body',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'bodyProcessed',
                type : 'string',
                persist : false
            },
            {
                name : 'isActive',
                type : 'boolean'
            }
        ]
    };
});

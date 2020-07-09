Ext.define('criterion.model.EssHelp', function() {

    var API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator(),
        DICT = criterion.consts.Dict;

    return {

        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.ESS_HELP
        },

        fields : [
            {
                name : 'securityEssFunctionCd',
                type : 'criterion_codedata',
                codeDataId : DICT.SECURITY_ESS_FUNCTION
            },
            {
                name : 'title',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'content',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'isActive',
                type : 'boolean'
            },
            {
                name : 'securityEssFunctionCode',
                type : 'criterion_codedatavalue',
                depends : 'securityEssFunctionCd',
                referenceField : 'securityEssFunctionCd',
                dataProperty : 'code'
            }
        ]
    };
});
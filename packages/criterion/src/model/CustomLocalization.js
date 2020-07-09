Ext.define('criterion.model.CustomLocalization', function() {

    const API = criterion.consts.Api.API,
        DICT = criterion.consts.Dict,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.CUSTOM_LOCALIZATION
        },

        fields : [
            {
                name : 'localizationLanguageCd',
                type : 'criterion_codedata',
                codeDataId : DICT.LOCALIZATION_LANGUAGE,
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'localizationLanguageCode',
                type : 'criterion_codedatavalue',
                referenceField : 'localizationLanguageCd',
                dataProperty : 'code'
            },
            {
                name : 'token',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'label',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            }
        ]
    };
});

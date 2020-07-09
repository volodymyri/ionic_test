Ext.define('criterion.model.codeTable.detail.Local', function() {

    var API = criterion.consts.Api.API,
        DICT = criterion.consts.Dict,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.CODE_TABLE_DETAIL_LOCAL
        },

        fields : [
            {
                name : 'codeTableDetailId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'localizationLanguageCd',
                type : 'criterion_codedata',
                codeDataId : DICT.LOCALIZATION_LANGUAGE
            },
            {
                name : 'description',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            }
        ]
    };
});

Ext.define('criterion.model.person.Settings', function() {

    var DICT = criterion.consts.Dict;

    return {
        extend : 'criterion.model.Abstract',

        fields : [
            {
                name : 'personId',
                type : 'integer'
            },
            {
                name : 'theme',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'localizationLanguageCd',
                type : 'criterion_codedata',
                codeDataId : DICT.LOCALIZATION_LANGUAGE,
                allowNull : true
            }
        ],

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.PERSON_PREFERENCES
        }
    };

});


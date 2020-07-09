Ext.define('criterion.model.person.Phone', function() {

    var API = criterion.consts.Api.API,
        DICT = criterion.consts.Dict,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.person.Abstract',

        fields : [
            {
                name : 'phoneTypeId',
                type : 'criterion_codedata',
                codeDataId : DICT.PHONE_TYPE
            },
            {
                name : 'countryCode',
                type : 'string'
            },
            {
                name : 'phoneNumber',
                type : 'string'
            },
            {
                name : 'extension',
                type : 'string',
                allowNull : true
            }
        ]
    };

});


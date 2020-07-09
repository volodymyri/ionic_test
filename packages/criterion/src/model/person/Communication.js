Ext.define('criterion.model.person.Communication', function() {

    return {
        extend : 'criterion.model.Abstract',

        fields : [
            {
                name : 'personId',
                type : 'int'
            },
            {
                name : 'socialMediaTypeCd',
                type : 'criterion_codedata',
                allowNull : true,
                codeDataId : criterion.consts.Dict.SOCIAL_MEDIA_TYPE
            },
            {
                name : 'identifier',
                type : 'string'
            }
        ],

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.PERSON_COMMUNICATION
        }
    };

});


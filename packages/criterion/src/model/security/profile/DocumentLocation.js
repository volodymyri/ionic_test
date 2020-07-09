Ext.define('criterion.model.security.profile.DocumentLocation', function() {

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'memory'
        },

        fields : [
            {
                name : 'securityProfileId',
                type : 'int'
            },
            {
                name : 'documentLocationCd',
                type : 'criterion_codedata',
                codeDataId : criterion.consts.Dict.DOCUMENT_LOCATION_TYPE
            }
        ]

    };
});

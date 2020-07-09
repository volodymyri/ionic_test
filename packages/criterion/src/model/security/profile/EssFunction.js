Ext.define('criterion.model.security.profile.EssFunction', function() {

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
                name : 'securityEssFunctionCd',
                type : 'criterion_codedata',
                codeDataId : criterion.consts.Dict.SECURITY_ESS_FUNCTION
            },
            {
                name : 'securityFunctionName',
                type : 'string',
                persist : false
            }
        ]

    };
});

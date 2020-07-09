Ext.define('criterion.model.security.User', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.SECURITY_USER,
            batchOrder : 'create,update,destroy'
        },

        fields : [
            {
                name : 'securityProfileId',
                type : 'integer'
            },
            {
                name : 'personId',
                type : 'integer'
            },
            {
                name : 'securityProfileName',
                type : 'string',
                persist : false
            },
            {
                name : 'securityProfileRole',
                type : 'string',
                persist : false
            }
        ]
    };
});

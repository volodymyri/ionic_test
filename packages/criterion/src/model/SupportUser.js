Ext.define('criterion.model.SupportUser', function() {

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.SUPPORT_USER
        },

        fields : [
            {
                name : 'name',
                type : 'string'
            },
            {
                name : 'allowedIpAddress',
                type : 'string'
            },
            {
                name : 'expirationTime',
                type : 'date'
            }
        ]
    };
});

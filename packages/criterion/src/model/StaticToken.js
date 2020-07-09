Ext.define('criterion.model.StaticToken', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.STATIC_TOKEN
        },

        fields : [
            {
                name : 'securityProfileId',
                type : 'int'
            },
            {
                name : 'createdDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_TIME_FORMAT
            },
            {
                name : 'apiKey',
                type : 'string'
            },
            {
                name : 'securityProfileName',
                persist : false
            },
            {
                name : 'tokenType',
                type : 'int'
            },
            {
                name : 'personId',
                type : 'int'
            },
            {
                name : 'personName',
                persist : false
            },
            {
                name : 'tokenTypeName',
                type : 'string',
                persist : false,
                calculate : function(data) {
                    let tokenType = data && data.tokenType && Ext.Array.findBy(criterion.Consts.STATIC_TOKEN_TYPES_DATA, item => item.id === data.tokenType);

                    return tokenType ? tokenType.text : '';
                }
            }
        ]
    };

});

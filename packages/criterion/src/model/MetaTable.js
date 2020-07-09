Ext.define('criterion.model.MetaTable', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.META_TABLE
        },

        fields : [
            {
                name : 'name',
                type : 'string'
            },
            {
                name : 'description',
                type : 'string'
            },
            {
                name : 'isAudited',
                type : 'boolean'
            },
            {
                name : 'isSecurityObject',
                type : 'boolean'
            },
            {
                name : 'isDeprecated',
                type : 'boolean'
            }
        ]
    };
});

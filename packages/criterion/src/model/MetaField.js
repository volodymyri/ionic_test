Ext.define('criterion.model.MetaField', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.META_FIELD
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
                name : 'tableName',
                type : 'string'
            },
            {
                name : 'tableId',
                type : 'integer'
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
            },
            {
                name : 'isExpressionUsage',
                type : 'boolean'
            },
            {
                name : 'auditSuppressValue',
                type : 'string'
            },
            {
                name : 'token',
                type : 'string'
            },
            {
                name : 'isRequired',
                type : 'integer'
            }
        ]
    };
});

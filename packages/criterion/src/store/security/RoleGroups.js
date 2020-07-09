Ext.define('criterion.store.security.RoleGroups', function() {

    return {
        alias : 'store.criterion_security_role_groups',

        extend : 'criterion.store.AbstractStore',

        model : 'criterion.model.security.RoleGroup',

        autoSync : false,

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.SECURITY_ROLE_GROUP
        }
    };
});
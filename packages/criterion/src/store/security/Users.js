Ext.define('criterion.store.security.Users', function() {

    return {
        alias : 'store.criterion_security_users',

        extend : 'criterion.store.AbstractStore',

        model : 'criterion.model.security.User',

        autoSync : false,

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.SECURITY_USER,
            batchOrder : 'create,update,destroy'
        }
    };
});

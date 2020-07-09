Ext.define('criterion.store.security.Fields', function() {

    return {
        alias : 'store.criterion_security_fields',

        extend : 'criterion.store.AbstractStore',

        model : 'criterion.model.security.Field',

        autoSync : false,

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.SECURITY_FIELD
        }
    };
});

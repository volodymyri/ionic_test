Ext.define('criterion.store.security.Profiles', function() {

    return {
        alias : 'store.criterion_security_profiles',

        extend : 'criterion.store.AbstractStore',

        model : 'criterion.model.security.Profile',

        autoSync : false,

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.SECURITY_PROFILE
        }
    };
});

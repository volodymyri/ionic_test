Ext.define('criterion.store.PasswordPolicies', function() {

    var API = criterion.consts.Api.API;

    return {
        alias : 'store.criterion_password_policies',

        extend : 'criterion.data.Store',

        model : 'criterion.model.PasswordPolicy',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.PASSWORD_POLICY
        }
    };
});

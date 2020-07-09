Ext.define('criterion.store.employer.GLAccounts', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.store.AbstractStore',
        alias : 'store.employer_gl_accounts',

        model : 'criterion.model.employer.GLAccount',

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_GL_ACCOUNT
        }
    };

});

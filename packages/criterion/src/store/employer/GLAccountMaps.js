Ext.define('criterion.store.employer.GLAccountMaps', function() {

    return {
        extend : 'criterion.store.AbstractStore',
        alias : 'store.employer_gl_account_maps',

        model : 'criterion.model.employer.GLAccountMap',

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.EMPLOYER_GL_ACCOUNT_MAP
        }
    };

});

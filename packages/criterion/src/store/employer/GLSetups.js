Ext.define('criterion.store.employer.GLSetups', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.store.AbstractStore',
        alias : 'store.employer_gl_setups',

        model : 'criterion.model.employer.GLSetup',

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_GL_SETUP
        }
    };

});

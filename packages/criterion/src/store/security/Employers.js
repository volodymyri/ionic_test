/**
 * @deprecated
 */
Ext.define('criterion.store.security.Employers', function() {

    return {
        alias : 'store.criterion_security_employers',

        extend : 'criterion.store.AbstractStore',

        model : 'criterion.model.security.Employer',

        autoSync : false,

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.SECURITY_EMPLOYER
        }
    };
});

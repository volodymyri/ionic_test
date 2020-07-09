Ext.define('criterion.store.security.Reports', function() {

    return {
        alias : 'store.criterion_security_reports',

        extend : 'criterion.store.AbstractStore',

        model : 'criterion.model.security.Report',

        autoSync : false,

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.SECURITY_REPORT
        }
    };
});

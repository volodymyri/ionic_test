Ext.define('criterion.store.employer.CertifiedRates', function() {

    return {
        extend : 'criterion.store.AbstractStore',

        alias: 'store.employer_certified_rates',

        model : 'criterion.model.employer.CertifiedRate',

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.CERTIFIED_RATE
        }
    };

});

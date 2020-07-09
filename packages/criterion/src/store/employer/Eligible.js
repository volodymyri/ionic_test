Ext.define('criterion.store.employer.Eligible', function() {

    return {
        extend : 'criterion.store.AbstractStore',
        alias : 'store.criterion_employer_eligible',

        model : 'criterion.model.employer.Eligible',
        autoLoad : false,
        autoSync : false,

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.EMPLOYER_ELIGIBLE_FOR_HIRE
        }
    };
});

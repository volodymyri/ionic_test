Ext.define('criterion.store.employer.certifiedRate.Deductions', function() {

    return {
        extend : 'criterion.data.Store',
        model : 'criterion.model.employer.Deduction',
        alias : 'store.employer_certified_rate_deductions',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.CERTIFIED_RATE_DEDUCTION
        }
    };
});

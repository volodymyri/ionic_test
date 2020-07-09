Ext.define('criterion.store.employer.benefit.Rates', function() {

    return {
        extend : 'criterion.data.Store',
        model : 'criterion.model.employer.benefit.Rate',
        alias : 'store.employer_benefit_option_rates',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.EMPLOYER_BENEFIT_PLAN_RATE
        }
    };
});

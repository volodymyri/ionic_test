Ext.define('criterion.store.employer.BenefitPlans', function() {

    return {
        extend : 'criterion.store.AbstractStore',

        alias : 'store.employer_benefit_plans',

        model : 'criterion.model.employer.BenefitPlan',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.EMPLOYER_BENEFIT_PLAN
        }
    };
});

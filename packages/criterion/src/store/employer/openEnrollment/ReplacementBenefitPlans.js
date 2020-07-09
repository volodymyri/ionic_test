Ext.define('criterion.store.employer.openEnrollment.ReplacementBenefitPlans', function() {

    return {
        extend : 'criterion.data.Store',

        alias : 'store.criterion_employer_open_enrollment_replacement_benefit_plans',

        model : 'criterion.model.employer.openEnrollment.ReplacementBenefitPlan',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.EMPLOYER_OPEN_ENROLLMENT_REPLACEMENT_BENEFIT_PLANS
        }
    };

});

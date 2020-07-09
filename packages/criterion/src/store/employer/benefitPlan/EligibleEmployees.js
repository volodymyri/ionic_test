Ext.define('criterion.store.employer.benefitPlan.EligibleEmployees', function() {

    return {
        extend : 'criterion.store.AbstractStore',
        model : 'criterion.model.employer.benefitPlan.EligibleEmployee',
        alias : 'store.criterion_employer_benefitplan_eligible_employees',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.DEFAULT,

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.EMPLOYER_BENEFIT_PLAN_ELIGIBLE_EMPLOYEE
        }
    };
});


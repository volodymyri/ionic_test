Ext.define('criterion.store.employer.TimeOffPlans', function() {

    return {
        alias : 'store.criterion_employer_time_off_plans',

        extend : 'criterion.store.AbstractStore',

        model : 'criterion.model.employer.TimeOffPlan',

        autoSync : false,

        autoLoad : false,

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.EMPLOYER_TIME_OFF_PLAN
        }
    };
});

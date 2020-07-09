Ext.define('criterion.store.employer.timeOffPlan.Types', function() {

    return {
        alias : 'store.criterion_employer_time_off_plan_types',

        extend : 'criterion.store.AbstractStore',

        model : 'criterion.model.employer.timeOffPlan.Type',

        autoSync : false
    };
});

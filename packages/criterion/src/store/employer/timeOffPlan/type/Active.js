Ext.define('criterion.store.employer.timeOffPlan.type.Active', function() {

    return {
        alias : 'store.criterion_employer_time_off_plan_type_active',

        extend : 'criterion.store.AbstractStore',

        model : 'criterion.model.employer.timeOffPlan.type.Active',

        autoSync : false
    };
});

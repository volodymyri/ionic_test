Ext.define('criterion.model.employer.openEnrollment.ReplacementBenefitPlan', function() {

    return {

        extend : 'criterion.model.Abstract',

        requires : [
            'criterion.model.employer.BenefitPlan'
        ],

        hasMany : [
            {
                model : 'criterion.model.employer.BenefitPlan',
                name : 'replacementPlans',
                associationKey : 'replacementPlans'
            }
        ]
    };
});

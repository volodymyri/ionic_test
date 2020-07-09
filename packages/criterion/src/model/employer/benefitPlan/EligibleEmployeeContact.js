Ext.define('criterion.model.employer.benefitPlan.EligibleEmployeeContact', function() {

    return {
        extend : 'Ext.data.Model',

        fields : [
            {
                name : 'name',
                type : 'string',
                persist : false
            }
        ]
    };
});

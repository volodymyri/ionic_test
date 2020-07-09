Ext.define('criterion.model.employer.Eligible', function() {

    return {
        extend : 'criterion.model.Employer',

        hasMany : [
            {
                model : 'criterion.model.Employee',
                name : 'employees',
                associationKey : 'employees'
            }
        ],

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.EMPLOYER_ELIGIBLE_FOR_HIRE
        }
    };
});

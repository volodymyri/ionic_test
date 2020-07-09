Ext.define('criterion.model.employer.openEnrollment.StepBenefit', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_OPEN_ENROLLMENT_STEP_BENEFIT
        },

        fields : [
            {
                name : 'openEnrollmentStepId',
                type : 'int',
                validators : [criterion.Consts.getValidator().NON_EMPTY]
            },
            {
                name : 'benefitPlanId',
                type : 'int',
                validators : [criterion.Consts.getValidator().NON_EMPTY]
            }
        ]
    };
});

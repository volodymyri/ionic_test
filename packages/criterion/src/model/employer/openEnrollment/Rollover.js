Ext.define('criterion.model.employer.openEnrollment.Rollover', function() {

    const API = criterion.consts.Api.API,
          VALIDATOR = criterion.Consts.getValidator();

    return {

        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_OPEN_ENROLLMENT_ROLLOVER
        },

        fields : [
            {
                name : 'openEnrollmentId',
                type : 'int',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'originalBenefitPlanId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'originalBenefitPlanName',
                type : 'string',
                persist : false
            },
            {
                name : 'replacementBenefitPlanId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'replacementBenefitPlanName',
                type : 'string',
                persist : false
            },
            {
                name : 'optionChange',
                type : 'auto'
            },
            {
                name : 'isConfigured',
                type : 'boolean',
                persist : false,
                calculate : data => !!data.optionChange && !!data.replacementBenefitPlanId
            }
        ]
    };
});

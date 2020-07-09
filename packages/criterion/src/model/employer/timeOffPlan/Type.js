Ext.define('criterion.model.employer.timeOffPlan.Type', function() {

    var API = criterion.consts.Api.API,
        DICT = criterion.consts.Dict,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_TIME_OFF_PLAN_TYPE
        },

        fields : [
            {
                name : 'timeOffPlanId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'timeOffTypeCd',
                type : 'criterion_codedata',
                codeDataId : DICT.TIME_OFF_TYPE,
                validators : [VALIDATOR.NON_EMPTY]
            }
        ]
    };
});

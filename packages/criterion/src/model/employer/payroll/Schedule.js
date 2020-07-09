Ext.define('criterion.model.employer.payroll.Schedule', function() {

    var API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.employer.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_PAYROLL_SCHEDULE
        },

        fields : [
            {
                name : 'payFrequencyCd',
                type : 'criterion_codedata',
                codeDataId : criterion.consts.Dict.PAY_FREQUENCY,
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'payDateDaysAfter',
                type : 'int',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'name',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            }
        ]
    };
});

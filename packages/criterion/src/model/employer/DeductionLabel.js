Ext.define('criterion.model.employer.DeductionLabel', function() {

    var API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator();

    return {

        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_DEDUCTION_LABEL
        },

        fields : [
            {
                name : 'deductionId',
                type : 'int',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'labelCd',
                type : 'int',
                validators : [VALIDATOR.NON_EMPTY]
            }
        ]
    };
});

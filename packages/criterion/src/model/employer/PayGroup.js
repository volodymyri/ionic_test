Ext.define('criterion.model.employer.PayGroup', function() {

    var API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.employer.Abstract',

        fields : [
            {
                name : 'payrollScheduleId',
                type : 'int',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'name',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'description',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'overtimeId',
                type : 'int',
                validators : [VALIDATOR.NON_EMPTY]
            }
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_PAY_GROUP
        }
    };
});

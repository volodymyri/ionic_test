Ext.define('criterion.model.employeeGroup.TimeClock', function() {

    var API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_GROUP_TIME_CLOCK
        },

        fields : [
            {
                name : 'employeeGroupId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'timeClockId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            }
        ]
    };
});

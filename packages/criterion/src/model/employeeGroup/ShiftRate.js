Ext.define('criterion.model.employeeGroup.ShiftRate', function() {

    var API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_GROUP_SHIFT_RATE
        },

        fields : [
            {
                name : 'employeeGroupId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'shiftRateId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            }
        ]
    };

});

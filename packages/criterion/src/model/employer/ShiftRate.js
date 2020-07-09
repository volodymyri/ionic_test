Ext.define('criterion.model.employer.ShiftRate', function() {

    var API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator();

    return {

        extend : 'criterion.model.employer.Abstract',

        requires : [
            'criterion.model.employer.shiftRate.Detail'
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_SHIFT_RATE
        },

        fields : [
            {
                name : 'employerId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'name',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'employeeGroups',
                persist : false
            }
        ],

        hasMany : [
            {
                model : 'criterion.model.employer.shiftRate.Detail',
                name : 'details',
                associationKey : 'details'
            }
        ]
    };
});

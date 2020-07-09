Ext.define('criterion.model.employer.ShiftOccurrence', function() {

    const API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator();

    return {

        extend : 'criterion.model.employer.Abstract',

        requires : [
            'criterion.model.employer.shift.occurrence.Shift'
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_SHIFT_OCCURRENCE
        },

        fields : [
            {
                name : 'shiftGroupId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'startDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
            },
            {
                name : 'employerName',
                type : 'string',
                persist : false
            },
            {
                name : 'shiftGroupName',
                type : 'string',
                persist : false
            },
            {
                name : 'startingDay',
                type : 'integer',
                persist : false
            },
            {
                name : 'employeesCount',
                type : 'integer',
                persist : false
            },
            {
                name : 'actionType',
                type : 'integer',
                persist : false
            },
            {
                name : 'canUsePrevious',
                type : 'boolean',
                persist : false
            }
        ],

        hasMany : [
            {
                model : 'criterion.model.employer.shift.occurrence.Shift',
                name : 'shifts',
                associationKey : 'shifts'
            },
        ]
    };
});

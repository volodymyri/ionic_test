Ext.define('criterion.model.employer.shift.occurrence.Detail', function() {

    const API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator();

    return {

        extend : 'criterion.model.employer.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_SHIFT_OCCURRENCE_DETAIL
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
                name : 'employeeCount',
                type : 'integer',
                persist : false
            }
        ]
    };
});

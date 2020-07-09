Ext.define('criterion.model.employer.shift.occurrence.StartData', function() {

    const API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator();

    return {

        extend : 'criterion.model.employer.Abstract',

        requires : [
            'criterion.model.employer.shift.occurrence.startData.Date'
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_SHIFT_OCCURRENCE_START_DATA
        },

        fields : [
            {
                name : 'shiftGroupId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY],
                persist : false
            },
            {
                name : 'shiftGroupName',
                type : 'string',
                persist : false
            },
            {
                name : 'startDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT,
                persist : false
            },
            {
                name : 'isRotating',
                type : 'boolean',
                persist : false
            }
        ],

        hasMany : [
            {
                model : 'criterion.model.employer.shift.occurrence.startData.Date',
                name : 'dates',
                associationKey : 'dates'
            }
        ]
    };
});

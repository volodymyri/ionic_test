Ext.define('criterion.model.employer.shift.occurrence.PreviousShift', function() {

    const API = criterion.consts.Api.API;

    return {

        extend : 'criterion.model.employer.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_SHIFT_OCCURRENCE_PREVIOUS_SHIFTS
        },

        fields : [
            {
                name : 'dateStart',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT,
                persist : false
            },
            {
                name : 'dateEnd',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT,
                persist : false
            }
        ]
    };
});

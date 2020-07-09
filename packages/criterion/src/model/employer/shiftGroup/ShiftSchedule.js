Ext.define('criterion.model.employer.shiftGroup.ShiftSchedule', function() {

    const VALIDATOR = criterion.Consts.getValidator();

    return {

        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'memory'
        },

        fields : [
            {
                name : 'shiftId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'day',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'startTime',
                type : 'date',
                dateFormat : criterion.consts.Api.TIME_FORMAT
            },
            {
                name : 'endTime',
                type : 'date',
                dateFormat : criterion.consts.Api.TIME_FORMAT
            },

            {
                name : 'startTimeCurrentDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT,
                persist : false,
                convert : (value, model) => Ext.Date.parse(Ext.Date.format(model.get('startTime'), criterion.consts.Api.TIME_FORMAT), criterion.consts.Api.TIME_FORMAT),
                depends : 'startTime'
            }
        ]
    };
});

Ext.define('criterion.model.employer.shift.occurrence.employee.Schedule', function() {

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'memory'
        },

        fields : [
            {
                name : 'shiftId',
                type : 'integer'
            },
            {
                name : 'name',
                type : 'string'
            },
            {
                name : 'day',
                type : 'integer'
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
            }
        ]

    };
});

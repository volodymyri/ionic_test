Ext.define('criterion.model.employer.shift.occurrence.employee.DayDetail', function() {

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'memory'
        },

        fields : [
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
            },
            {
                name : 'isAddedManually',
                type : 'boolean',
                persist : false
            },
            {
                name : 'title',
                type : 'string',
                persist : false
            }
        ]
    };
});

Ext.define('criterion.model.dashboard.Attendance', function() {

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'memory'
        },

        fields : [
            {
                name : 'dateValue',
                type : 'string'
            },
            {
                name : 'hoursValue',
                type : 'string'
            },
            {
                name : 'endOfWeek',
                type : 'boolean'
            },
            {
                name : 'isDayName',
                type : 'boolean'
            },
            {
                name : 'isWeekend',
                type : 'boolean'
            },
            {
                name : 'hasHours',
                type : 'boolean'
            }
        ]
    };

});

Ext.define('criterion.model.employee.attendance.dashboard.Actual', function() {

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'memory'
        },

        fields : [
            {
                name : 'start',
                type : 'date',
                dateFormat : criterion.consts.Api.TIME_FORMAT
            },
            {
                name : 'end',
                type : 'date',
                dateFormat : criterion.consts.Api.TIME_FORMAT
            },
            {
                name : 'violation',
                type : 'boolean'
            },
            {
                name : 'noPunchOrOutForDay',
                type : 'boolean'
            }
        ]
    }
});

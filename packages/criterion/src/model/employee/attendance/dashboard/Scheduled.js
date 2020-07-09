Ext.define('criterion.model.employee.attendance.dashboard.Scheduled', function() {

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
                name : 'isFullDayOff',
                type : 'boolean'
            }
        ]
    }
});

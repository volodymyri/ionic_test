Ext.define('criterion.model.employee.timesheet.TaskDetail', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.model.Abstract',

        requires : [
            'criterion.model.employee.timesheet.Income'
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_TIMESHEET_TASK_DETAIL
        },

        fields : [
            {
                name : 'timesheetTaskId',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'hours',
                type : 'integer',
                critical : true // BE side always need this values (hours + minutes)
            },
            {
                name : 'minutes',
                type : 'integer',
                critical : true
            },
            {
                name : 'units',
                type : 'number',
                defaultValue : 0
            },
            {
                name : 'days',
                type : 'number'
            },
            {
                name : 'time',
                type : 'string',
                persist : false,
                depends : ['hours', 'minutes'],
                calculate : function(data) {
                    return criterion.Utils.timeObjToStr(data);
                }
            },
            {
                name : 'totalHours',
                type : 'integer'
            },
            {
                name : 'regIncome',
                type : 'integer'
            },
            {
                name : 'overtime',
                type : 'integer'
            },
            {
                name : 'date',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
            },
            {
                name : 'endTime',
                type : 'date',
                dateFormat : criterion.consts.Api.TIME_FORMAT
            },
            {
                name : 'startTime',
                type : 'date',
                dateFormat : criterion.consts.Api.TIME_FORMAT
            },
            {
                name : 'timerStartDatetime',
                type : 'date',
                dateFormat : criterion.consts.Api.TIME_FORMAT
            },
            {
                type : 'criterion_timezone',
                name : 'timezoneCd'
            },
            {
                name : 'isBlockedInCurrentPaycode',
                type : 'boolean',
                persist : false
            },
            {
                name : 'isInsideGeofenceIn',
                type : 'boolean',
                allowNull : true,
                persist : false
            },
            {
                name : 'isInsideGeofenceOut',
                type : 'boolean',
                allowNull : true,
                persist : false
            }
        ],

        hasOne : [
            {
                model : 'criterion.model.employee.timesheet.Income',
                name : 'paycodeDetail',
                associationKey : 'paycodeDetail'
            }
        ]
    };
});

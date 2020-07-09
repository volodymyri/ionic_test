Ext.define('criterion.model.dashboard.SubordinateTimesheet', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.model.Abstract',

        requires : [
            'criterion.model.dashboard.subordinateTimesheet.Timesheet',
            'criterion.model.dashboard.subordinateTimesheet.DateHour'
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.DASHBOARD_SUBORDINATE_TIMESHEETS
        },

        fields : [
            {
                name : 'firstName',
                type : 'string'
            },
            {
                name : 'lastName',
                type : 'string'
            },
            {
                name : 'employeeNumber',
                type : 'string'
            },
            {
                name : 'employeeId',
                type : 'integer'
            },
            {
                name : 'totalHours',
                type : 'float'
            },
            {
                name : 'isBreak',
                type : 'boolean'
            },
            {
                name : 'isStarted',
                type : 'boolean'
            },
            {
                name : 'typeName',
                type : 'string',
                persist : false,
                calculate : function(data) {
                    if (data.isBreak && data.isStarted) {
                        return 'break';
                    } else if (data.isStarted) {
                        return 'in';
                    } else {
                        return 'out';
                    }
                }
            },
            {
                name : 'day1hours',
                persist : false
            },
            {
                name : 'day2hours',
                persist : false
            },
            {
                name : 'day3hours',
                persist : false
            },
            {
                name : 'day4hours',
                persist : false
            },
            {
                name : 'day5hours',
                persist : false
            },
            {
                name : 'day6hours',
                persist : false
            },
            {
                name : 'day7hours',
                persist : false
            }
        ],

        hasMany : [
            {
                model : 'criterion.model.dashboard.subordinateTimesheet.DateHour',
                name : 'dateHours',
                associationKey : 'dateHours'
            },
            {
                model : 'criterion.model.dashboard.subordinateTimesheet.Timesheet',
                name : 'timesheets',
                associationKey : 'timesheets'
            }
        ]
    };

});

Ext.define('criterion.model.employee.attendance.Dashboard', function() {

    const API = criterion.consts.Api.API;

    return {

        extend : 'criterion.model.employee.Abstract',

        requires : [
            'criterion.model.employee.attendance.dashboard.Scheduled',
            'criterion.model.employee.attendance.dashboard.Actual',
            'criterion.model.employee.attendance.dashboard.TimeOff'
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_ATTENDANCE_DASHBOARD
        },

        fields : [
            {
                name : 'date',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
            },
            {
                name : 'lastName',
                type : 'string'
            },
            {
                name : 'firstName',
                type : 'string'
            },
            {
                name : 'fullName',
                type : 'string',
                persist : false,
                calculate : data => data.firstName + ' ' + data.lastName
            },
            {
                name : 'employeeNumber',
                type : 'string'
            },
            {
                name : 'totalTimesheetHours',
                type : 'float'
            },
            {
                name : 'scheduledHours',
                type : 'float',
                allowNull : true
            },
            {
                name : 'variance',
                type : 'float',
                allowNull : true
            },
            {
                name : 'hasExceptions',
                type : 'boolean'
            },
            {
                name : 'employeeTimezoneCd',
                type : 'criterion_codedata',
                codeDataId : criterion.consts.Dict.TIME_ZONE
            },
            {
                type : 'criterion_codedatavalue',
                name : 'employeeTimezoneDesc',
                referenceField : 'employeeTimezoneCd'
            }
        ],

        hasOne : [
            {
                model : 'criterion.model.employee.attendance.dashboard.Scheduled',
                name : 'scheduled',
                associationKey : 'scheduled'
            }
        ],

        hasMany : [
            {
                model : 'criterion.model.employee.attendance.dashboard.Actual',
                name : 'actual',
                associationKey : 'actual'
            },
            {
                model : 'criterion.model.employee.attendance.dashboard.TimeOff',
                name : 'timeOffs',
                associationKey : 'timeOffs'
            }
        ]
    };
});

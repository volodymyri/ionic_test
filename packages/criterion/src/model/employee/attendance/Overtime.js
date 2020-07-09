Ext.define('criterion.model.employee.attendance.Overtime', function() {

    const API = criterion.consts.Api.API;

    return {

        extend : 'criterion.model.employee.Abstract',

        requires : [
            'criterion.model.employee.attendance.HoursInfo'
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_ATTENDANCE_OVERTIME
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
                name : 'employeeTitle',
                type : 'string'
            },
            {
                name : 'shiftGap',
                type : 'float'
            },
            {
                name : 'hoursDay',
                type : 'float'
            },
            {
                name : 'hoursWeek',
                type : 'float'
            }
        ],

        hasOne : [
            {
                name : 'day',
                associationKey : 'day',
                model : 'criterion.model.employee.attendance.HoursInfo'
            },
            {
                name : 'week',
                associationKey : 'week',
                model : 'criterion.model.employee.attendance.HoursInfo'
            }
        ]
    };
});

Ext.define('criterion.model.employee.attendance.WorkPeriodException', function() {

    var API = criterion.consts.Api.API;

    return {

        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_ATTENDANCE_WORK_PERIOD_EXCEPTION
        },

        idProperty : {
            name : 'id',
            type : 'string'
        },

        fields : [
            {
                name : 'date',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
            },
            {
                name : 'employeeId',
                type : 'integer'
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
                name : 'employeeNumber',
                type : 'string'
            },
            {
                name : 'scheduledStart',
                type : 'date',
                dateFormat : criterion.consts.Api.TIME_FORMAT,
                allowNull : true
            },
            {
                name : 'scheduledEnd',
                type : 'date',
                dateFormat : criterion.consts.Api.TIME_FORMAT,
                allowNull : true
            },
            {
                name : 'isRemoved',
                type : 'boolean'
            }
        ]
    };
});

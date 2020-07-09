Ext.define('criterion.model.employee.SubordinateTime', function() {

    var API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.employee.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_TIMESHEET_SUBORDINATE_TIME
        },

        fields : [
            {
                name : 'name',
                type : 'string'
            },
            {
                name : 'state',
                type : 'int'
            },
            {
                name : 'timesheetId',
                type : 'int'
            },
            {
                name : 'in',
                type : 'date'
            },
            {
                name : 'out',
                type : 'date'
            },
            {
                name : 'hours',
                type : 'string'
            }
        ]
    };
});

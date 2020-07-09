Ext.define('criterion.model.employee.timesheet.VerticalForSave', function() {

    const API = criterion.consts.Api.API;

    return {
        extend : 'criterion.model.Abstract',

        requires : [
            'criterion.model.employee.timesheet.vertical.TaskDetail'
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_TIMESHEET_VERTICAL
        },

        hasMany : [
            {
                model : 'criterion.model.employee.timesheet.vertical.TaskDetail',
                name : 'timesheetTaskDetails',
                associationKey : 'timesheetTaskDetails'
            }
        ]

    };
});

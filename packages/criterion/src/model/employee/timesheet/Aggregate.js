Ext.define('criterion.model.employee.timesheet.Aggregate', function() {

    const API = criterion.consts.Api.API;

    return {
        extend : 'criterion.model.employee.Timesheet',

        requires : [
            'criterion.model.employee.timesheet.aggregate.Task',
            'criterion.model.CustomData',
            'criterion.model.TimesheetType',
            'criterion.model.employee.timesheet.aggregate.Total'
        ],


        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_TIMESHEET_AGGREGATE
        },

        hasOne : [
            {
                model : 'criterion.model.TimesheetType',
                name : 'timesheetType',
                associationKey : 'timesheetType'
            },
            {
                model : 'criterion.model.employee.timesheet.aggregate.Total',
                name : 'totals',
                associationKey : 'totals'
            }
        ],

        hasMany : [
            {
                model : 'criterion.model.employee.timesheet.aggregate.Task',
                name : 'timesheetTasks',
                associationKey : 'timesheetTasks'
            }
        ]
    };
});

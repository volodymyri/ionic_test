Ext.define('criterion.model.employee.CalendarIcs', {

    extend : 'criterion.model.employee.Calendar',

    proxy : {
        type : 'criterion_rest',
        url : criterion.consts.Api.API.EMPLOYEE_CALENDAR_ICS_JSON
    },

    // So far associations aren't inherited correctly, so have to duplicate
    hasMany : [
        {
            model : 'criterion.model.employee.Birthday',
            name : 'birthdays',
            associationKey : 'birthdays'
        },
        {
            model : 'criterion.model.employee.Holiday',
            name : 'holidays',
            associationKey : 'holidays'
        },
        {
            model : 'criterion.model.employee.TimeOff',
            name : 'timeOffs',
            associationKey : 'timeOffs'
        },
        {
            model : 'criterion.model.employer.Course',
            name : 'courses',
            associationKey : 'courses'
        }
    ]

});

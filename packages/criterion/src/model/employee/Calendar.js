Ext.define('criterion.model.employee.Calendar', function() {

    var API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator();

    return {

        extend : 'criterion.model.Abstract',

        requires : [
            'criterion.model.employee.TimeOff',
            'criterion.model.employer.Course',
            'criterion.model.employee.Birthday',
            'criterion.model.employee.Holiday'
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_CALENDAR
        },

        fields : [
            {
                name : 'employeeId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'name',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'accessKey',
                persist : false,
                type : 'string'
            },
            {
                name : 'address',
                persist : false,
                type : 'string'
            },
            {
                name : 'content',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'isDefault',
                type : 'boolean',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'isEnabledICalendar',
                type : 'boolean'
            },
            {
                name : 'isConvertAllDay',
                type : 'boolean'
            }
        ],

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
    };

});

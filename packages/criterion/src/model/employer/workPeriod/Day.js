Ext.define('criterion.model.employer.workPeriod.Day', function() {

    const VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.Abstract',

        requires : [
            'criterion.model.employer.workPeriod.Detail'
        ],

        proxy : {
            type : 'memory',
            reader : {
                type : 'json'
            }
        },

        fields : [
            {
                name : 'workPeriodId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'dayOfWeek',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'defaultTimesheetHours',
                type : 'float'
            },
            {
                name : 'isActive',
                type : 'boolean',
                defaultValue : false
            }
        ],

        hasMany : [
            {
                model : 'criterion.model.employer.workPeriod.Detail',
                name : 'details',
                associationKey : 'details'
            }
        ]
    };
});

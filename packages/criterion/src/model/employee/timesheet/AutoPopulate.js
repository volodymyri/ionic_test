Ext.define('criterion.model.employee.timesheet.AutoPopulate', function() {

    return {

        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'memory'
        },

        fields : [
            {
                name : 'date',
                type : 'string',
                persist : false
            },
            {
                name : 'workPeriodHours',
                type : 'float',
                persist : false
            }
        ]

    };
});

Ext.define('criterion.model.employee.timesheet.aggregate.Total', function() {

    return {

        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'memory'
        },

        fields : [
            {
                name : 'regular',
                type : 'number',
                persist : false
            },
            {
                name : 'timeOffs',
                persist : false
            }
        ]

    };
});

Ext.define('criterion.model.employee.attendance.HoursInfo', function() {

    return {

        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'memory'
        },

        fields : [
            {
                name : 'regularHours',
                type : 'float'
            },
            {
                name : 'overtime',
                type : 'float'
            },
            {
                name : 'additionalHours',
                type : 'float'
            }
        ]
    };
});

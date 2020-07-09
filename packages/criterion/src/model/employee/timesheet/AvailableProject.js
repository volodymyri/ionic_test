Ext.define('criterion.model.employee.timesheet.AvailableProject', function() {

    return {
        extend : 'criterion.model.Abstract',

        fields : [
            {
                name : 'employerId',
                type : 'integer'
            },
            {
                name : 'code',
                type : 'string'
            },
            {
                name : 'name',
                type : 'string'
            },
            {
                name : 'description',
                type : 'string'
            },
            {
                name : 'employerWorkLocationId',
                type : 'integer'
            }
        ]
    };
});

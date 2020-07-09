Ext.define('criterion.model.employee.timesheet.AvailableTask', function() {

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
                name : 'isActive',
                type : 'boolean'
            },
            {
                name : 'projectId',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'workLocationAreaIds'
            },
            {
                name : 'classificationCodesAndValues'
            }
        ]
    };
});

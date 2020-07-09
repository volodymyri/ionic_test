Ext.define('criterion.model.employee.task.EmployeeTaskCustomField', function() {

    return {

        extend : 'criterion.model.Abstract',

        fields : [
            {
                name : 'codeTableId',
                type : 'integer'
            },
            {
                name : 'codeTableDetailId',
                type : 'integer'
            }
        ]
    };

});

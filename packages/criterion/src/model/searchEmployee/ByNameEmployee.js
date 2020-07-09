Ext.define('criterion.model.searchEmployee.ByNameEmployee', function() {

    return {
        extend : 'criterion.model.Person',

        fields : [
            {
                name : 'employeeId',
                type : 'int'
            }
        ]
    };

});

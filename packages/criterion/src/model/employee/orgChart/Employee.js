Ext.define('criterion.model.employee.orgChart.Employee', function() {

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'memory',
            reader : {
                type : 'json'
            }
        },

        fields : [
            {
                name : 'employeeId',
                type : 'integer'
            },
            {
                name : 'personName',
                type : 'string'
            },
            {
                name : 'positionTitle',
                type : 'string'
            },{
                name : 'employerName',
                type : 'string'
            },
            {
                name : 'fullTimeEquivalency',
                type : 'float'
            },
            {
                name : 'subordinatesCount',
                type : 'integer'
            }
        ]
    };
});
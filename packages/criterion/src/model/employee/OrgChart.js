Ext.define('criterion.model.employee.OrgChart', function() {

    return {

        extend : 'Ext.data.TreeModel',

        fields : [
            {
                name : 'employerName',
                type : 'string',
                allowNull : true
            },
            {
                name : 'positionTitle',
                type : 'string',
                allowNull : true
            },
            {
                name : 'openFTE',
                type : 'int',
                allowNull : true
            },
            {
                name : 'fullTimeEquivalency',
                type : 'float',
                allowNull : true
            },
            {
                name : 'subordinatesCount',
                type : 'int',
                allowNull : true
            },
            {
                name : 'employeeId',
                type : 'int',
                allowNull : true
            },
            {
                name : 'inaccessible',
                type : 'boolean'
            },
            {
                name : 'supervisorId',
                type : 'int'
            },
            {
                name : 'supervisorName',
                type : 'string'
            },
            {
                name : 'supervisors',
                type : 'auto'
            }
        ]

    };
});

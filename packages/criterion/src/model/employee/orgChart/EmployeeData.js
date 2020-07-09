Ext.define('criterion.model.employee.orgChart.EmployeeData', function() {

    return {
        extend : 'criterion.model.Abstract',

        requires : [
            'criterion.model.employee.orgChart.Employee',
            'criterion.model.employee.orgChart.OpenPosition'
        ],
        proxy : {
            type : 'memory',
            reader : {
                type : 'json'
            }
        },

        hasOne : [
            {
                model : 'criterion.model.employee.orgChart.Employee',
                name : 'keyEmployee',
                associationKey : 'keyEmployee'
            },
            {
                model : 'criterion.model.employee.orgChart.Employee',
                name : 'supervisor',
                associationKey : 'supervisor'
            }
        ],
        hasMany : [
            {
                model : 'criterion.model.employee.orgChart.Employee',
                name : 'subordinates',
                associationKey : 'subordinates'
            },
            {
                model : 'criterion.model.employee.orgChart.OpenPosition',
                name : 'openPositions',
                associationKey : 'openPositions'
            }
        ]
    };
});
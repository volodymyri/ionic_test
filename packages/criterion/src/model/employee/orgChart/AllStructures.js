Ext.define('criterion.model.employee.orgChart.AllStructures', function() {

    return {

        extend : 'criterion.model.Abstract',

        requires : [
            'criterion.model.employee.orgChart.EmployeeData'
        ],

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.EMPLOYEE_ORG_CHART_ALL_STRUCTURES
        },

        fields : [
            {
                name : 'structureId',
                type : 'integer'
            },
            {
                name : 'structureName',
                type : 'string'
            }
        ],

        hasOne : [
            {
                model : 'criterion.model.employee.orgChart.EmployeeData',
                name : 'employeeData',
                associationKey : 'employeeData'
            }
        ]
    };
});
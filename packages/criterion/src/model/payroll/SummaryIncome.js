Ext.define('criterion.model.payroll.SummaryIncome', function() {

    var API = criterion.consts.Api.API;

    return {

        extend : 'criterion.model.Abstract',

        requires : [
            'criterion.model.payroll.Income'
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.PAYROLL_INCOME
        },

        fields : [
            {
                name : 'payrollId',
                type : 'int'
            },
            {
                name : 'assignmentId',
                type : 'int',
                allowNull : true
            },
            {
                name : 'title',
                type : 'string'
            },
            {
                name : 'method',
                type : 'string'
            },
            {
                name : 'hours',
                type : 'float',
                allowNull : true
            },
            {
                name : 'rate',
                type : 'float',
                allowNull : true
            },
            {
                name : 'amount',
                type : 'float'
            },
            {
                name : 'workWeek',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'name',
                type : 'string'
            },

            {
                name : 'employeeTask',
                type : 'string',
                persist : false
            },
            {
                name : 'employerWorkLocation',
                type : 'string',
                persist : false
            },
            {
                name : 'workLocationArea',
                type : 'string',
                persist : false
            },
            {
                name : 'projectName',
                type : 'string',
                persist : false
            }
        ],

        hasMany : [
            {
                model : 'criterion.model.payroll.Income',
                name : 'innerIncomes',
                associationKey : 'innerIncomes'
            }
        ]
    };
});

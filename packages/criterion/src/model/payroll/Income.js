Ext.define('criterion.model.payroll.Income', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.PAYROLL_INCOME
        },

        fields : [
            {
                name : 'incomeListId',
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
                name : 'employerWorkLocationId',
                type : 'int',
                allowNull : true
            },
            {
                name : 'employerWorkLocation',
                type : 'string',
                persist : false
            },
            {
                name : 'taskId',
                type : 'int',
                allowNull : true
            },
            {
                name : 'employeeTask',
                type : 'string',
                persist : false
            },
            {
                name : 'projectId',
                type : 'int',
                allowNull : true
            },
            {
                name : 'projectName',
                type : 'string',
                persist : false
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
                name : 'grossUpAmount',
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
                name : 'incomeTypeCd',
                type : 'criterion_codedata',
                codeDataId : criterion.consts.Dict.PAYROLL_INCOME_TYPE
            },
            {
                name : 'workLocationAreaId',
                type : 'int',
                allowNull : true
            },
            {
                name : 'canEditRate',
                type : 'boolean'
            }
        ]
    };
});

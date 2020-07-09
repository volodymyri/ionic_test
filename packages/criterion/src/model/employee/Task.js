Ext.define('criterion.model.employee.Task', function() {

    const API = criterion.consts.Api.API;

    return {
        extend : 'criterion.model.Abstract',

        requires : [
            'criterion.model.employer.Task',
            'criterion.model.employer.TaskGroup',
            'criterion.model.employee.task.EmployeeTaskCustomField'
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_TASK
        },

        fields : [
            {
                name : 'employeeId',
                type : 'int',
                validators : [criterion.Consts.getValidator().NON_EMPTY]
            },
            {
                name : 'taskGroupId',
                type : 'integer'
            },
            {
                name : 'taskId',
                type : 'integer'
            },
            {
                name : 'projectId',
                type : 'integer'
            },
            {
                name : 'projectName',
                persist : false,
                type : 'string'
            },
            {
                name : 'autoAllocate',
                type : 'boolean',
                defaultValue : false
            },
            {
                name : 'allocation',
                type : 'number'
            },
            {
                name : 'startDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT,
                allowNull : true
            },
            {
                name : 'endDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT,
                allowNull : true
            },
            {
                name : 'taskName',
                persist : false,
                type : 'string'
            },
            {
                name : 'taskProjectName',
                persist : false,
                type : 'string'
            },
            {
                name : 'totalAllocation',
                persist : false,
                type : 'number'
            },

            {
                name : 'codeTableIds',
                defaultValue : []
            }
        ],

        hasMany : [
            {
                model : 'criterion.model.employee.task.EmployeeTaskCustomField',
                name : 'employeeTaskCustomField',
                associationKey : 'employeeTaskCustomField'
            }
        ]
    };

});

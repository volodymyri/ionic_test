Ext.define('criterion.model.employee.Hire', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.model.Abstract',

        requires : [
            'criterion.model.Person',
            'criterion.model.person.Address',
            'criterion.model.Employee',
            'criterion.model.Assignment',
            'criterion.model.employee.WorkLocation',
            'criterion.model.employee.Onboarding',
            'criterion.model.employeeGroup.Member'
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_HIRE_NEW
        },

        fields : [
            {
                name : 'assignment',
                type : 'auto'
            },
            {
                name : 'candidateJobPostingId',
                type : 'integer',
                allowNull : true
            }
        ],

        hasOne : [
            {
                model : 'criterion.model.Person',
                name : 'person',
                associationKey : 'person'
            },
            {
                model : 'criterion.model.person.Address',
                name : 'address',
                associationKey : 'address'
            },
            {
                model : 'criterion.model.Employee',
                name : 'employee',
                associationKey : 'employee'
            },
            {
                model : 'criterion.model.assignment.Detail',
                name : 'assignmentDetail',
                associationKey : 'assignmentDetail'
            }
        ],

        hasMany : [
            {
                model : 'criterion.model.employee.WorkLocation',
                name : 'employeeWorkLocations',
                associationKey : 'employeeWorkLocations'
            },
            {
                model : 'criterion.model.employee.Onboarding',
                name : 'onboarding',
                associationKey : 'onboarding'
            },
            {
                model : 'criterion.model.employeeGroup.Member',
                name : 'groups',
                associationKey : 'groups'
            }
        ]
    };
});

Ext.define('criterion.model.employer.shift.occurrence.EmployeeByDetail', function() {

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.EMPLOYER_SHIFT_OCCURRENCE_EMPLOYEE_BY_DETAIL
        },

        fields : [
            {
                name : 'employeeId',
                type : 'int'
            },
            {
                name : 'employeeName',
                type : 'string',
                persist : false
            }
        ]
    };
});

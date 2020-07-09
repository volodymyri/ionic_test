Ext.define('criterion.model.employee.TeamGoal', function() {

    return {

        extend : 'criterion.model.employee.Goal',

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.EMPLOYEE_TEAM_GOAL
        },

        fields : [
            {
                name : 'fullName',
                type : 'string',
                persist : false
            },
            {
                name : 'employerId',
                type : 'integer'
            }
        ]

    };
});

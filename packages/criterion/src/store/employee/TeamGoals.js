Ext.define('criterion.store.employee.TeamGoals', function() {

    return {
        extend : 'criterion.data.Store',

        alias : 'store.criterion_employee_team_goals',

        model : 'criterion.model.employee.TeamGoal',

        autoLoad : false,

        autoSync : false,

        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.EMPLOYEE_TEAM_GOAL
        }
    };

});

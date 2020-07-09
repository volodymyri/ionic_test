Ext.define('criterion.store.employee.TeamMembers', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.data.Store',

        alias : 'store.criterion_employee_team_members',

        model : 'criterion.model.employee.TeamMember',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_TEAM_MEMBERS
        }
    };

});

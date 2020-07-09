Ext.define('criterion.store.employee.subordinate.TeamMembers', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.store.LoadProtectedStore',

        alias : 'store.criterion_employee_subordinate_team_members',

        model : 'criterion.model.employee.Search',
        autoLoad : false,
        autoSync : false,

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_SUBORDINATE_TEAM_MEMBERS
        }
    };
});

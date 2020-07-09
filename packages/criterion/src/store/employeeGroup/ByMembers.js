Ext.define('criterion.store.employeeGroup.ByMembers', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.store.AbstractStore',
        alias : 'store.criterion_employee_group_by_members',

        model : 'criterion.model.employeeGroup.ByMember',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_GROUP_BY_MEMBER
        }
    };
});

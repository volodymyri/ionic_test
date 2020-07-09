Ext.define('criterion.store.employeeGroup.member.Search', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.store.AbstractStore',
        alias : 'store.criterion_employee_group_member_search',

        model : 'criterion.model.employeeGroup.member.Search',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_GROUP_MEMBER_SEARCH
        }
    };
});

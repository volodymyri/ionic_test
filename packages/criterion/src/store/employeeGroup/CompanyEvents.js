Ext.define('criterion.store.employeeGroup.CompanyEvents', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.store.AbstractStore',
        alias : 'store.criterion_employee_group_company_events',

        model : 'criterion.model.employeeGroup.CompanyEvent',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_GROUP_COMPANY_EVENT
        }
    };
});

Ext.define('criterion.store.employeeGroup.Holidays', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.store.AbstractStore',
        alias : 'store.criterion_employee_group_holidays',

        model : 'criterion.model.employeeGroup.Holiday',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE
    };
});

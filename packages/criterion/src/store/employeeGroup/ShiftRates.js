Ext.define('criterion.store.employeeGroup.ShiftRates', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.store.AbstractStore',
        alias : 'store.criterion_employee_group_shift_rates',

        model : 'criterion.model.employeeGroup.ShiftRate',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_GROUP_SHIFT_RATE
        }
    };
});

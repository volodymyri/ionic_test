Ext.define('criterion.store.employeeGroup.TimeClocks', function() {

    return {
        extend : 'criterion.store.AbstractStore',
        model : 'criterion.model.employeeGroup.TimeClock',
        alias : 'store.criterion_employee_group_time_clocks',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.EMPLOYEE_GROUP_TIME_CLOCK
        }
    };
});

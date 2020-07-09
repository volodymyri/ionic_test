Ext.define('criterion.store.employee.timeOff.TimeBalances', function() {

    var API = criterion.consts.Api.API;

    return {
        alias : 'store.criterion_employee_time_off_time_balances',

        extend : 'criterion.store.AbstractStore',

        model : 'criterion.model.employee.timeOff.TimeBalance',

        autoSync : false,

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_TIME_OFF_TIME_BALANCES
        }
    };

});

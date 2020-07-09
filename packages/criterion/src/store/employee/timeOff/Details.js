Ext.define('criterion.store.employee.timeOff.Details', function() {

    var API = criterion.consts.Api.API;

    return {
        alias : 'store.criterion_employee_time_off_details',

        extend : 'criterion.store.AbstractStore',

        model : 'criterion.model.employee.timeOff.Detail',

        autoSync : false,

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_TIME_OFF_DETAIL
        }
    };

});

Ext.define('criterion.store.employee.timeOff.AvailableTypes', function() {

    var API = criterion.consts.Api.API;

    return {
        alias : 'store.criterion_employee_time_off_available_types',

        extend : 'criterion.store.AbstractStore',

        model : 'criterion.model.employee.timeOff.AvailableType',

        autoSync : false,

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_TIME_OFF_AVAILABLE_TYPES
        }
    };

});

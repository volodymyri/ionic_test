Ext.define('criterion.store.employee.TimeOffs', function() {

    var API = criterion.consts.Api.API;

    return {
        alias : 'store.criterion_employee_time_offs',

        extend : 'criterion.store.AbstractStore',

        model : 'criterion.model.employee.TimeOff',

        autoSync : false,

        proxy: {
            type: 'criterion_rest',
            url : API.EMPLOYEE_TIME_OFF
        }
    };

});

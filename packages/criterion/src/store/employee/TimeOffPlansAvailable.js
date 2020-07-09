Ext.define('criterion.store.employee.TimeOffPlansAvailable', function() {

    var API = criterion.consts.Api.API;

    return {
        alias : 'store.criterion_employee_time_off_plans_available',

        extend : 'criterion.store.AbstractStore',

        model : 'criterion.model.employee.TimeOffPlanAvailable',

        autoSync : false,

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_TIME_OFF_PLAN_AVAILABLE
        }
    };

});

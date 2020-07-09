Ext.define('criterion.store.employee.TimeOffPlans', function() {

    var API = criterion.consts.Api.API;

    return {
        alias : 'store.criterion_employee_time_off_plans',

        extend : 'criterion.data.Store',

        model : 'criterion.model.employee.TimeOffPlan',

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_TIME_OFF_PLAN_PERIODS
        }
    };

});

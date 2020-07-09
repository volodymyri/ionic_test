Ext.define('criterion.store.dashboard.OnboardingTasks', function() {

    return {

        alias : 'store.criterion_dashboard_onboarding_tasks',

        extend : 'criterion.store.AbstractStore',

        model : 'criterion.model.employee.Onboarding',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.DASHBOARD_ONBOARDING_TASKS
        }
    };

});

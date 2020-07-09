Ext.define('criterion.store.employee.Onboardings', function() {

    return {
        extend : 'criterion.data.Store',

        alias : 'store.criterion_employee_onboardings',

        model : 'criterion.model.employee.Onboarding',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.EMPLOYEE_ONBOARDING
        }
    };
});

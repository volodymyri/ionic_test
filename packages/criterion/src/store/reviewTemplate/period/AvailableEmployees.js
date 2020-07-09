Ext.define('criterion.store.reviewTemplate.period.AvailableEmployees', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.store.LoadProtectedStore',

        alias : 'store.criterion_review_template_period_available_employees',

        model : 'criterion.model.employee.Search',
        autoLoad : false,
        autoSync : false,

        proxy : {
            type : 'criterion_rest',
            url : API.REVIEW_TEMPLATE_PERIOD_AVAILABLE_EMPLOYEE
        }
    };
});

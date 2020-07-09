Ext.define('criterion.store.employee.compensation.Claims', function() {

    var API = criterion.consts.Api.API;

    return {

        alias : 'store.criterion_employee_compensation_claims',

        extend : 'criterion.store.AbstractStore',

        model : 'criterion.model.employee.compensation.Claim',

        proxy : {
            type : 'criterion_rest',
            url : API.WORKER_COMPENSATION_CLAIM
        }
    };

});

Ext.define('criterion.store.employee.compensation.claim.Costs', function() {

    var API = criterion.consts.Api.API;

    return {

        alias : 'store.criterion_employee_compensation_claim_costs',

        extend : 'criterion.store.employee.compensation.claim.Abstract',

        model : 'criterion.model.employee.compensation.claim.Cost',

        proxy : {
            type : 'criterion_rest',
            url : API.WORKER_COMPENSATION_CLAIM_COST
        }
    };

});
Ext.define('criterion.store.employee.compensation.claim.Logs', function() {

    var API = criterion.consts.Api.API;

    return {

        alias : 'store.criterion_employee_compensation_claim_logs',

        extend : 'criterion.store.employee.compensation.claim.Abstract',

        model : 'criterion.model.employee.compensation.claim.Log',

        proxy : {
            type : 'criterion_rest',
            url : API.WORKER_COMPENSATION_CLAIM_LOG
        }
    };

});
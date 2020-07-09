Ext.define('criterion.store.employer.WorkersCompensations', function() {

    return {
        extend : 'criterion.store.AbstractStore',

        alias : 'store.criterion_employer_worker_compensations',

        model : 'criterion.model.employer.WorkersCompensation',

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.WORKERS_COMPENSATION
        }
    };
});


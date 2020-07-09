Ext.define('criterion.store.employer.payroll.Batches', function () {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.store.LoadProtectedStore',

        alias : 'store.criterion_employer_payroll_batches',

        model : 'criterion.model.employer.payroll.Batch',
        autoLoad : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_PAYROLL_BATCH
        }
    };
});

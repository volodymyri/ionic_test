Ext.define('criterion.store.employer.payroll.BatchDetails', function () {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.data.Store',

        alias : 'store.criterion_employer_payroll_batch_details',

        model : 'criterion.model.employer.payroll.BatchDetail',
        autoLoad : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_PAYROLL_BATCH_DETAIL
        }
    };
});

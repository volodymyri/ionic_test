Ext.define('criterion.store.employer.payrollBatch.IncomeLists', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.store.AbstractStore',
        alias : 'store.criterion_employer_payroll_batch_income_lists',

        model : 'criterion.model.employer.payrollBatch.IncomeList',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_PAYROLL_BATCH_INCOME_LIST
        }
    };

});

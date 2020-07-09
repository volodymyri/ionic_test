Ext.define('criterion.store.employer.payroll.Imports', function () {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.data.Store',

        alias : 'store.criterion_employer_payroll_imports',

        model : 'criterion.model.employer.payroll.Import',
        autoLoad : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE
    };
});

Ext.define('criterion.store.employer.payroll.Settings', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.data.Store',

        alias : 'store.criterion_employer_payroll_settings',

        model : 'criterion.model.employer.payroll.Setting',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_PAYROLL_SETTINGS
        }
    };
});

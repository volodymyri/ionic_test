Ext.define('criterion.store.Payrolls', function() {

    return {
        extend : 'criterion.data.Store',

        alias : 'store.criterion_payrolls',

        model : 'criterion.model.Payroll',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.PAYROLL
        }
    };
});

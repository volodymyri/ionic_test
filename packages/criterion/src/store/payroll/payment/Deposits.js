Ext.define('criterion.store.payroll.payment.Deposits', function() {

    return {
        extend : 'criterion.data.Store',

        alias : 'store.criterion_payroll_payment_deposits',

        model : 'criterion.model.payroll.payment.Deposit',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.PAYROLL_PAYMENT_DEPOSIT
        }
    };
});

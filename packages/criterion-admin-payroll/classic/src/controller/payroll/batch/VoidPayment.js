Ext.define('criterion.controller.payroll.batch.VoidPayment', function() {

    return {

        extend : 'criterion.controller.payroll.batch.BasePaymentAction',

        alias : 'controller.criterion_payroll_batch_void_payment',

        baseUrl : criterion.consts.Api.API.VOID_PAYMENT
    };
});

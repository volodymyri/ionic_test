Ext.define('criterion.view.payroll.batch.VoidPayment', function() {

    return {

        alias : 'widget.criterion_payroll_batch_void_payment',

        extend : 'criterion.view.payroll.batch.BasePaymentAction',

        requires : [
            'criterion.controller.payroll.batch.VoidPayment'
        ],

        controller : {
            type : 'criterion_payroll_batch_void_payment'
        },

        viewModel : {
            data : {
                btnTitle : i18n.gettext('Void')
            }
        },

        title : i18n.gettext('Void Payment')
    }
});

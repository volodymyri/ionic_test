Ext.define('criterion.view.payroll.batch.Reverse', function() {

    return {

        alias : 'widget.criterion_payroll_batch_reverse',

        extend : 'criterion.view.payroll.batch.BasePaymentAction',

        requires : [
            'criterion.controller.payroll.batch.Reverse'
        ],

        controller : {
            type : 'criterion_payroll_batch_reverse'
        },

        viewModel : {
            data : {
                btnTitle : i18n.gettext('Reverse')
            }
        },

        title : i18n.gettext('Reverse')
    }
});

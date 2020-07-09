Ext.define('criterion.controller.payroll.batch.Reverse', function() {

    return {

        extend : 'criterion.controller.payroll.batch.BasePaymentAction',

        alias : 'controller.criterion_payroll_batch_reverse',

        baseUrl : criterion.consts.Api.API.PAYROLL_REVERSE,

        onSuccess : function(res) {
            var view = this.getView();

            view.setLoading(false);
            criterion.Utils.toast(i18n.gettext('Successfully.'));
            view.fireEvent('batchUpdated', res.id);
            view.destroy();
        }
    };
});

Ext.define('criterion.controller.payroll.batch.BasePaymentAction', function() {

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_payroll_batch_base_payment_action',

        baseUrl : null,

        getSendData : function() {
            let vm = this.getViewModel(),
                payrollDeposits = vm.get('payrollDeposits'),
                payrollDepositIds = Ext.Array.map(payrollDeposits, function(payroll) {
                    return payroll.getId();
                });

            return {
                payrollDepositIds : payrollDepositIds,
                batchId : vm.get('batchId')
            };
        },

        handleAction : function() {
            let view = this.getView(),
                jsonData = this.getSendData(),
                url = this.baseUrl;

            if (!url) {
                return;
            }

            view.setLoading(true);

            criterion.Api.requestWithPromise({
                url : url,
                method : 'POST',
                jsonData : jsonData
            }).then({
                success : this.onSuccess,
                failure : function() {
                    view.setLoading(false);
                },
                scope : this
            })
        },

        onSuccess : function() {
            let view = this.getView();

            view.setLoading(false);
            criterion.Utils.toast(i18n.gettext('Successfully.'));
            view.fireEvent('batchUpdated');
            view.destroy();
        },

        handleCancelClick : function() {
            this.getView().destroy();
        }
    };
});

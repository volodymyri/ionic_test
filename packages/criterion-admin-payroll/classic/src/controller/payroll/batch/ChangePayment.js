Ext.define('criterion.controller.payroll.batch.ChangePayment', function() {

    const PAID_BY_CHECK = criterion.Consts.PAYMENT_TYPE.PAID_BY_CHECK,
        PAID_BY_ACH = criterion.Consts.PAYMENT_TYPE.PAID_BY_ACH;

    return {

        extend : 'criterion.controller.payroll.batch.BasePaymentAction',

        alias : 'controller.criterion_payroll_batch_change_payment',

        baseUrl : criterion.consts.Api.API.CHANGE_PAYMENT,

        handleShow() {
            let vm = this.getViewModel(),
                payrollDeposits = vm.get('payrollDeposits'),
                deposits = vm.get('deposits');

            Ext.Array.each(payrollDeposits, payrollDeposit => {
                if (payrollDeposit.get('paymentTypeCode') === PAID_BY_CHECK) {
                    let achBankAccounts = payrollDeposit.achBankAccounts();

                    if (achBankAccounts.count() > 1) {
                        payrollDeposit.set('bankAccountId', achBankAccounts.first().getId());
                        deposits.add(payrollDeposit);
                    }
                }
            });
        },

        getSendData() {
            let data = this.callParent(arguments),
                vm = this.getViewModel(),
                deposits = vm.get('deposits'),
                paymentType = this.lookup('paymentType'),
                bankAccounts = [];

            if (paymentType.getSelection().get('code') === PAID_BY_ACH) {
                deposits.each(deposit => {
                    bankAccounts.push({
                        payrollDepositId : deposit.getId(),
                        bankAccountId : deposit.get('bankAccountId')
                    });
                });
            }

            data['paymentTypeCd'] = paymentType.getValue();
            data['bankAccounts'] = bankAccounts;

            return data;
        },

        handleAction() {
            let paymentType = this.lookup('paymentType');

            if (!paymentType.validate()) {
                return;
            }

            this.callParent(arguments);
        },

        handleChangeType(cmp, val) {
            let plugin = this.getView().getPlugins()[0],
                vm = this.getViewModel(),
                deposits = vm.get('deposits');

            Ext.Function.defer(function() {
                if (val && cmp.getSelection().get('code') === PAID_BY_ACH && deposits.count()) {
                    plugin.changeWidth(criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_WIDTH);
                } else {
                    plugin.changeWidth(criterion.Consts.UI_DEFAULTS.MODAL_NARROW_WIDTH);
                }
            }, 100, this);
        }
    };
});

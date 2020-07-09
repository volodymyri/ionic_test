Ext.define('criterion.controller.payroll.batch.PrintCheck', function() {

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_payroll_batch_print_check',

        handlePrintClick : function() {
            var me = this,
                view = this.getView(),
                bankAccountCombo = this.lookup('bankAccountCombo'),
                startingCheckNumber = this.lookup('startingCheckNumber');

            if (!bankAccountCombo.validate() || !startingCheckNumber.validate()) {
                return;
            }

            view.setLoading(true);

            criterion.Api.requestWithPromise({
                method : 'GET',
                url : Ext.util.Format.format(
                    criterion.consts.Api.API.CHECK_BANK_ACCOUNT_REPORT,
                    bankAccountCombo.getValue()
                )
            }).then({
                success : function() {
                    me.printCheck();
                }
            }).always(function() {
                view.setLoading(false);
            });

        },

        printCheck : function() {
            var view = this.getView(),
                vm = this.getViewModel(),
                bankAccountCombo = this.lookup('bankAccountCombo'),
                sortChecksByCombo = this.lookup('sortChecksByCombo'),
                startingCheckNumber = this.lookup('startingCheckNumber'),
                payrollDeposits = vm.get('payrollDeposits'),
                batchId = vm.get('batchId'),
                payrollIds = payrollDeposits.length ? Ext.Array.map(payrollDeposits, function(data) {
                    return 'payrollDepositId=' + data.getId()
                }) : ['allPayrollDeposits=1'];

            payrollIds.push('batchId=' + batchId);

            var tab = window.open(criterion.Api.getSecureResourceUrl(
                Ext.util.Format.format('{0}?{1}&bankAccountId={2}&checkNumber={3}&sortBy={4}',
                    criterion.consts.Api.API.PRINT_CHECK,
                    payrollIds.join('&'),
                    bankAccountCombo.getValue(),
                    startingCheckNumber.getValue(),
                    sortChecksByCombo.getValue()
                )
            ), '_blank');

            tab && tab.print();

            Ext.defer(function() {
                view.fireEvent('batchUpdated');
                view.destroy();
            }, 1000); // for waiting some BE work with batch
        },

        handleCancelClick : function() {
            this.getView().destroy();
        }
    };
});

Ext.define('criterion.controller.payroll.batch.payrollEntry.GrossUpCalculate', function() {

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_payroll_batch_payroll_entry_gross_up_calculate',

        handleCalculate : function() {
            var view = this.getView();

            if (this.lookupReference('form').isValid()) {
                view.fireEvent('grossUp', {
                    incomeId : this.lookupReference('income').getValue(),
                    amount : this.lookupReference('amount').getValue()
                });

                this.getView().destroy();
            }
        },

        handleCancel : function() {
            this.getView().destroy();
        }
    };
});


Ext.define('criterion.controller.settings.incomes.Incomes', function() {

    return {

        extend : 'criterion.controller.employer.GridView',

        alias : 'controller.criterion_payroll_settings_incomes',

        load : function() {
            var teIncomes = this.getViewModel().getStore('teIncomes');

            if (!teIncomes.isLoaded()) {
                teIncomes.load();
            }

            this.callParent(arguments);
        }
    };

});

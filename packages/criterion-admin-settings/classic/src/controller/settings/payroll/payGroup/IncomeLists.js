Ext.define('criterion.controller.settings.payroll.payGroup.IncomeLists', function () {
    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_payroll_settings_pay_group_income_lists',

        onSelect: function () {
            var view = this.getView(),
                vm = this.getViewModel(),
                form = this.lookupReference('form'),
                incomeType = this.lookupReference('incomeType');

            if (form.isValid()) {
                view.fireEvent('select', incomeType.getSelectedRecord());
                view.destroy();
            }
        }
    };
});

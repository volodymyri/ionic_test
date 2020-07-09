Ext.define('criterion.controller.settings.system.compensationType.TaxSelect', function() {

    return {
        extend : 'criterion.controller.MultiRecordPickerRemote',

        alias : 'controller.criterion_payroll_settings_system_compensation_type_tax_select',

        onSelectionChange : function(grid, selected) {},

        onSelectButtonHandler : function() {
            var view = this.getView(),
                vm = this.getViewModel(),
                selected = this.getView().lookupReference('grid').getSelection();

            view.fireEvent('selectRecords', selected, vm.get('compTypeCd'));
            view.destroy();
        }

    };
});

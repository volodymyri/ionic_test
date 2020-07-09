Ext.define('criterion.view.settings.system.dataImport.EmployeeIncomes', function() {

    return {

        alias : 'widget.criterion_settings_data_import_employee_incomes',

        extend : 'criterion.view.settings.system.dataImport.Base',

        requires : [
            'criterion.controller.settings.system.dataImport.EmployeeIncomes'
        ],

        controller : 'criterion_settings_data_import_employee_incomes'
    }
});
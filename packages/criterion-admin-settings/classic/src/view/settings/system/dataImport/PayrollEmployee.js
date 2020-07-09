Ext.define('criterion.view.settings.system.dataImport.PayrollEmployee', function() {

    return {

        alias : 'widget.criterion_settings_data_import_payroll_employee',

        extend : 'criterion.view.settings.system.dataImport.Base',

        requires : [
            'criterion.controller.settings.system.dataImport.PayrollEmployee'
        ],

        controller : 'criterion_settings_data_import_payroll_employee'
    }
});
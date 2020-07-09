Ext.define('criterion.view.settings.system.dataImport.PayrollSetup', function() {

    return {

        alias : 'widget.criterion_settings_data_import_payroll_setup',

        extend : 'criterion.view.settings.system.dataImport.Base',

        requires : [
            'criterion.controller.settings.system.dataImport.PayrollSetup'
        ],

        controller : 'criterion_settings_data_import_payroll_setup'
    }
});
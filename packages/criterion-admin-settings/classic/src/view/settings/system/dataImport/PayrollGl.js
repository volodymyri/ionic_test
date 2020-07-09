Ext.define('criterion.view.settings.system.dataImport.PayrollGl', function() {

    return {

        alias : 'widget.criterion_settings_data_import_payroll_gl',

        extend : 'criterion.view.settings.system.dataImport.Base',

        requires : [
            'criterion.controller.settings.system.dataImport.PayrollGl'
        ],

        controller : 'criterion_settings_data_import_payroll_gl'
    }
});
Ext.define('criterion.view.settings.system.dataImport.BenefitsDeductions', function() {

    return {

        alias : 'widget.criterion_settings_data_import_benefits_deductions',

        extend : 'criterion.view.settings.system.dataImport.Base',

        requires : [
            'criterion.controller.settings.system.dataImport.BenefitsDeductions'
        ],

        controller : 'criterion_settings_data_import_benefits_deductions'
    }
});
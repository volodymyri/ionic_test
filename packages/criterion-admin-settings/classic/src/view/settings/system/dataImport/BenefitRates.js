Ext.define('criterion.view.settings.system.dataImport.BenefitRates', function() {

    return {

        alias : 'widget.criterion_settings_data_import_benefit_rates',

        extend : 'criterion.view.settings.system.dataImport.Base',

        requires : [
            'criterion.controller.settings.system.dataImport.BenefitRates'
        ],

        controller : 'criterion_settings_data_import_benefit_rates'
    }
});
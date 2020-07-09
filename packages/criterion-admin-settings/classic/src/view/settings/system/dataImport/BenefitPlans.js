Ext.define('criterion.view.settings.system.dataImport.BenefitPlans', function() {

    return {

        alias : 'widget.criterion_settings_data_import_benefit_plans',

        extend : 'criterion.view.settings.system.dataImport.Base',

        requires : [
            'criterion.controller.settings.system.dataImport.BenefitPlans'
        ],

        controller : 'criterion_settings_data_import_benefit_plans'
    }
});

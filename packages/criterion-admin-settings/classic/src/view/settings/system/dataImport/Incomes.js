Ext.define('criterion.view.settings.system.dataImport.Incomes', function() {

    return {

        alias : 'widget.criterion_settings_data_import_incomes',

        extend : 'criterion.view.settings.system.dataImport.Base',

        requires : [
            'criterion.controller.settings.system.dataImport.Incomes'
        ],

        controller : 'criterion_settings_data_import_incomes'
    }
});
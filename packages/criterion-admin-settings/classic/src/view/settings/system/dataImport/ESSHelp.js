Ext.define('criterion.view.settings.system.dataImport.ESSHelp', function() {

    return {

        alias : 'widget.criterion_settings_data_import_ess_help',

        extend : 'criterion.view.settings.system.dataImport.Base',

        requires : [
            'criterion.controller.settings.system.dataImport.ESSHelp'
        ],

        controller : 'criterion_settings_data_import_ess_help'
    }
});
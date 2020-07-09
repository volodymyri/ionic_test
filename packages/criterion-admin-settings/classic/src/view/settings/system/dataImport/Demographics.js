Ext.define('criterion.view.settings.system.dataImport.Demographics', function() {

    return {

        alias : 'widget.criterion_settings_data_import_demographics',

        extend : 'criterion.view.settings.system.dataImport.Base',

        requires : [
            'criterion.controller.settings.system.dataImport.Demographics'
        ],

        controller : 'criterion_settings_data_import_demographics'
    }
});
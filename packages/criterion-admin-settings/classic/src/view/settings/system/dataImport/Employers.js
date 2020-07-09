Ext.define('criterion.view.settings.system.dataImport.Employers', function() {

    return {

        alias : 'widget.criterion_settings_data_import_employers',

        extend : 'criterion.view.settings.system.dataImport.Base',

        requires : [
            'criterion.controller.settings.system.dataImport.Employers'
        ],

        controller : 'criterion_settings_data_import_employers'
    }
});
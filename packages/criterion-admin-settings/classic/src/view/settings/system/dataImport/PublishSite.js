Ext.define('criterion.view.settings.system.dataImport.PublishSite', function() {

    return {

        alias : 'widget.criterion_settings_data_import_publish_site',

        extend : 'criterion.view.settings.system.dataImport.Base',

        requires : [
            'criterion.controller.settings.system.dataImport.PublishSite'
        ],

        controller : 'criterion_settings_data_import_publish_site'
    }
});
Ext.define('criterion.view.settings.system.dataImport.SecurityProfile', function() {

    return {

        alias : 'widget.criterion_settings_data_import_security_profile',

        extend : 'criterion.view.settings.system.dataImport.Base',

        requires : [
            'criterion.controller.settings.system.dataImport.SecurityProfile'
        ],

        controller : 'criterion_settings_data_import_security_profile'
    }
});
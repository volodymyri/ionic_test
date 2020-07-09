Ext.define('criterion.view.settings.system.dataImport.CodeTables', function() {

    return {

        alias : 'widget.criterion_settings_data_import_code_tables',

        extend : 'criterion.view.settings.system.dataImport.Base',

        requires : [
            'criterion.controller.settings.system.dataImport.CodeTables'
        ],

        controller : 'criterion_settings_data_import_code_tables'
    }
});
Ext.define('criterion.view.settings.system.dataImport.OrganizationChart', function() {

    return {

        alias : 'widget.criterion_settings_data_import_organization_chart',

        extend : 'criterion.view.settings.system.dataImport.Base',

        requires : [
            'criterion.controller.settings.system.dataImport.OrganizationChart'
        ],

        controller : 'criterion_settings_data_import_organization_chart'

    }
});

Ext.define('criterion.view.settings.system.dataImport.JobCodes', function() {

    return {

        alias : 'widget.criterion_settings_data_import_job_codes',

        extend : 'criterion.view.settings.system.dataImport.Base',

        requires : [
            'criterion.controller.settings.system.dataImport.JobCodes'
        ],

        controller : 'criterion_settings_data_import_job_codes'
    }
});
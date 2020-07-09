Ext.define('criterion.view.settings.system.dataImport.JobPostings', function() {

    return {

        alias : 'widget.criterion_settings_data_import_job_postings',

        extend : 'criterion.view.settings.system.dataImport.Base',

        requires : [
            'criterion.controller.settings.system.dataImport.JobPostings'
        ],

        controller : 'criterion_settings_data_import_job_postings'
    }
});
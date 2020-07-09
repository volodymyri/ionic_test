Ext.define('criterion.controller.settings.system.dataImport.JobPostings', function() {

    return {

        extend : 'criterion.controller.settings.system.dataImport.Base',

        alias : 'controller.criterion_settings_data_import_job_postings',

        submitHandler : function() {
            this.pushForm({
                windowTitle : i18n.gettext('Job Postings Import'),
                submitAttributes : {
                    url : criterion.consts.Api.API.JOB_POSTINGS_IMPORT + '/import', // remind backend to refactor routes
                    data : {
                        jobPostingsFile : this.templateFile
                    }
                },
                errorsFileAttributes : {
                    url : criterion.consts.Api.API.JOB_POSTINGS_IMPORT_ERRORS
                },
                processAttributes : {
                    url : criterion.consts.Api.API.JOB_POSTINGS_IMPORT_PROCESS
                }
            });
        }
    }
});
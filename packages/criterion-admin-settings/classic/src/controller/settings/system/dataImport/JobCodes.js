Ext.define('criterion.controller.settings.system.dataImport.JobCodes', function() {

    return {

        extend : 'criterion.controller.settings.system.dataImport.Base',

        alias : 'controller.criterion_settings_data_import_job_codes',

        submitHandler : function() {
            this.pushForm({
                windowTitle : i18n.gettext('Job Codes Import'),
                submitAttributes : {
                    url : criterion.consts.Api.API.JOB_CODES_IMPORT,
                    data : {
                        jobsFile : this.templateFile
                    }
                },
                errorsFileAttributes : {
                    url : criterion.consts.Api.API.JOB_CODES_IMPORT_ERRORS
                },
                processAttributes : {
                    url : criterion.consts.Api.API.JOB_CODES_IMPORT_UPDATE
                }
            });
        }
    }
});
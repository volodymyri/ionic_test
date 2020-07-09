Ext.define('criterion.controller.settings.system.dataImport.CoursesByEmployer', function() {

    return {

        extend : 'criterion.controller.settings.system.dataImport.Base',

        alias : 'controller.criterion_settings_data_import_courses_by_employer',

        submitHandler : function() {
            this.pushForm({
                windowTitle : i18n.gettext('Courses By Employer Import'),
                submitAttributes : {
                    url : criterion.consts.Api.API.COURSES_BY_EMPLOYER_IMPORT + '/import', // remind backend to refactor routes
                    data : {
                        coursesByEmployerFile : this.templateFile
                    }
                },
                errorsFileAttributes : {
                    url : criterion.consts.Api.API.COURSES_BY_EMPLOYER_IMPORT_ERRORS
                },
                processAttributes : {
                    url : criterion.consts.Api.API.COURSES_BY_EMPLOYER_IMPORT_PROCESS
                }
            });
        }
    }
});
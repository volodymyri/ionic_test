Ext.define('criterion.controller.settings.system.dataImport.CoursesByEmployee', function() {

    return {

        extend : 'criterion.controller.settings.system.dataImport.Base',

        alias : 'controller.criterion_settings_data_import_courses_by_employee',

        submitHandler : function() {
            this.pushForm({
                windowTitle : i18n.gettext('Courses By Employee Import'),
                submitAttributes : {
                    url : criterion.consts.Api.API.COURSES_BY_EMPLOYEE_IMPORT + '/import', // remind backend to refactor routes
                    data : {
                        coursesByEmployeeFile : this.templateFile
                    }
                },
                errorsFileAttributes : {
                    url : criterion.consts.Api.API.COURSES_BY_EMPLOYEE_IMPORT_ERRORS
                },
                processAttributes : {
                    url : criterion.consts.Api.API.COURSES_BY_EMPLOYEE_IMPORT_PROCESS
                }
            });
        }
    }
});
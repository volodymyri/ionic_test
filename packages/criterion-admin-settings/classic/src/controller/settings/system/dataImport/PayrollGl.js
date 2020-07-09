Ext.define('criterion.controller.settings.system.dataImport.PayrollGl', function() {

    return {

        extend : 'criterion.controller.settings.system.dataImport.Base',

        alias : 'controller.criterion_settings_data_import_payroll_gl',

        submitHandler : function() {
            this.pushForm({
                windowTitle : i18n.gettext('Pay GL Import'),
                submitAttributes : {
                    url : criterion.consts.Api.API.PAYROLL_IMPORT_GL_IMPORT,
                    data : {
                        payrollGLFile : this.templateFile
                    }
                },
                errorsFileAttributes : {
                    url : criterion.consts.Api.API.PAYROLL_IMPORT_GL_ERRORS
                },
                processAttributes : {
                    url : criterion.consts.Api.API.PAYROLL_IMPORT_GL
                }
            });
        }
    }
});
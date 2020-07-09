Ext.define('criterion.controller.settings.system.dataImport.PayrollSetup', function() {

    return {

        extend : 'criterion.controller.settings.system.dataImport.Base',

        alias : 'controller.criterion_settings_data_import_payroll_setup',

        submitHandler : function() {
            this.pushForm({
                windowTitle : i18n.gettext('Payroll Setup Import'),
                submitAttributes : {
                    url : criterion.consts.Api.API.PAYROLL_IMPORT_SETUP_IMPORT,
                    data : {
                        payrollSetupFile : this.templateFile
                    }
                },
                errorsFileAttributes : {
                    url : criterion.consts.Api.API.PAYROLL_IMPORT_SETUP_ERRORS
                },
                processAttributes : {
                    url : criterion.consts.Api.API.PAYROLL_IMPORT_SETUP
                }
            });
        }
    }
});
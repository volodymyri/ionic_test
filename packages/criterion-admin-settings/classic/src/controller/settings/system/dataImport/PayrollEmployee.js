Ext.define('criterion.controller.settings.system.dataImport.PayrollEmployee', function() {

    return {

        extend : 'criterion.controller.settings.system.dataImport.Base',

        alias : 'controller.criterion_settings_data_import_payroll_employee',

        submitHandler : function() {
            this.pushForm({
                windowTitle : i18n.gettext('Pay Employee Import'),
                submitAttributes : {
                    url : criterion.consts.Api.API.PAYROLL_IMPORT_EMPLOYEE_IMPORT,
                    data : {
                        payrollEmployeeFile : this.templateFile,
                        employerId : this.getSelectedEmployerId()
                    }
                },
                errorsFileAttributes : {
                    url : criterion.consts.Api.API.PAYROLL_IMPORT_EMPLOYEE_ERRORS
                },
                processAttributes : {
                    url : criterion.consts.Api.API.PAYROLL_IMPORT_EMPLOYEE,
                    orderedParams : [
                        this.getSelectedEmployerId()
                    ]
                }
            });
        }
    }
});
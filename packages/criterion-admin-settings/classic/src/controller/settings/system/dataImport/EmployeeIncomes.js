Ext.define('criterion.controller.settings.system.dataImport.EmployeeIncomes', function() {

    return {

        extend : 'criterion.controller.settings.system.dataImport.Base',

        alias : 'controller.criterion_settings_data_import_employee_incomes',

        submitHandler : function() {
            this.pushForm({
                windowTitle : i18n.gettext('Employee Incomes Import'),
                submitAttributes : {
                    url : criterion.consts.Api.API.EMPLOYEE_INCOMES_IMPORT,
                    data : {
                        employeeIncomesFile : this.templateFile,
                        employerId : this.getSelectedEmployerId()
                    }
                },
                errorsFileAttributes : {
                    url : criterion.consts.Api.API.EMPLOYEE_INCOMES_IMPORT_ERRORS
                },
                processAttributes : {
                    url : criterion.consts.Api.API.EMPLOYEE_INCOMES_IMPORT_UPDATE,
                    orderedParams : [this.getSelectedEmployerId()]
                }
            });
        }
    }
});
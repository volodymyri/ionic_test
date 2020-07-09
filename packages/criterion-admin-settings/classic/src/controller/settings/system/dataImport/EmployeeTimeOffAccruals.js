Ext.define('criterion.controller.settings.system.dataImport.EmployeeTimeOffAccruals', function() {

    return {

        extend : 'criterion.controller.settings.system.dataImport.Base',

        alias : 'controller.criterion_settings_data_import_employee_timeoff_accruals',

        submitHandler : function() {
            var accrualDate = this.lookup('accrualDate').getValue();

            this.pushForm({
                windowTitle : i18n.gettext('Employee Time Off Accruals Import'),
                submitAttributes : {
                    url : criterion.consts.Api.API.EMPLOYEE_TIME_OFF_ACCRUALS_IMPORT,
                    data : {
                        employeeTimeOffAccrualsFile : this.templateFile,
                        employerId : this.getSelectedEmployerId(),
                        accrualDate : Ext.Date.format(accrualDate, criterion.consts.Api.DATE_FORMAT)
                    }
                },
                errorsFileAttributes : {
                    url : criterion.consts.Api.API.EMPLOYEE_TIME_OFF_ACCRUALS_ERRORS
                },
                processAttributes : {
                    url : criterion.consts.Api.API.EMPLOYEE_TIME_OFF_ACCRUALS_IMPORT_PROCESS,
                    orderedParams : [
                        this.getSelectedEmployerId(),
                        criterion.Api.getEmployeeId(),
                        Ext.Date.format(accrualDate, criterion.consts.Api.DATE_FORMAT)
                    ]
                }
            });
        }
    }
});
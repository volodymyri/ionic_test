Ext.define('criterion.controller.settings.system.dataImport.BenefitsDeductions', function() {

    return {

        extend : 'criterion.controller.settings.system.dataImport.Base',

        alias : 'controller.criterion_settings_data_import_benefits_deductions',

        submitHandler : function() {
            this.pushForm({
                windowTitle : i18n.gettext('Employee Benefit Plans Import'),
                submitAttributes : {
                    url : criterion.consts.Api.API.BENEFITS_DEDUCTIONS_IMPORT,
                    data : {
                        employeeBenefitsFile : this.templateFile,
                        employerId : this.getSelectedEmployerId()
                    }
                },
                errorsFileAttributes : {
                    url : criterion.consts.Api.API.BENEFITS_DEDUCTIONS_IMPORT_ERRORS
                },
                processAttributes : {
                    url : criterion.consts.Api.API.BENEFITS_DEDUCTIONS_IMPORT_UPDATE,
                    orderedParams : [
                        this.getSelectedEmployerId()
                    ]
                },
                discrepanciesAttributes : {
                    url : criterion.consts.Api.API.BENEFITS_DEDUCTIONS_IMPORT_DISCREPANCIES,
                    msg : i18n.gettext('Benefits and Deductions data has been validated. Please review the discrepancy report. <br />If the discrepancies are not acceptable, please delete appropriate records, <br />make required corrections and process the import again.')
                }
            });
        }
    }
});
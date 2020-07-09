Ext.define('criterion.controller.settings.system.dataImport.PayRateRevisions', function() {

    return {

        extend : 'criterion.controller.settings.system.dataImport.Base',

        alias : 'controller.criterion_settings_data_import_pay_rate_revisions',

        submitHandler : function() {
            var assignmentActionCd = this.lookup('assignmentAction').getValue(),
                effectiveDate = this.lookup('effectiveDate').getValue();

            this.pushForm({
                windowTitle : i18n.gettext('Pay Rate Revision Import'),
                submitAttributes : {
                    url : criterion.consts.Api.API.PAY_RATE_REVISION_IMPORT,
                    data : {
                        payRateRevisionsFile : this.templateFile,
                        employerId : this.getSelectedEmployerId()
                    }
                },
                errorsFileAttributes : {
                    url : criterion.consts.Api.API.PAY_RATE_REVISION_ERRORS
                },
                processAttributes : {
                    url : criterion.consts.Api.API.PAY_RATE_REVISION_IMPORT_PROCESS,
                    orderedParams : [
                        this.getSelectedEmployerId(),
                        criterion.Api.getEmployeeId(),
                        assignmentActionCd,
                        Ext.Date.format(effectiveDate, 'Y.m.d')
                    ]
                }
            });
        }
    }
});
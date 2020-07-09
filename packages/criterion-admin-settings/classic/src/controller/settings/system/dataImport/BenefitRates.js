Ext.define('criterion.controller.settings.system.dataImport.BenefitRates', function() {

    return {

        extend : 'criterion.controller.settings.system.dataImport.Base',

        alias : 'controller.criterion_settings_data_import_benefit_rates',

        submitHandler : function() {
            this.pushForm({
                windowTitle : i18n.gettext('Benefit Rates Import'),
                submitAttributes : {
                    url : criterion.consts.Api.API.BENEFITS_RATES_IMPORT + '/import',
                    data : {
                        benefitsRatesFile : this.templateFile,
                        employerId : this.getSelectedEmployerId()
                    }
                },
                errorsFileAttributes : {
                    url : criterion.consts.Api.API.BENEFITS_RATES_IMPORT_ERRORS
                },
                processAttributes : {
                    url : criterion.consts.Api.API.BENEFITS_RATES_IMPORT_UPDATE,
                    orderedParams : [
                        this.getSelectedEmployerId()
                    ]
                }
            });
        }
    }
});
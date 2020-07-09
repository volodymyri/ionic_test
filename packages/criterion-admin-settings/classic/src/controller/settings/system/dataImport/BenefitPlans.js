Ext.define('criterion.controller.settings.system.dataImport.BenefitPlans', function() {

    return {

        extend : 'criterion.controller.settings.system.dataImport.Base',

        alias : 'controller.criterion_settings_data_import_benefit_plans',

        submitHandler : function() {
            this.pushForm({
                windowTitle : i18n.gettext('Benefit Plans Import'),
                submitAttributes : {
                    url : criterion.consts.Api.API.BENEFITS_PLANS_IMPORT + '/import',
                    data : {
                        benefitPlansFile : this.templateFile
                    }
                },
                errorsFileAttributes : {
                    url : criterion.consts.Api.API.BENEFITS_PLANS_IMPORT_ERRORS
                },
                processAttributes : {
                    url : criterion.consts.Api.API.BENEFITS_PLANS_IMPORT_UPDATE
                }
            });
        }
    }
});

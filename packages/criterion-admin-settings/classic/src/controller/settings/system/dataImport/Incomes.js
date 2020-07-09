Ext.define('criterion.controller.settings.system.dataImport.Incomes', function() {

    return {

        extend : 'criterion.controller.settings.system.dataImport.Base',

        alias : 'controller.criterion_settings_data_import_incomes',

        submitHandler : function() {
            this.pushForm({
                windowTitle : i18n.gettext('Incomes Import'),
                submitAttributes : {
                    url : criterion.consts.Api.API.INCOMES_IMPORT,
                    data : {
                        incomesFile : this.templateFile
                    }
                },
                errorsFileAttributes : {
                    url : criterion.consts.Api.API.INCOMES_IMPORT_ERRORS
                },
                processAttributes : {
                    url : criterion.consts.Api.API.INCOMES_IMPORT_UPDATE
                }
            });
        }
    }
});
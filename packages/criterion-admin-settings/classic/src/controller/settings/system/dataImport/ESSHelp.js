Ext.define('criterion.controller.settings.system.dataImport.ESSHelp', function() {

    return {

        extend : 'criterion.controller.settings.system.dataImport.Base',

        alias : 'controller.criterion_settings_data_import_ess_help',

        submitHandler : function() {
            this.pushForm({
                windowTitle : i18n.gettext('ESS Help Import'),
                submitAttributes : {
                    url : criterion.consts.Api.API.ESS_HELP_IMPORT,
                    data : {
                        essHelpFile : this.templateFile
                    }
                },
                errorsFileAttributes : {
                    url : criterion.consts.Api.API.ESS_HELP_IMPORT_ERRORS
                },
                processAttributes : {
                    url : criterion.consts.Api.API.ESS_HELP_IMPORT_UPDATE
                }
            });
        }
    }
});
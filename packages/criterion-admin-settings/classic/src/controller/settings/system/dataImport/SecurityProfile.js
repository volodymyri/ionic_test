Ext.define('criterion.controller.settings.system.dataImport.SecurityProfile', function() {

    return {

        extend : 'criterion.controller.settings.system.dataImport.Base',

        alias : 'controller.criterion_settings_data_import_security_profile',

        submitHandler : function() {
            this.pushForm({
                windowTitle : i18n.gettext('Security Profile Import'),
                submitAttributes : {
                    url : criterion.consts.Api.API.SECURITY_PROFILE_IMPORT,
                    data : {
                        securityProfileFile : this.templateFile
                    }
                },
                errorsFileAttributes : {
                    url : criterion.consts.Api.API.SECURITY_PROFILE_IMPORT_ERRORS
                },
                processAttributes : {
                    url : criterion.consts.Api.API.SECURITY_PROFILE_IMPORT_UPDATE
                }
            });
        }
    }
});
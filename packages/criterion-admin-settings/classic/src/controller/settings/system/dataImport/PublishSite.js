Ext.define('criterion.controller.settings.system.dataImport.PublishSite', function() {

    return {

        extend : 'criterion.controller.settings.system.dataImport.Base',

        alias : 'controller.criterion_settings_data_import_publish_site',

        submitHandler : function() {
            this.pushForm({
                windowTitle : i18n.gettext('Publish Site Import'),
                submitAttributes : {
                    url : criterion.consts.Api.API.PUBLISH_SITE_IMPORT,
                    data : {
                        publishSiteFile : this.templateFile
                    }
                },
                errorsFileAttributes : {
                    url : criterion.consts.Api.API.PUBLISH_SITE_IMPORT_ERRORS
                },
                processAttributes : {
                    url : criterion.consts.Api.API.PUBLISH_SITE_IMPORT_UPDATE
                }
            });
        }
    }
});
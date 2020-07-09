Ext.define('criterion.controller.settings.system.dataImport.Employment', function() {

    return {

        extend : 'criterion.controller.settings.system.dataImport.Base',

        alias : 'controller.criterion_settings_data_import_employment',

        submitHandler : function() {
            this.pushForm({
                windowTitle : i18n.gettext('Employment Information Import'),
                submitAttributes : {
                    url : criterion.consts.Api.API.EMPLOYMENT_IMPORT,
                    data : {
                        employmentFile : this.templateFile,
                        employerId : this.getSelectedEmployerId()
                    }
                },
                errorsFileAttributes : {
                    url : criterion.consts.Api.API.EMPLOYMENT_IMPORT_ERRORS
                },
                processAttributes : {
                    url : criterion.consts.Api.API.EMPLOYMENT_IMPORT_UPDATE,
                    orderedParams : [this.getSelectedEmployerId()]
                }
            });
        }
    }
});

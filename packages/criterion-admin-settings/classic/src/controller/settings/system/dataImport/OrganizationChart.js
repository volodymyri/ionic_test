Ext.define('criterion.controller.settings.system.dataImport.OrganizationChart', function() {

    const API = criterion.consts.Api.API;

    return {

        extend : 'criterion.controller.settings.system.dataImport.Base',

        alias : 'controller.criterion_settings_data_import_organization_chart',

        submitHandler() {
            this.pushForm({
                windowTitle : i18n.gettext('Organization Chart Import'),
                submitAttributes : {
                    url : API.ORGANIZATION_CHART_IMPORT,
                    data : {
                        employmentFile : this.templateFile,
                        employerId : this.getSelectedEmployerId()
                    }
                },
                errorsFileAttributes : {
                    url : API.ORGANIZATION_CHART_IMPORT_ERRORS
                },
                processAttributes : {
                    url : API.ORGANIZATION_CHART_IMPORT_UPDATE,
                    orderedParams : [this.getSelectedEmployerId()]
                }
            });
        }
    }
});

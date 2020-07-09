Ext.define('criterion.controller.settings.system.dataImport.CodeTables', function() {

    return {

        extend : 'criterion.controller.settings.system.dataImport.Base',

        alias : 'controller.criterion_settings_data_import_code_tables',

        submitHandler : function() {
            this.pushForm({
                windowTitle : i18n.gettext('Code Tables Import'),
                submitAttributes : {
                    url : criterion.consts.Api.API.CODE_TABLES_IMPORT,
                    data : {
                        codeTablesFile : this.templateFile
                    }
                },
                errorsFileAttributes : {
                    url : criterion.consts.Api.API.CODE_TABLES_IMPORT_ERRORS
                },
                processAttributes : {
                    url : criterion.consts.Api.API.CODE_TABLES_IMPORT_UPDATE
                }
            });
        }
    }
});
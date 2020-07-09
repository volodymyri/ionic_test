Ext.define('criterion.controller.settings.system.dataImport.DataPackage', function() {

    return {

        extend : 'criterion.controller.settings.system.dataImport.Base',

        alias : 'controller.criterion_settings_data_import_data_package',

        submitHandler : function() {
            var form = this.getView().up('form');

            criterion.Api.requestWithPromise({
                method : 'POST',
                url : criterion.consts.Api.API.DATA_PACKAGE_IMPORT,
                jsonData : this.getViewModel().getData()
            }).then(function() {
                form.setLoading(false);
                criterion.Utils.toast(i18n.gettext('Successfully imported.'));
            }).otherwise(function() {
                form.setLoading(false);
                criterion.Utils.toast(i18n.gettext('Something went wrong.'));
            });
        }
    }
});
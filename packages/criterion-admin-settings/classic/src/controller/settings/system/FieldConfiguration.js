Ext.define('criterion.controller.settings.system.FieldConfiguration', function() {

    return {
        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_settings_field_configuration',

        handleTableChange : function(cmp, tableId) {
            var vm = this.getViewModel(),
                tableRecord = cmp.getStore().getById(tableId),
                metaFields = vm.getStore('metaFields');

            vm.set('tableRecord', tableRecord);
            metaFields.loadWithPromise({
                params : {
                    tableId : tableId
                }
            });
        },

        handleSave : function() {
            var view = this.getView(),
                vm = this.getViewModel();

            view.setLoading(true);

            Ext.promise.Promise.all([
                vm.get('tableRecord').saveWithPromise(),
                vm.getStore('metaFields').syncWithPromise()
            ]).then(function() {
                criterion.Utils.toast(i18n.gettext('Changes Saved.'));
            }).always(function() {
                view.setLoading(false);
            });
        },

        handleCancel : function() {
            var vm = this.getViewModel();

            vm.get('tableRecord').reject();
            vm.getStore('metaFields').rejectChanges();
        }

    };
});

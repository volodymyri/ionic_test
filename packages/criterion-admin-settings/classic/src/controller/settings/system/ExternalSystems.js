Ext.define('criterion.controller.settings.system.ExternalSystems', function() {

    var API = criterion.consts.Api.API,
        file;

    return {
        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_settings_external_systems',

        requires : [
            'criterion.model.ExternalSystem'
        ],

        handleShow : function() {
            var view = this.getView(),
                vm = this.getViewModel();

            view.setLoading(true);

            vm.getStore('externalSystems').loadWithPromise().then(function() {
                view.setLoading(false);
            });
        },

        handleSelectFile : function(event) {
            file = event.target && event.target.files && event.target.files.length && event.target.files[0];
        },

        handleSave : function() {
            var me = this,
                vm = me.getViewModel(),
                view = me.getView(),
                form = view.getForm(),
                externalSystem = vm.get('externalSystem'),
                externalSystemRecord = vm.get('externalSystemRecord'),
                dirtyFieldsValues,
                dirtyFields = [];

            if (form.isValid()) {
                dirtyFieldsValues = Object.keys(form.getFieldValues(true));
                Ext.Array.each(form.getFields().items, function(field) {
                    if (Ext.Array.contains(dirtyFieldsValues, field.name)) {
                        dirtyFields.push(field);
                    }
                });

                if (dirtyFields.length || file) {
                    view.setLoading(true);
                    criterion.Api.submitFakeForm(dirtyFields, {
                        url : API.EXTERNAL_SYSTEM + (externalSystemRecord.phantom ? '' : '/' + externalSystemRecord.getId()),
                        method : externalSystemRecord.phantom ? 'POST' : 'PUT',
                        extraData : file ? {
                            externalSystemNameCd : externalSystem.getId(),
                            sshKey : file
                        } : {externalSystemNameCd : externalSystem.getId()},
                        scope : this,
                        success : function() {
                            criterion.Utils.toast(i18n.gettext('Changes Saved.'));
                            me.resetSecrets();
                            view.setLoading(false);
                        },
                        failure : function() {
                            criterion.Utils.toast(i18n.gettext('Changes Not Saved.'));
                            externalSystemRecord.reject();
                            me.resetSecrets();
                            view.setLoading(false);
                        }
                    });
                }
            }
        },

        resetSecrets : function() {
            var me = this,
                sshKeyField = me.lookup('sshKey');

            // to prevent harm of the file event listeners
            sshKeyField.inputEl.dom.value = '';
            sshKeyField.fireEvent('onselectfile', false);
        },

        handleCancel : function() {
            var me = this,
                vm = this.getViewModel(),
                externalSystemRecord = vm.get('externalSystemRecord');

            externalSystemRecord.reject();
            me.resetSecrets();
        },

        handleExternalSystemChange : function(cmp, externalId) {
            var me = this,
                vm = me.getViewModel(),
                externalSystem = cmp.getStore().getById(externalId),
                externalSystems = vm.getStore('externalSystems');

            var externalSystemRecord = externalSystems.findRecord('externalSystemNameCd', externalId, 0, false, false, true);

            vm.set('externalSystem', externalSystem);

            if (externalSystemRecord) {
                vm.set('externalSystemRecord', externalSystemRecord);
            } else {
                vm.set('externalSystemRecord', Ext.create('criterion.model.ExternalSystem', {externalSystemNameCd : externalId}));
            }

            me.resetSecrets();
        },

        onSyncEmployees : function() {
            var me = this,
                view = me.getView();

            view.setLoading(true);

            criterion.Api.requestWithPromise({
                url : criterion.consts.Api.API.EXTERNAL_SYSTEM_ACUMATICA_SYNC_EMPLOYEES,
                method : 'GET'
            }).then(function() {
                criterion.Utils.toast(i18n.gettext('Synchronization is started. Please check in few minutes.'));
            }).otherwise(function() {
                criterion.Utils.toast(i18n.gettext('Something went wrong'));
            }).always(function() {
                view.setLoading(false);
            });
        },

        onSyncCriterionData : function() {
            var me = this,
                view = me.getView();

            view.setLoading(true);

            criterion.Api.requestWithPromise({
                url : criterion.consts.Api.API.EXTERNAL_SYSTEM_ACUMATICA_SYNC_CRITERION_DATA,
                method : 'GET'
            }).then(function() {
                criterion.Utils.toast(i18n.gettext('Synchronization is started. Please check in few minutes.'));
            }).otherwise(function() {
                criterion.Utils.toast(i18n.gettext('Something went wrong'));
            }).always(function() {
                view.setLoading(false);
            });
        }
    };
});

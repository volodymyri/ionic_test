Ext.define('criterion.controller.settings.system.App', function() {

    return {

        extend : 'criterion.controller.FormView',

        requires : [
            'criterion.view.settings.system.app.Logs'
        ],

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex'
        ],

        alias : 'controller.criterion_settings_system_app',

        handleAfterRecordLoad : function(record) {
            var columnOne = this.lookup('columnOne'),
                columnTwo = this.lookup('columnTwo'),
                customSettings = record.getAppSettings().customSettings();

            this.getViewModel().set('externalSettingsExist', !!customSettings.count());

            customSettings.each(function(customSetting, idx) {
                var field = {
                    fieldLabel : customSetting.get('label'),
                    allowBlank : !customSetting.get('mandatory'),
                    value : customSetting.get('value'),
                    name : customSetting.get('name'),
                    listeners : {
                        change : function(cmp, value) {
                            customSetting.set('value', value);
                            record.dirty = true;
                        }
                    }
                };

                switch (customSetting.get('type').toUpperCase()) {
                    case criterion.Consts.DATA_TYPE.TEXT:
                    case criterion.Consts.DATA_TYPE.STRING:
                        field['xtype'] = 'textfield';
                        break;
                    case criterion.Consts.DATA_TYPE.NUMBER:
                        field['xtype'] = 'numberfield';
                        field['decimalPrecision'] = Ext.util.Format.amountPrecision;
                        break;
                    case criterion.Consts.DATA_TYPE.INTEGER:
                        if (customSetting.get('name') === 'employerId') {
                            field['xtype'] = 'criterion_employer_combo';
                        } else {
                            field['xtype'] = 'numberfield';
                            field['decimalPrecision'] = 0;
                        }
                        break;
                    case criterion.Consts.DATA_TYPE.DATE:
                        field['xtype'] = 'datefield';

                        //TODO Override altFormats
                        field['altFormats'] = Ext.String.format('{0}|{1}',
                            'm/d/Y|n/j/Y|n/j/y|m/j/y|n/d/y|m/j/Y|n/d/Y|m-d-y|m-d-Y|m/d|m-d|md|mdy|mdY|d|Y-m-d|n-j|n/j',
                            criterion.consts.Api.DATE_FORMAT
                        );
                        break;
                    case criterion.Consts.DATA_TYPE.CHECKBOX:
                        break;
                    case criterion.Consts.DATA_TYPE.MEMO:
                        field['xtype'] = 'textarea';
                        break;
                }

                if (idx % 2 === 1) {
                    columnOne.add(field);
                } else {
                    columnTwo.add(field);
                }
            });
        },

        handleRecordUpdate : function(record) {
            var me = this,
                view = this.getView(),
                appSettings = record.getAppSettings();

            if (record.dirty || appSettings.dirty || appSettings.customSettings().needSync()) {
                criterion.Api.requestWithPromise({
                    url : criterion.consts.Api.API.APP,
                    jsonData : record.getData({associated : true, serialize : true}),
                    method : 'PUT'
                }).then({
                    success : function() {
                        me.onAfterSave.call(me, view, record);
                    },
                    failure : function(record, operation) {
                        me.onFailureSave(record, operation);
                    }
                }).always(function() {
                    view.setLoading(false);
                });
            } else {
                me.onAfterSave.call(me, view, record);
            }
        },

        handleDeleteClick : function() {
            var me = this,
                form = me.getView(),
                recordId = this.getRecord().getId(),
                dfd = Ext.create('Ext.promise.Deferred');

            criterion.Msg.confirmDelete({
                    title : i18n.gettext('Uninstall'),
                    message : form.getDeleteConfirmMessage()
                },
                function(btn) {
                    if (btn === 'yes') {
                        dfd.resolve();
                    } else {
                        dfd.reject();
                    }
                }
            );

            dfd.promise.then(function() {
                form.setLoading(true);

                criterion.Api.requestWithPromise({
                    url : criterion.consts.Api.API.APP_UNINSTALL,
                    jsonData : {
                        id : recordId
                    },
                    method : 'PUT'
                }).then(function() {
                    form.fireEvent('afterDelete');
                    form.close();
                }).otherwise(function() {
                    form.setLoading(false);
                });
            });
        },

        handleSyncChart : function() {
            let view = this.getView();

            view.setLoading(true);

            criterion.Api.requestWithPromise({
                url : criterion.consts.Api.API.EXTERNAL_SYSTEM_INTACCT_SYNC_CRITERION_DATA,
                method : 'GET'
            }).then(function() {
                criterion.Utils.toast(i18n.gettext('Synchronization is started. Please check in few minutes.'));
            }).otherwise(function() {
                criterion.Utils.toast(i18n.gettext('Something went wrong'));
            }).always(function() {
                view.setLoading(false);
            });
        },

        handleSyncEmployees : function() {
            let view = this.getView();

            view.setLoading(true);

            criterion.Api.requestWithPromise({
                url : criterion.consts.Api.API.EXTERNAL_SYSTEM_INTACCT_SYNC_EMPLOYEES,
                method : 'GET'
            }).then(function() {
                criterion.Utils.toast(i18n.gettext('Synchronization is started. Please check in few minutes.'));
            }).otherwise(function() {
                criterion.Utils.toast(i18n.gettext('Something went wrong'));
            }).always(function() {
                view.setLoading(false);
            });
        },

        handleCustomButton : function(cmp, value) {
            let view = this.getView();

            value && criterion.Msg.confirm(
                i18n.gettext('Execute App Trigger'),
                Ext.String.format(i18n.gettext('Do you want to execute "{0}"?'), cmp.getSelection().get('buttonName')),
                function(btn) {
                    if (btn === 'yes') {
                        view.setLoading();
                        criterion.Api.requestWithPromise({
                            url : Ext.String.format(criterion.consts.Api.API.APP_INVOKE, value),
                            method : 'GET'
                        }).then(result => {
                            criterion.Utils.toast(i18n.gettext('Successfully.'));
                            cmp.reset();
                            view.setLoading(false);
                        }).otherwise(() => {
                            cmp.reset();
                            view.setLoading(false);
                        });
                    } else {
                        cmp.reset();
                    }
                }
            );
        },

        handleLogsView : function() {
            let me = this,
                record = me.getRecord();

            Ext.create('criterion.view.settings.system.app.Logs', {
                title : Ext.String.format(i18n.gettext('{0}: Log'), record.get('name')),

                plugins : [
                    {
                        ptype : 'criterion_sidebar',
                        height : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_HEIGHT,
                        width : '90%',
                        modal : true
                    }
                ],

                viewModel : {
                    data : {
                        appId : record.getId()
                    }
                },

                listeners : {
                    close : () => me.setCorrectMaskZIndex(false)
                }
            }).show();

            me.setCorrectMaskZIndex(true);
        }
    }
});

Ext.define('criterion.controller.settings.system.GeneralLedger', function() {

    var TRANSFER_TYPE = criterion.Consts.TRANSFER_TYPE,
        DICT = criterion.consts.Dict;

    return {

        extend : 'criterion.controller.FormView',

        alias : 'controller.criterion_settings_general_ledger',

        requires : [
            'criterion.model.employer.GLSetup'
        ],

        employerId : null,

        handleActivate : function() {
            var me = this,
                view = this.getView(),
                vm = this.getViewModel(),
                transfers = vm.getStore('transfers');

            view.setLoading(true);

            Ext.promise.Promise.all([
                vm.getStore('gLSetup').loadWithPromise(),
                criterion.CodeDataManager.getCodeDetailRecordStrict('code', TRANSFER_TYPE.GL, DICT.TRANSFER_TYPE),
                vm.getStore('glExportApps').loadWithPromise()
            ]).then(function(response) {
                if (!response || response.length < 2) {
                    return
                }

                me._setGLSetupRecord();

                var dataTransferTypeRecord = response[1];

                transfers.getProxy().setExtraParam('transferTypeCds', dataTransferTypeRecord.getId());

                transfers.loadWithPromise().always(function() {
                    view.setLoading(false);
                });
            }).otherwise(function() {
                view.setLoading(false);
            });
        },

        _setGLSetupRecord : function() {
            var vm = this.getViewModel(),
                glsStore = vm.getStore('gLSetup'),
                recIndx;

            vm.set('gLSetupRecord', null);

            if (!this.employerId) {
                return;
            }

            recIndx = glsStore.findExact('employerId', this.employerId);

            if (recIndx !== -1) {
                vm.set('gLSetupRecord', glsStore.getAt(recIndx));
            } else {
                vm.set('gLSetupRecord', glsStore.add(
                    Ext.create('criterion.model.employer.GLSetup', {
                        employerId : this.employerId
                    })
                )[0]);
            }
        },

        handleSubmitClick : function() {
            var me = this;

            if (!this.getView().getForm().isValid()) {
                this.focusInvalidField();
                return;
            }

            this.getViewModel().getStore('gLSetup').syncWithPromise().then(function() {
                criterion.Utils.toast(i18n.gettext('GL setup saved.'));
                me._setGLSetupRecord();
            });
        },

        handleDeleteClick : function() {
            var vm = this.getViewModel(),
                me = this,
                glsStore = vm.getStore('gLSetup');

            criterion.Msg.confirmDelete({
                    title : i18n.gettext('Remove GL setup'),
                    message : i18n.gettext('Do you want to remove?')
                },
                function(btn) {
                    if (btn == 'yes') {
                        glsStore.remove(vm.get('gLSetupRecord'));
                        glsStore.syncWithPromise().then(function() {
                            criterion.Utils.toast(i18n.gettext('GL setup successfully removed.'));
                            me._setGLSetupRecord();
                        });
                    }
                }
            );
        },

        handleCancelClick : function() {
            var vm = this.getViewModel(),
                glsStore = vm.getStore('gLSetup'),
                gLSetupRecord = vm.get('gLSetupRecord');

            if (gLSetupRecord.phantom) {
                glsStore.remove(gLSetupRecord);
            } else {
                gLSetupRecord.reject();
            }

            this._setGLSetupRecord();
        },

        onBeforeEmployerChange : function(employer) {
            this.employerId = employer ? employer.getId() : null;
        },

        onEmployerChange : function() {
            this._setGLSetupRecord();
        },

        init : function() {
            this.handleActivate = Ext.Function.createBuffered(this.handleActivate, 100, this);

            this.callParent(arguments);
        }
    };
});

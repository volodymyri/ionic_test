Ext.define('criterion.controller.settings.recruiting.Settings', function() {

    return {

        extend : 'criterion.controller.FormView',

        alias : 'controller.criterion_settings_recruiting_settings',

        employerId : null,

        handleActivate : function() {
            let view = this.getView(),
                me = this,
                vm = this.getViewModel();

            view.setLoading(true, null);

            Ext.promise.Promise.all([
                vm.getStore('verificationApps').loadWithPromise(),
                vm.getStore('questionSets').loadWithPromise(),
                vm.getStore('webforms').loadWithPromise(),
                vm.getStore('settings').loadWithPromise()
            ]).then(function() {
                view.setLoading(false, null);
                me.setSettingRecord();
            });
        },

        setSettingRecord : function() {
            let me = this,
                vm = this.getViewModel(),
                settingsStore = vm.getStore('settings'),
                recIndx,
                rec;

            if (!this.employerId) {
                return;
            }

            recIndx = settingsStore.findExact('employerId', me.employerId);

            if (recIndx !== -1) {
                vm.set('settingRecord', settingsStore.getAt(recIndx));
            } else {
                rec = settingsStore.add({
                    employerId : me.employerId,
                    questionSetId : null,
                    employmentApplicationWebformId : null
                })[0];
                vm.set('settingRecord', rec);
            }

            Ext.defer(() => {
                me.lookup('questionSet').setDisabled(false);
                vm.set('disableQuestionSetFiltering', false);
            }, 200);

        },

        handleUpdate : function() {
            if (!this.getView().getForm().isValid()) {
                this.focusInvalidField();
                return;
            }

            this.getViewModel().getStore('settings').syncWithPromise().then(() => {
                criterion.Utils.toast(i18n.gettext('Settings saved.'));
            });
        },

        onBeforeEmployerChange : function(employer) {
            let vm = this.getViewModel();

            this.lookup('questionSet').setDisabled(true);
            vm.set('disableQuestionSetFiltering', true);

            this.employerId = employer ? employer.getId() : null;
            
            vm.set('employerId', this.employerId);
        },

        onEmployerChange : function() {
            Ext.defer(this.setSettingRecord, 100, this);
        },

        init : function() {
            this.handleActivate = Ext.Function.createBuffered(this.handleActivate, 100, this);

            this.callParent(arguments);
        }
    };
});

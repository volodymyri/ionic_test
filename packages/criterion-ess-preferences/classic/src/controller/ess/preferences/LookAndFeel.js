Ext.define('criterion.controller.ess.preferences.LookAndFeel', function() {

    return {
        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_ess_preferences_look_and_feel',

        requires : [
            'criterion.model.person.Settings'
        ],

        onActivateByRoute : function() {
            let view = this.getView(),
                vm = this.getViewModel();

            view.setLoading(true);

            criterion.Api.requestWithPromise({
                    url : criterion.consts.Api.API.PERSON_PREFERENCES,
                    method : 'GET'
                }
            ).then({
                success : function(result) {
                    var settings = Ext.create('criterion.model.person.Settings', result);

                    vm.set('record', settings);
                }
            }).always(function() {
                view.setLoading(false);
            });
        },

        onSave : function() {
            let vm = this.getViewModel(),
                view = this.getView(),
                record = vm.get('record'),
                changes = record.getChanges();

            view.setLoading(true);

            criterion.Api.requestWithPromise({
                    url : criterion.consts.Api.API.PERSON_PREFERENCES,
                    jsonData : Ext.apply(changes, {
                        emailOnPosting : this.lookup('emailOnPosting').getValue(),
                        emailOnReference : this.lookup('emailOnReference').getValue()
                    }),
                    method : 'PUT'
                }
            ).then(function() {
                var local = criterion.CodeDataManager.getCodeDetailRecord('id', record.get('localizationLanguageCd'), criterion.consts.Dict.LOCALIZATION_LANGUAGE).get('code');

                criterion.Utils.toast(i18n.gettext('Saved.'));

                record.dirty = false;

                if (changes.localizationLanguageCd) {
                    criterion.LocalizationManager.setLocale(local.toLowerCase());
                }
            }).always(function() {
                view.setLoading(false);
            })
        }
    };
});

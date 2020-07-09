Ext.define('criterion.controller.codeTable.DetailForm', function() {

    return {
        alias : 'controller.criterion_codetable_detail_form',

        extend : 'criterion.controller.FormView',

        requires : [
            'criterion.store.codeTable.detail.Locals'
        ],

        handleRecordUpdate : function(record) {
            var vm = this.getViewModel(),
                view = this.getView();

            this.EN_VALUE = criterion.CodeDataManager.getCodeDetailRecord('code', criterion.Consts.LOCALIZATION_LANGUAGE_EN, criterion.consts.Dict.LOCALIZATION_LANGUAGE).getId();

            record.set('description', vm.get('locals.' + this.EN_VALUE));

            view.setLoading(true);
            this.callParent(arguments);
        },

        onAfterSave : function(view, record) {
            var superFn = this.superclass.onAfterSave,
                me = this,
                view = this.getView(),
                vm = this.getViewModel(),
                store = new criterion.store.codeTable.detail.Locals(),
                codeTableDetailId = record.getId(),
                localizations = record.get('localizations'),
                localizationsObj = {},
                locals = vm.get('locals'),
                EN_VALUE = this.EN_VALUE;

            Ext.each(localizations, function(loc) {
                localizationsObj[loc.localizationLanguageCd] = loc;

                store.add(loc);
            });

            Ext.Object.each(locals, function(key, val) {
                var lObj = localizationsObj[key],
                    key = parseInt(key, 10);

                if (key === EN_VALUE) {
                    return true;
                }

                if (lObj) {
                    store.findRecord('localizationLanguageCd', key, 0, false, false, true).set('description', val);
                } else {
                    store.add({
                        codeTableDetailId : codeTableDetailId,
                        localizationLanguageCd : key,
                        description : val
                    });
                }
            });

            store.syncWithPromise().then(function() {
                view.setLoading(false);
                superFn.call(me, view, record);
            });
        }
    };

});

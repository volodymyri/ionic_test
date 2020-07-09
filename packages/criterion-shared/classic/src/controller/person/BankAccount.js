Ext.define('criterion.controller.person.BankAccount', function() {

    return {
        alias : 'controller.criterion_person_bank_account',

        extend : 'criterion.controller.FormView',

        getPersonId() {
            return this.getViewModel().get('person.id');
        },

        handleAfterRecordLoad : function(record) {
            let vm = this.getViewModel(),
                view = this.getView(),
                percentValueField = this.lookupReference('percentValueField');

            if (view.trackResetOnLoad) {
                percentValueField.resetOriginalValue();
            }

            view.setLoading(true);

            criterion.Api.requestWithPromise({
                url : criterion.consts.Api.API.PERSON_BANK_ACCOUNT_IS_USE_PRESETS,
                params : {
                    personId : this.getPersonId()
                },
                method : 'GET'
            }).then(function(res) {
                view.setLoading(false);

                if (vm && !view.destroyed) {
                    vm.set('isUsePresets', res['isUsePresets']);
                }
            });

        },

        bankNumberFieldRender : function(cmp) {}
    };

});

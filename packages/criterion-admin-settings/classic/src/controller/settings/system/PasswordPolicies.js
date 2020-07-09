Ext.define('criterion.controller.settings.system.PasswordPolicies', function() {

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_settings_password_policies',

        handleActivate : function() {
            var vm = this.getViewModel(),
                passwordPolicies = vm.getStore('passwordPolicies'),
                view = this.getView();

            view.setLoading(true);

            passwordPolicies.loadWithPromise().then(function(recs) {
                vm.set('policy', recs[0]);
            }).always(function() {
                view.setLoading(false);
            });
        },

        handleSubmitClick : function() {
            var vm = this.getViewModel(),
                record = vm.get('policy'),
                view = this.getView();

            if (view.isValid()) {
                view.setLoading(true);
                record.saveWithPromise().always(function() {
                    view.setLoading(false);
                });
            } else {
                view.focusOnInvalidField();
            }
        },

        handleCancelClick : function() {
            var vm = this.getViewModel(),
                record = vm.get('policy');

            record.reject();
        },

        init : function() {
            this.handleActivate = Ext.Function.createBuffered(this.handleActivate, 100, this);

            this.callParent(arguments);
        }
    };
});

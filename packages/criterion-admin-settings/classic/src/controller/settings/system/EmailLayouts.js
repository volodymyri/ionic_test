Ext.define('criterion.controller.settings.system.EmailLayouts', function() {

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_settings_system_email_layouts',

        handleActivate : function() {
            var vm = this.getViewModel(),
                emailLayouts = vm.getStore('emailLayouts'),
                eventType = this.lookupReference('eventType'),
                view = this.getView();

            view.setLoading(true);
            emailLayouts.loadWithPromise().then(function() {
                eventType.setSelection(emailLayouts.getAt(0));
            }).always(function() {
                view.setLoading(false);
            });
        },

        handleSubmit : function() {
            var vm = this.getViewModel(),
                record = vm.get('eventType.selection'),
                eventForm = this.lookupReference('eventForm'),
                view = this.getView();

            if (eventForm.isValid()) {
                view.setLoading(true);
                record.saveWithPromise().always(function() {
                    view.setLoading(false);
                });
            }
        },

        handleCancel : function() {
            var vm = this.getViewModel(),
                record = vm.get('eventType.selection');

            record.reject();
        },

        handleRevert : function() {
            var vm = this.getViewModel(),
                record = vm.get('eventType.selection');

            record.set('body', record.get('default'));
        },

        init : function() {
            this.handleActivate = Ext.Function.createBuffered(this.handleActivate, 100, this);

            this.callParent(arguments);
        }
    };
});

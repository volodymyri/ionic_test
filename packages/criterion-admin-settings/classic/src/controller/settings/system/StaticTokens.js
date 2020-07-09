Ext.define('criterion.controller.settings.system.StaticTokens', function() {

    return {
        alias : 'controller.criterion_settings_static_tokens',

        extend : 'criterion.controller.GridView',

        requires : [
            'criterion.view.RecordPicker',
            'criterion.store.security.Profiles'
        ],

        remove : function() {
            var store = this.getView().getStore();

            this.callParent(arguments);

            store.syncWithPromise().then(function() {
                store.load();
            });
        }
    };
});

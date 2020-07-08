Ext.define('ess.controller.Main', function() {

    return {

        extend : 'criterion.controller.ess.Main',

        alias : 'controller.criterion_ess_main',

        requires : [
            'Ext.state.CookieProvider',
            'Ext.state.LocalStorageProvider'
        ],

        init : function() {
            this.callParent(arguments);

            Ext.state.Manager.setProvider(Ext.create(
                Ext.util.LocalStorage.supported ? 'Ext.state.LocalStorageProvider' : 'Ext.state.CookieProvider'
            ));
        },

        handleResize() {
            Ext.GlobalEvents.fireEvent('resizeMainView');
        }
    };
});

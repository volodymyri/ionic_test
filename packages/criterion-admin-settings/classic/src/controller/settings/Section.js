Ext.define('criterion.controller.settings.Section', function() {

    return {
        extend : 'criterion.app.ViewController',

        mixins : [
            'criterion.controller.mixin.CardRouter'
        ],

        alias : 'controller.criterion_settings_section',

        init : function () {
            var me = this;

            // Set base routes for all GridView controllers. Because routes in settings are not static, it need
            // to be done dynamically.
            Ext.Array.each(this.getView().items.items, function(item) {
                item.getController() && !!item.getController().setBaseRoute && item.getController().setBaseRoute(this.getCardToken(item.reference));
            }, this);

            me.callParent(arguments);
        },

        handleBeforeCardRoute : function(card) {
            var me = this;

            me.mixins.cardrouter.handleBeforeCardRoute.apply(this, arguments);
        },

        handleCardRoute : function(card, subcard) {
            var me = this;

            me.mixins.cardrouter.handleCardRoute.apply(this, arguments);
        }
    };
});


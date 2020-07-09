Ext.define('web.controller.Main', function() {

    return {
        extend : 'criterion.controller.Module',

        alias : 'controller.criterion_main',

        showNoCardsMessage : function() {
            criterion.Api.showAccessDeniedMessage();
        },

        handleResize : function() {
            Ext.GlobalEvents.fireEvent('resizeMainView');
        },

        handleBeforeCardRoute : function(card, itemId) {
            var me = this,
                action = arguments[arguments.length - 1],
                view = this.getView(),
                cardCt = me.getCard(card),
                module = Ext.Array.findBy(view._items, function(item) {
                    return item.reference === card
                });

            if (module && module.pkg) {
                if (Ext.Package.isLoaded(module.pkg)) {
                    me.handlePackage(card, itemId, cardCt, action, view, module);
                } else {
                    view.setLoading(true);
                    Ext.Package.load(module.pkg).then(me.handlePackage.bind(me, card, itemId, cardCt, action, view, module));
                }
            } else {
                me.handlePackage(card, itemId, cardCt, action, view);
            }
        },

        handlePackage : function(card, itemId, cardCt, action, view, module) {
            var me = this,
                employee = this.activeEmployee || criterion.Application.getEmployee();

            view.setLoading(false);

            if (module && !view.lookup(module.reference)) {
                view.add(module);
            }

            me.mixins.cardrouter.handleBeforeCardRoute.apply(this, [card, action]);

            if (employee) {
                Ext.GlobalEvents.fireEvent('employeeChanged', this.activeEmployee || criterion.Application.getEmployee());
            }

        }
    };

});

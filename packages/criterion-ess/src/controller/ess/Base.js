Ext.define('criterion.controller.ess.Base', function() {

    return {
        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_selfservice_base',

        listen : {
            global : {
                employeeChanged : 'handleEmployeeChanged'
            }
        },

        baseURL : criterion.consts.Route.SELF_SERVICE.MAIN,

        getEmployerId : function() {
            return this.getViewModel().get('employerId');
        },

        getEmployeeId : function() {
            return this.getViewModel().get('employeeId');
        },

        onTabChange : function(panel, tab) {
            Ext.History.add(this.baseURL + '/' + tab.itemId);
        },

        onChildTabChange : function(panel, tab) {
            Ext.History.add(this.baseURL + '/' + tab.itemId);
        },

        isCardPresentInLayout : function(cardId) {
            var cards = this.getView().getLayout().getLayoutItems(),
                cardIds;

            cardIds = Ext.Array.map(cards, function(card) {
                return card.itemId;
            });

            return Ext.Array.indexOf(cardIds, cardId) !== -1;
        },

        hasSecurityAccess : function(cardId) {
            var cards = this.getView().getLayout().getLayoutItems(),
                cardSecurityIds = {};

            Ext.Array.each(cards, function(card) {
                cardSecurityIds[card.itemId] = card.securityAccess ? card.securityAccess() : true;
            });

            return !!cardSecurityIds[cardId];
        },

        handleRoute : function(pageId) {
            var view = this.getView();

            for (var i = 0; i < view.items.items.length; i++) {
                var item = view.items.items[i];

                if (Ext.isNumber(pageId)) {
                    if (item.items.length > pageId) {
                        item.setActiveItem(item.items.items[pageId]);
                        view.setActiveItem(item);
                        return;
                    }
                } else {
                    for (var j = 0; j < item.items.items.length; j++) {
                        var subItem = item.items.items[j];

                        if (subItem.itemId === pageId) {

                            if (subItem.securityAccess && !subItem.securityAccess()) {
                                this.redirectTo(criterion.consts.Route.SELF_SERVICE.DASHBOARD);
                                return;
                            }

                            item.setActiveItem(subItem);
                            view.setActiveItem(item);
                            return;
                        }
                    }
                }
            }
        },

        getRoutes : function() {
            var routes = {};

            routes[this.baseURL] = 'handleRoute';
            routes[this.baseURL + '/:tab'] = 'handleRoute';

            return routes;
        },

        handleEmployeeChanged : function() {
            var me = this,
                view = this.getView(),
                active,
                layout;

            if (!this.checkViewIsActive()) {
                return;
            }

            Ext.defer(function() {
                layout = view.getLayout();
                active = layout.getActiveItem && layout.getActiveItem();
                if (active && !!active.securityAccess && !active.securityAccess()) {
                    me.blockSection();
                }

                view.fireEvent('viewEmployeeChange');
            });
        },

        blockSection : function() {
            this.redirectTo(criterion.consts.Route.SELF_SERVICE.DASHBOARD);
        },

        init : function() {
            this.setRoutes(this.getRoutes());

            this.callParent(arguments);
        }
    };
});

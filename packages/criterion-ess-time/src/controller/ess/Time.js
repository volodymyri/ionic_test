Ext.define('criterion.controller.ess.Time', function() {

    return {
        extend : 'criterion.controller.ess.Base',

        alias : 'controller.criterion_selfservice_time',

        mixins : [
            'criterion.controller.mixin.ReRouting'
        ],

        baseURL : criterion.consts.Route.SELF_SERVICE.TIME,

        init : function() {
            this.setReRouting();
            this.callParent(arguments);
        },

        handleRoute : function(pageId, entityId) {
            var me = this,
                page,
                view = this.getView();

            if (Ext.isString(pageId)) {
                if (this.isCardPresentInLayout(pageId) && this.hasSecurityAccess(pageId)) {
                    page = pageId;
                } else {
                    this.redirectTo(criterion.consts.Route.SELF_SERVICE.DASHBOARD);
                    return;
                }
            } else {
                page = pageId;
            }

            if (!view.__reRoute) {
                if (entityId) {
                    Ext.History.add(me.baseURL + '/' + pageId, true);
                    Ext.defer(function() {
                        view.__reRoute = true;
                        Ext.History.add(me.baseURL + '/' + pageId + '/' + entityId, true);
                    }, 10);
                }
            }

            view.getLayout().setActiveItem(page || 0);
        },

        handleActivate : function() {
            var active = this.getView().getLayout().getActiveItem();

            if (active && Ext.String.endsWith(Ext.History.getToken(), active.getItemId())) {
                active.fireEvent('activate', active);
            }
        },

        getRoutes : function() {
            var routes = this.callParent(arguments);

            routes[this.baseURL + '/:tab/:id'] = 'handleRoute';

            return routes;
        }
    };
});

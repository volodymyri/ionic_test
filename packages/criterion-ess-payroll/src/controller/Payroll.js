Ext.define('criterion.controller.ess.Payroll', function() {

    return {
        extend : 'criterion.controller.ess.Base',

        alias : 'controller.criterion_selfservice_payroll',

        mixins : [
            'criterion.controller.mixin.ReRouting'
        ],

        baseURL : criterion.consts.Route.SELF_SERVICE.PAYROLL,

        init : function() {
            this.setReRouting();
            this.callParent(arguments);
        },

        handleRoute : function(pageId) {
            var page;

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

            this.getView().getLayout().setActiveItem(page || 0);
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

Ext.define('criterion.controller.ess.Learning', function() {

    return {
        extend : 'criterion.controller.ess.Base',

        alias : 'controller.criterion_selfservice_learning',

        baseURL : criterion.consts.Route.SELF_SERVICE.LEARNING,

        mixins : [
            'criterion.controller.mixin.identity.EmployeeGlobal',
            'criterion.controller.mixin.ReRouting'
        ],

        onBeforeEmployeeChange : Ext.returnTrue,

        onEmployeeChange : Ext.emptyFn,

        init : function() {
            this.setReRouting();

            this.callParent(arguments);
        },

        onChildTabChange : function(panel, childCard, parentCard) {
            Ext.History.add(this.baseURL + '/' + parentCard.itemId + '/' + childCard.itemId);
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

        getRoutes : function() {
            var routes = this.callParent(arguments);

            routes[this.baseURL + '/:tab/:sub'] = 'handleRoute';

            return routes;
        }
    };
});

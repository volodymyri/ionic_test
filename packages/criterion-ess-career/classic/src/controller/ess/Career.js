Ext.define('criterion.controller.ess.Career', function() {

    return {
        extend : 'criterion.controller.ess.Base',

        alias : 'controller.criterion_selfservice_career',

        baseURL : criterion.consts.Route.SELF_SERVICE.CAREER,

        mixins : [
            'criterion.controller.mixin.identity.EmployeeGlobal',
            'criterion.controller.mixin.ReRouting'
        ],

        onBeforeEmployeeChange : Ext.returnTrue,

        onEmployeeChange : Ext.emptyFn,

        init() {
            this.setReRouting();

            this.callParent(arguments);
        },

        onChildTabChange(panel, childCard, parentCard) {
            Ext.History.add(this.baseURL + '/' + parentCard.itemId + '/' + childCard.itemId);
        },

        handleRoute(pageId) {
            let page,
                item,
                layout = this.getView().getLayout();

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

            layout.setActiveItem(page || 0);
            item = layout.getActiveItem();

            item && item.fireEvent('activate', item);
        },

        getRoutes() {
            let routes = this.callParent(arguments);

            routes[this.baseURL + '/:tab/:sub'] = 'handleRoute';

            return routes;
        }
    };
});

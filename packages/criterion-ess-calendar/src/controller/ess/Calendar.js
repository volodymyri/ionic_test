Ext.define('criterion.controller.ess.Calendar', function() {

    return {
        extend : 'criterion.controller.ess.Base',

        alias : 'controller.criterion_selfservice_calendar',

        mixins : [
            'criterion.controller.mixin.ReRouting'
        ],

        baseURL : criterion.consts.Route.SELF_SERVICE.CALENDAR,

        init : function() {
            this.setReRouting();
            this.callParent(arguments);
        },

        handleRoute : function(pageId) {
            let view = this.getView();

            if (/^calendar/.test(pageId)) {
                view.getLayout().setActiveItem(view.down('#calendar'));
            } else {
                view.items.each(item => {
                    if (item.itemId === pageId) {
                        view.getLayout().setActiveItem(item);
                        item.fireEvent('activate', item);
                    }
                });
            }
        },

        getRoutes : function() {
            let routes = this.callParent(arguments);

            routes[this.baseURL + '/:pageId'] = 'handleRoute';

            return routes;
        }
    };
});

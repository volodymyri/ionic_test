Ext.define('criterion.view.ess.navigation.menu.Calendars', {

    extend : 'criterion.view.ess.navigation.MenuSection',

    alias : 'widget.criterion_ess_navigation_menu_calendars',

    mixins : [
        'Ext.util.StoreHolder'
    ],

    items : [],

    initComponent : function() {
        let me = this;

        this.bindStore(Ext.StoreManager.lookup(criterion.Consts.GLOBAL_STORES.ESS_EMPLOYEE_CALENDARS.storeId));

        Ext.GlobalEvents.on('employeeCalendarsLoaded', () => {
            me.createItems();
        });

        this.callParent(arguments);

        this.createItems();
    },

    getStoreListeners : function() {
        return {
            datachanged : this.createItems
        }
    },

    createItems : function() {
        const ROUTES = criterion.consts.Route,
            SELF_SERVICE = ROUTES.SELF_SERVICE;

        let isStaticMenu = this.isStaticMenu,
            items = [], highlightedRef,
            store = this.getStore();

        if (!store) {
            return;
        }

        this.title && items.push({
            xtype : 'component',
            cls : 'criterion-ess-navigation-menu-heading',
            html : this.title
        });

        this.fireEvent('calendarsCountChanged', store.count());

        store.each(function(record) {
            items.push({
                text : record.get('name'),
                href : ROUTES.getDirect(SELF_SERVICE.CALENDAR) + '/' + 'calendar' + record.getId()
            })
        });

        this.items.each(function(item) {
            if (item._highlighted) {
                highlightedRef = item._routeRef;
            }
        });

        this.removeAll();

        Ext.each(items, item => {
            item.width = isStaticMenu ? 300 : 220
        });

        this.add(items);

        if (highlightedRef) {
            let highlighted = this.down(Ext.util.Format.format('button[_routeRef={0}]', highlightedRef));

            if (highlighted) {
                highlighted._highlighted = true;
                highlighted.addCls('highlighted-button');
            }
        }
    }

});

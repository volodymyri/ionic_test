Ext.define('criterion.view.moduleToolbar.Inbox', function() {

    var ROUTES = criterion.consts.Route,
        SELF_SERVICE = ROUTES.SELF_SERVICE;

    return {
        alias : 'widget.criterion_moduletoolbar_inbox',

        extend : 'criterion.view.moduleToolbar.MenuOwner',

        mixins : [
            'Ext.util.StoreHolder'
        ],

        text : '',
        menuAlign : 'tr-br?',
        menuAlignOffset : [-16, 5],
        cls : [
            'criterion-moduletoolbar-btn-secondary',
            'criterion-inbox-button'
        ],

        config : {
            visibleItemsCount : 3
        },

        initComponent : function() {
            this.bindStore(Ext.StoreManager.lookup(criterion.Consts.GLOBAL_STORES.WORKFLOW_PENDING_LOGS.storeId));
            this.callParent(arguments);
        },

        getStoreListeners : function() {
            return {
                load : this.createMenu,
                datachanged : this.createMenu
            }
        },

        createMenu : function() {
            var menuCfg = {
                shadow : 'drop',
                cls : 'criterion-moduletoolbar-menu',

                items : []
            }, visibleItemsCount = this.getVisibleItemsCount(), i = 0;

            this.getStore().each(function(record) {
                ++i <= visibleItemsCount && menuCfg.items.push({
                    text : Ext.String.format('<strong>{0}</strong> <br> {1}', record.get('employeeName'), record.get('workflowTypeDesc')),
                    href : ROUTES.getDirect(record.get('isOnboarding') && !record.get('isOnboardingForm') ? SELF_SERVICE.DASHBOARD_TASK : SELF_SERVICE.DASHBOARD_INBOX) + '/' + record.getId()
                })
            });

            if (i > visibleItemsCount) {
                menuCfg.items.push('-', {
                    text : i18n.gettext('View All'),
                    href : ROUTES.getDirect(SELF_SERVICE.DASHBOARD)
                });
            }

            this.setMenu(menuCfg);

            if (this.getStore().count()) {
                this.show();
                this.setText(this.getStore().count());
            } else {
                this.setText('');
                this.hide();
            }
        }
    };

});

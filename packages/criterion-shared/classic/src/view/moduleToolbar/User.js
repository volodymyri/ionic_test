Ext.define('criterion.view.moduleToolbar.User', function() {

    return {
        alias : 'widget.criterion_moduletoolbar_user',

        extend : 'criterion.view.moduleToolbar.MenuOwner',

        requires : [
            'criterion.controller.moduleToolbar.User'
        ],

        controller : {
            type : 'criterion_moduletoolbar_user'
        },

        listeners : {
            scope : 'controller',
            render : 'handleRender'
        },

        text : '',
        menuAlign : 'tr-br?',
        cls : 'criterion-moduletoolbar-btn-secondary',

        initComponent : function() {
            this.menu = new Ext.menu.Menu(this.getMenuCfg());

            this.callParent(arguments);
        },

        getMenuCfg : function() {
            return {
                shadow : 'drop',
                cls : 'criterion-moduletoolbar-menu',

                items : [
                    {
                        text : i18n.gettext('Sign Out'),
                        action : 'logout',
                        listeners : {
                            click : 'handleLogoutClick'
                        }
                    }
                ]
            }
        }
    };

});

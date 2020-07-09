Ext.define('criterion.view.moduleToolbar.MenuOwner', function() {

    return {
        extend : 'Ext.Button',

        alias : 'widget.criterion_moduletoolbar_menuowner',

        mixins : [
            'criterion.ux.mixin.Component'
        ],

        config : {
            menuItems : null
        },

        menuAlignOffset : null,

        setMenuItems : function(items) {
            var me = this,
                menu = me.getMenu();

            if (menu) {
                menu.removeAll(true);
                menu.add(items);
            }
        },

        setMenu : function(menuCfg) {
            this.callParent(arguments);

            var menu = this.getMenu();
            menu.doAutoRender(); // hack to update menu position as menu items have dynamic property "hidden"

            if (menu) {
                menu.alignOffset = this.menuAlignOffset;
            }
        },

        initComponent : function() {
            var me = this,
                menu = me.menu,
                menuCls,
                parentCmp = me.up(),
                moduleIdCls = me.moduleId && me.moduleId.toLowerCase() || parentCmp.moduleId && parentCmp.moduleId.toLowerCase();

            if (menu) {
                menuCls = menu.cls || '';
                menu.cls += (menuCls ? ' ' : '') + 'criterion-' + moduleIdCls;
                menu.alignOffset = me.menuAlignOffset;
            }

            me.callParent(arguments);
        }

    };

});
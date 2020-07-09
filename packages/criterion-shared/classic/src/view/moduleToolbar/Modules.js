Ext.define('criterion.view.moduleToolbar.Modules', function() {

    return {
        alias : 'widget.criterion_moduletoolbar_modules',

        extend : 'criterion.view.moduleToolbar.MenuOwner',

        requires : [
            'criterion.controller.moduleToolbar.Modules'
        ],

        controller : {
            type : 'criterion_moduletoolbar_modules'
        },

        margin : 0,

        getMenuItems : function() {
            let me = this,
                items = [];

            Ext.Object.each(criterion.consts.Module.getModules(), function(moduleId, itemCfg) {
                let data;

                if (criterion.SecurityManager.isAllowedModule(moduleId) || moduleId === 'SelfService') {
                    data = {
                        checked : moduleId === me.moduleId,
                        text : itemCfg.text
                    };

                    items.push(Ext.applyIf({
                        text : criterion.Utils.getTpl('BULLED_MENU_ITEM').apply(data)
                    }, itemCfg));
                }
            });

            return items;
        },

        initComponent : function() {
            var me = this;

            me.menu = new Ext.menu.Menu({
                shadow : 'drop',
                cls : 'criterion-moduletoolbar-menu',
                items : this.getMenuItems(),
                minWidth : 175
            });

            me.callParent(arguments);
        }
    };

});

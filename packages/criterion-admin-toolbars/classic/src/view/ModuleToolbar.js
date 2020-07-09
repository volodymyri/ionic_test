Ext.define('criterion.view.ModuleToolbar', function() {

    function getItems() {
        var lazyPlugin = Ext.Array.findBy(this.plugins || [], function(plugin) {
            return plugin.ptype === 'criterion_lazyitems'
        });

        return lazyPlugin ? lazyPlugin.items : this.items;
    }

    return {
        alias : 'widget.criterion_moduletoolbar',

        extend : 'criterion.ux.Toolbar',

        requires : [
            'criterion.controller.ModuleToolbar',
            'criterion.view.moduleToolbar.*'
        ],

        controller : {
            type : 'criterion_moduletoolbar'
        },

        cls : 'criterion-moduletoolbar',

        padding : 0,

        defaultType : 'button',

        defaults : {
            scale : 'large',
            iconAlign : 'left',
            hrefTarget : '_self',
            allowDepress : false
        },

        config : {
            toggleGroup : '',
            showUserBtn : true,
            moduleSwitcherGlyph : criterion.consts.Glyph['navicon']
        },

        listeners : {
            afterlayout : {
                fn : 'onAfterLayout',
                single : true
            }
        },

        initComponent : function() {
            var me = this,
                moduleId = me.moduleId,
                items;

            items = getItems.call(this);

            items.unshift(this.getModuleSwitcher());
            Ext.Array.insert(items, Ext.Array.indexOf(items, '->'), ['->', {
                xtype : 'criterion_moduletoolbar_sandbox_mark'
            }]);
            items.push(this.getUserBtn());

            Ext.Array.each(items, function(item) {
                item.moduleId = moduleId;
            });

            me.callParent(arguments);
        },

        getModuleSwitcher : function() {
            return {
                xtype : 'criterion_moduletoolbar_modules',
                reference : 'modules',
                text : this.moduleName,
                glyph : this.moduleSwitcherGlyph,
                arrowCls : this.moduleSwitcherGlyph ? '' : 'arrow',
                minWidth : this.moduleButtonWidth || null,
                menuAlign : 'tl-bl?',
                menuAlignOffset : [15, 0]
            }
        },

        getUserBtn : function() {
            return {
                xtype : 'criterion_moduletoolbar_user',
                userModuleWithUserName : this.userModuleWithUserName,
                reference : 'user',
                menuAlignOffset : [-16, 0]
            }
        }

    };

});

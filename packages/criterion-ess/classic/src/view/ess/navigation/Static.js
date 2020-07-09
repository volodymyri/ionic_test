Ext.define('criterion.view.ess.navigation.Static', function() {

    return {

        extend : 'Ext.toolbar.Toolbar',

        alias : 'widget.criterion_ess_navigation_static',

        requires : [
            'criterion.view.view.ess.navigation.StaticButton'
        ],

        mixins : [
            'criterion.ux.mixin.Component'
        ],

        cls : 'criterion-ess-navigation',

        defaultType : 'criterion_view_ess_navigation_static_button',

        layout : {
            overflowHandler : 'scroller'
        },

        constructor : function(config) {
            let me = this,
                items = [
                    {
                        cls : 'criterion-view-ess-navigation-toggle',
                        padRight : true,
                        button : {
                            xtype : 'button',
                            glyph : criterion.consts.Glyph['arrow-left-b'],
                            cls : 'criterion-view-ess-navigation-static-glyph-button-trigger',
                            listeners : {
                                click : function() {
                                    me.fireEvent('toggleDynamic')
                                }
                            }
                        }
                    }
                ];

            Ext.Array.each(criterion.view.ess.Main.getMenuConfig(), menuItem => {
                let menuItemRef;

                if (!menuItem.button) {
                    items.push(menuItem);
                    return;
                }

                if (menuItem.button._href) {
                    menuItemRef = menuItem.button._href.split('#')[1];
                } else if (menuItem.button.href) {
                    menuItemRef = menuItem.button.href.split('#')[1];
                }

                items.push({
                    hidden : menuItem.hidden,
                    bind : menuItem.bind,
                    style : menuItem.style,
                    button : Ext.apply({
                        text : menuItem.title
                    }, menuItem.button),
                    menu : Ext.apply({
                        defaults : {
                            isStaticMenu : true
                        }
                    }, menuItem.menu),
                    _routeRef : menuItemRef,
                    _isHiringManagerSection : menuItem.isHiringManagerSection
                });
            });
            
            config.items = items;

            this.callParent(arguments);
        }
    }
});

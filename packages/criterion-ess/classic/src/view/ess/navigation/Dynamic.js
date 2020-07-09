Ext.define('criterion.view.ess.navigation.Dynamic', function() {

    return {

        extend : 'Ext.toolbar.Toolbar',

        alias : 'widget.criterion_ess_navigation_dynamic',

        requires : [
            'criterion.view.view.ess.navigation.DynamicButton'
        ],

        mixins : [
            'criterion.ux.mixin.Component'
        ],

        cls : 'criterion-ess-navigation',

        defaultType : 'criterion_view_ess_navigation_dynamic_button',

        layout : {
            overflowHandler : 'scroller'
        },

        viewModel : {},

        items : [],

        initComponent() {
            Ext.GlobalEvents.on('customTranslationReady', this.createNavigationItems, this);

            this.callParent(arguments);
            this.createNavigationItems();
        },

        createNavigationItems() {
            let me = this,
                items = [
                    {
                        button : {
                            glyph : criterion.consts.Glyph['arrow-right-b'],
                            cls : 'criterion-view-ess-navigation-static-glyph-button-trigger criterion-view-ess-navigation-toggle',
                            responsiveConfig : criterion.Utils.createResponsiveConfig([
                                {
                                    rule : criterion.Consts.UI_CONFIG.RESPONSIVE.RULE.MEDIUM,
                                    config : {
                                        disabled : true
                                    }
                                },
                                {
                                    rule : criterion.Consts.UI_CONFIG.RESPONSIVE.RULE.MTMEDIUM,
                                    config : {
                                        disabled : false
                                    }
                                }
                            ]),
                            listeners : {
                                click : function() {
                                    me.fireEvent('toggleStatic')
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
                    button : menuItem.button,
                    style : menuItem.style,
                    bind : menuItem.bind,
                    menu : Ext.apply({
                        title : i18n.gettext(i18n.gtoken(menuItem.title)),
                    }, menuItem.menu),
                    _routeRef : menuItemRef,
                    _isHiringManagerSection : menuItem.isHiringManagerSection
                });
            });

            this.removeAll();
            this.add(items);
        }
    }
});

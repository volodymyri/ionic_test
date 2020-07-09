Ext.define('criterion.view.view.ess.navigation.StaticButton', function() {

    return {
        extend : 'Ext.Container',

        alias : 'widget.criterion_view_ess_navigation_static_button',

        mixins : [
            'criterion.ux.mixin.Component'
        ],

        config : {
            /**
             * Push button to right.
             */
            padRight : false
        },

        width : 300,

        margin : '5 0',

        constructor : function(config) {
            var buttons = [],
                menu, me = this;

            if (config.button) {
                buttons.push(Ext.apply({
                    xtype : 'button',
                    hrefTarget : '_self',
                    cls : 'criterion-view-ess-navigation-static-glyph-button'
                }, config.button));

                buttons.splice(!config.padRight ? 1 : 0, 0, {
                    xtype : 'container',
                    flex : 1
                });

                delete config.button;
            }

            if (config.menu && config.menu.items) {
                menu = Ext.apply({
                    itemId : 'menu',
                    xtype : 'container',
                    cls : 'ess-navigation-menu',
                    hidden : true
                }, config.menu);

                buttons[0].href = null;

                buttons.push({
                    xtype : 'button',
                    itemId : 'menuTrigger',
                    glyph : criterion.consts.Glyph['ios7-arrow-down'],
                    cls : 'criterion-view-ess-navigation-static-glyph-button-trigger'
                });

                delete config.menu;
            }

            config.items = [
                {
                    xtype : 'container',
                    cls : 'ess-navigation-static-menu-button',
                    layout : {
                        type : 'hbox'
                    },
                    items : buttons
                }
            ];

            if (menu) {
                config.items[0].listeners = {
                    element  : 'el',
                        scope : me,
                        click : 'onMenuToggle'
                };

                config.items.push(menu);
            }

            this.callParent([config]);
        },

        onMenuToggle : function() {
            var menu = this.down('#menu'),
                menuTrigger = this.down('#menuTrigger');

            if (menu.hidden) {
                menuTrigger.setGlyph(criterion.consts.Glyph['ios7-arrow-up']);
                menu.show();
            } else {
                menuTrigger.setGlyph(criterion.consts.Glyph['ios7-arrow-down']);
                menu.hide();
            }

        }
    }
});
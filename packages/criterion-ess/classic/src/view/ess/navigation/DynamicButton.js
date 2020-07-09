Ext.define('criterion.view.view.ess.navigation.DynamicButton', function() {

    var hideTimeout;

    return {
        extend : 'Ext.button.Button',

        alias : 'widget.criterion_view_ess_navigation_dynamic_button',

        mixins : [
            'criterion.ux.mixin.Component'
        ],

        hrefTarget : '_self',
        menuAlign : 'tr-tl?',
        arrowVisible : false,
        margin : Ext.platformTags.touch ? 0 : '5 10', // Part of solution D2-8. Hard to click on the icon on mobile device. Decreased margin allows to do it easier.
        padding : Ext.platformTags.touch ? '14 20' : '9 10',

        listeners : {
            scope : 'this',
            mouseover : 'showMenu',
            mouseout : 'delayedHide'
        },

        constructor : function(config) {
            if (config.button) {
                config = Ext.apply(config, config.button);
            }

            if (config.menu) {
                config.menu = Ext.create('Ext.menu.Menu', Ext.apply({
                    cls : 'ess-navigation-menu',
                    alignOffset : [10, 0],
                    shadow : false
                }, config.menu));
            }
            
            delete config.button;

            this.callParent(arguments);
        },

        setMenu : function(menu) {
            this.callParent(arguments);

            this.menu.addCls('criterion-ess-navigation-dynamic-menu');
            this.menu.on({
                mouseenter : { fn : 'showMenu', scope : this },
                mouseleave : { fn : 'delayedHide', scope : this }
            }, this);
        },

        showMenu : function() {
            clearTimeout(hideTimeout);
            this.callParent(arguments);
        },

        delayedHide : function() {
            clearTimeout(hideTimeout);
            hideTimeout = Ext.defer(this.hideMenu, 100, this);
        }
    }
});
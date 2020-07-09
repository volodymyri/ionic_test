// Part of solution D2-8. Minimum window size was set to avoid window collapse on small mobile devices.
Ext.define('criterion.overrides.plugin.Viewport', {
    override : 'Ext.plugin.Viewport',

    requires : [
        'criterion.Consts',
        'criterion.Utils'
    ],

    setCmp : function(cmp) {
        var me = this,
            bodyEl = Ext.getBody();

        me.callParent(arguments);

        if (Ext.isClassic && Ext.platformTags.touch &&
            window.innerWidth < criterion.Consts.UI_DEFAULTS.MIN_TOUCH_VIEWPORT_WIDTH && cmp.initialViewportWidth === criterion.Consts.UI_DEFAULTS.MIN_TOUCH_VIEWPORT_WIDTH &&
            window.innerHeight < criterion.Consts.UI_DEFAULTS.MIN_TOUCH_VIEWPORT_HEIGHT && cmp.initialViewportHeight === criterion.Consts.UI_DEFAULTS.MIN_TOUCH_VIEWPORT_HEIGHT) {

            cmp.el.setSize(cmp.initialViewportWidth, cmp.initialViewportHeight);

            Ext.defer(function() {
                bodyEl.setStyle({
                    "overflow" : 'scroll',
                    position : 'relative'
                });
            }, 1000);
        }
    }
});
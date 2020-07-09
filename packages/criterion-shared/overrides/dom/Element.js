// Part of solution D2-8. Minimum window size was set to avoid window collapse on small mobile devices.
Ext.define('criterion.overrides.dom.Element', {
    override : 'Ext.dom.Element',

    requires : ['criterion.Consts'],

    inheritableStatics : {

        isPageLessViewportMinWidthAndHeight : function() {
            return  Ext.isClassic && Ext.platformTags.touch &&
                    window.innerWidth <= criterion.Consts.UI_DEFAULTS.MIN_TOUCH_VIEWPORT_WIDTH &&
                    window.innerHeight <= criterion.Consts.UI_DEFAULTS.MIN_TOUCH_VIEWPORT_HEIGHT;
        },

        getViewportWidth : function() {
            var width = this.callParent(arguments);

            return this.isPageLessViewportMinWidthAndHeight() ? criterion.Consts.UI_DEFAULTS.MIN_TOUCH_VIEWPORT_WIDTH : width;
        },

        getViewportHeight : function() {
            var height = this.callParent(arguments);

            return this.isPageLessViewportMinWidthAndHeight() ? criterion.Consts.UI_DEFAULTS.MIN_TOUCH_VIEWPORT_HEIGHT : height;
        }
    }
});
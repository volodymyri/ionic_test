Ext.define('criterion.overrides.ux.colorpick.SelectorModel', {

    override : 'Ext.ux.colorpick.SelectorModel',

    changeRGB : function(rgb) {
        Ext.applyIf(rgb, this.data.selectedColor);

        if (!rgb) { // <- changed
            return
        }

        var hsv = Ext.ux.colorpick.ColorUtils.rgb2hsv(rgb.r, rgb.g, rgb.b);

        rgb.h = hsv.h;
        rgb.s = hsv.s;
        rgb.v = hsv.v;

        this.set('selectedColor', rgb);
    }
});

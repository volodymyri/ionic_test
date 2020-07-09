// Part of solution D2-8. "!Ext.supports.Touch" check added to avoid msg boxes positioning out of page borders.
Ext.define('criterion.ess.overrides.util.Floating', {

    override : 'Ext.util.Floating',

    center : function() {
        var me = this,
            parent = me.floatParent,
            xy, alignToEl;

        if (me.isVisible()) {
            alignToEl = parent ? parent.getTargetEl() : me.container;
            xy = me.getAlignToXY(parent ? parent.getTargetEl() : me.container, 'c-c');

            if (Ext.supports.Touch && alignToEl === Ext.getBody()) {
                me.setLocalXY(xy[0], xy[1]);
                me.afterSetPosition(xy[0], xy[1]);
            } else {
                me.setPagePosition(xy);
            }
        } else {
            me.needsCenter = true;
        }
        return me;
    }
});

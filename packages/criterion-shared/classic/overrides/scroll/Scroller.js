Ext.define('criterion.overrides.scroll.Scroller', {

    override : 'Ext.scroll.Scroller',

    privates : {
        invokePartners : function(method, x, y, xDelta, yDelta) {
            var me = this,
                partners = me._partners,
                partner,
                id, axes;

            if (!me.suspendSync) {
                me.invokingPartners = true;

                for (id in partners) {
                    axes = partners[id].axes;
                    partner = partners[id].scroller;

                    // Only pass the scroll on to partners if we are are configured
                    // to pass on the scrolled dimension
                    if (!partner.invokingPartners && !partner.component.hidden && (xDelta && axes.x || yDelta && axes.y)) {    // <=== added !partner.component.hidden
                        partner[method](me, axes.x ? x : null, axes.y ? y : null, xDelta, yDelta);
                    }
                }

                me.invokingPartners = false;
            }
        }
    }
});

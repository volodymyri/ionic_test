// Part of solution D2-8. "!Ext.supports.Touch" check added to avoid msg boxes positioning out of page borders.
Ext.define('criterion.overrides.util.Positionable', {

    override : 'Ext.util.Positionable',

    getAlignToRegion: function(alignToEl, posSpec, offset, minHeight) {
        var me = this,
            inside, newRegion, bodyScroll;

        alignToEl = Ext.fly(alignToEl.el || alignToEl);

        if (!alignToEl || !alignToEl.dom) {
            //<debug>
            Ext.raise({
                sourceClass: 'Ext.util.Positionable',
                sourceMethod: 'getAlignToXY',
                msg: 'Attempted to align an element that doesn\'t exist'
            });
            //</debug>
        }

        posSpec = me.convertPositionSpec(posSpec);

        // If position spec ended with a "?" or "!", then constraining is necessary
        if (posSpec.constrain) {
            // Constrain to the correct enclosing object:
            // If the assertive form was used (like "tl-bl!"), constrain to the alignToEl.
            if (posSpec.constrain === '!') {
                inside = alignToEl;
            }
            else {
                // Otherwise, attempt to use the constrainTo property.
                // Otherwise, if we are a Component, there will be a container property.
                // Otherwise, use this Positionable's element's parent node.
                inside = me.constrainTo || me.container || me.el.parent();
            }

            inside = Ext.fly(inside.el || inside).getConstrainRegion();
        }

        // SKIP OFFSET DETECTION ON TOUCH DEVICES
        if (!Ext.supports.Touch && alignToEl === Ext.getBody()) {
            bodyScroll = alignToEl.getScroll();

            offset = [bodyScroll.left, bodyScroll.top];
        }

        newRegion = me.getRegion().alignTo({
            target: alignToEl.getRegion(),
            inside: inside,
            minHeight: minHeight,
            offset: offset,
            align: posSpec,
            axisLock: true
        });

        return newRegion;
    }
});
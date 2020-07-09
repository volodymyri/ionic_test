Ext.define('criterion.overrides.layout.container.boxOverflow.Scroller', {

    override : 'Ext.layout.container.boxOverflow.Scroller',

    scrollIncrement : 30,

    wheelIncrement : 40,

    enableAnimation : false,

    scrollBy : function(delta, animate) {
        var layout = this.layout,
            scroller = layout.owner.getScrollable(),
            args = [0, 0, this.enableAnimation && animate ? this.getScrollAnim() : false];

        args[layout.horizontal ? 0 : 1] = delta;
        scroller.scrollBy.apply(scroller, args);
    }
});

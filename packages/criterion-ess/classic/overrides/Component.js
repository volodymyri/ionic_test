Ext.define('criterion.overrides.Component', {

    override : 'Ext.Component',

    tooltipEnabled : false,

    tooltipType : null,

    initComponent : function() {
        this.callParent(arguments);

        if (this.tooltipEnabled) {
            var me = this;

            me.tooltipType = me.tooltipType || 'qtip';

            me.getTipAttr = function() {
                return me.tooltipType === 'qtip' ? 'data-qtip' : 'title';
            };

            me.clearTip = function() {
                var el = me.el;

                if (Ext.quickTipsActive && Ext.isObject(me.tooltip)) {
                    Ext.tip.QuickTipManager.unregister(el);
                } else {
                    el && el.dom && el.dom.removeAttribute(me.getTipAttr());
                }
            };

            me.setTooltip = function(tooltip, initial) {
                if (me.rendered) {
                    if (!initial || !tooltip) {
                        me.clearTip();
                    }
                    if (tooltip) {
                        if (Ext.quickTipsActive && Ext.isObject(tooltip)) {
                            Ext.tip.QuickTipManager.register(Ext.apply({
                                    target : me.el.id
                                },
                                tooltip));
                            me.tooltip = tooltip;
                        } else {
                            me.el.dom.setAttribute(me.getTipAttr(), tooltip);
                        }
                    }
                } else {
                    me.tooltip = tooltip;
                }
                return me;
            }
        }
    }
});

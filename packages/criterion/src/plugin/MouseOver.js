Ext.define('criterion.plugin.MouseOver', {
    extend : 'Ext.plugin.MouseEnter',

    alias : 'plugin.criterion_mouse_over',

    pluginId : 'criterionMouseOver',

    /**
     Array of components classes which should be highlighted with current component.
     in this case param mouseOverAnchor should be defined for current component and highlighted component with the same values
     */
    highlightedCmps : [],

    handler : function(e, domEl) {
        var me = this,
            el = Ext.get(domEl);

        !el.hasCls('over') && el.addCls('over');

        Ext.Array.each(this.getPlugin('criterionMouseOver').highlightedCmps, function(cmpClass) {
            Ext.Array.each(Ext.query(cmpClass, false), function(cmp) {
                if (cmp.component && cmp.component.mouseOverAnchor == me.mouseOverAnchor) {
                    !cmp.component.hasCls('over') && cmp.component.addCls('over')
                }
            })
        });
    },

    leaveHandler : function(e, domEl) {
        var me = this,
            el = Ext.get(domEl);

        el.hasCls('over') && el.removeCls('over');

        Ext.Array.each(this.getPlugin('criterionMouseOver').highlightedCmps, function(cmpClass) {
            Ext.Array.each(Ext.query(cmpClass, false), function(cmp) {
                if (cmp.component && cmp.component.mouseOverAnchor == me.mouseOverAnchor) {
                    cmp.component.hasCls('over') && cmp.component.removeCls('over');
                }
            })
        });
    }

});
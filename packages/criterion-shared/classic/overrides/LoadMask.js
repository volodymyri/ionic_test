Ext.define('criterion.overrides.LoadMask', {

    override : 'Ext.LoadMask',

    renderTpl: [
        '<div id="{id}-msgWrapEl" data-ref="msgWrapEl" class="{[values.$comp.msgWrapCls]}" role="presentation">',
            '<div id="{id}-msgEl" data-ref="msgEl" class="{[values.$comp.msgCls]} ',
                Ext.baseCSSPrefix, 'mask-msg-inner {childElCls}" role="presentation">',
                '<div id="{id}-msgTextEl" data-ref="msgTextEl" class="',
                    Ext.baseCSSPrefix, 'mask-msg-text',
                    '{childElCls}" role="presentation">{msg}</div>',
            '</div>',
            '<div class="loading-dots">',
                '<label>&#9679;</label>',
                '<label>&#9679;</label>',
                '<label>&#9679;</label>',
                '<label>&#9679;</label>',
                '<label>&#9679;</label>',
                '<label>&#9679;</label>',
            '</div>',
        '</div>'
    ],

    hide : function() {
        var me;

        Ext.globalEvents.fireEvent('isActiveMasks', false);
        me = this.callParent(arguments);

        criterion.Utils.removeMask(me);

        !me.destroyed && me.setStyle({
            '-webkit-transition' : 'none',
            '-moz-transition' : 'none',
            '-o-transition' : 'none',
            'transition' : 'none',
            'opacity' : '0'
        });

        return me;
    },

    show : function() {
        var me;

        Ext.globalEvents.fireEvent('isActiveMasks', true);

        me = this.callParent(arguments);
        me.setStyle({
            '-webkit-transition' : 'opacity 0.01s cubic-bezier(1,0,1,0)',
            '-moz-transition' : 'opacity 0.01s cubic-bezier(1,0,1,0)',
            '-o-transition' : 'opacity 0.01s cubic-bezier(1,0,1,0)',
            'transition' : 'opacity 0.01s cubic-bezier(1,0,1,0)',
            'opacity' : '0.9'
        });

        criterion.Utils.addMask(me);

        return me;
    }
});

/**
 * https://fiddle.sencha.com/#fiddle/ngo
 */
Ext.define('criterion.ux.mixin.Badge', {
    extend: 'Ext.Mixin',

    mixinConfig: {
        id: 'badge',
        after: {
            initComponent : 'afterInit',
            render: 'afterRender'
        }
    },

    afterInit : function() {
        this.on('render', this.mixins.badge.afterRender, this, {
            single: true
        });
    },

    afterRender: function() {
        var me = this;

        me.badgeText = me.badgeText || '';

        if (!me.el) {
            me.on('render', Ext.pass(me.setBadgeText, [me.badgeText, true], me), me, {
                single: true
            });

            return;
        }

        me.el.addCls('criterion-badge');
        me.setBadgeText(me.badgeText, true);
    },

    setBadgeText: function(text, force) {

        var me = this,
            oldBadgeText = me.badgeText,
            el = me.el,
            dom = el && el.dom;

        if (el && dom) {
            if (force || oldBadgeText !== text) {
                me.badgeText = text;

                dom.setAttribute('data-criterion-badge', me.badgeText || '');

                if (Ext.isEmpty(me.badgeText)) {
                    el.addCls('hide-badge');
                } else {
                    el.removeCls('hide-badge');
                }

                me.fireEvent('badgetextchange', me, oldBadgeText, text);
            }
        }
    },

    getBadgeText: function() {
        return me.badgeText;
    }
});
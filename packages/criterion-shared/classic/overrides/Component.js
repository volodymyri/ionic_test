Ext.define('criterion.overrides.Component', {

    override : 'Ext.Component',

    mixins : [
        'criterion.ux.mixin.Component'
    ],

    setLoadingDots : function(state) {
        let mask = this.setLoading(state);

        mask.on('hide', function() {
            mask.removeCls('show-dots');
        }, this, { single : true});

        mask.addCls('show-dots');

        return mask;
    },

    onShow : function() {
        var me = this;

        if (!me.ariaStaticRoles[me.ariaRole]) {
            me.ariaEl.dom.setAttribute('aria-hidden', false);
        }

        me.el.show();

        me.updateLayout({
            isRoot: false,
            context: me._showContext
        });

        // Constraining/containing element may have changed size while this Component was hidden
        if (me.floating) {
            if (me.maximized) {
                me.fitContainer();
            }
            else if (me.constrain) {
                me.doConstrain();
            }
        }

        // <- changed (added)
        i18n.rebuildInnerTokens(this.el && this.el.dom);
    }

});

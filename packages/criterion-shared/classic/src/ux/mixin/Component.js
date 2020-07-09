Ext.define('criterion.ux.mixin.Component', function() {

    return {

        extend : 'Ext.Mixin',

        requires : [
            'criterion.Utils'
        ],

        mixinConfig : {
            id : 'criterionComponent',
            after : {
                initComponent : 'initMixin'
            }
        },

        initMixin : function() {
            var me = this,
                el;

            me.addCls([
                criterion.Utils.getBaseCls(me),
                criterion.Utils.getAdditionalCls(me)
            ]);

            //<debug>
            if (!criterion.PRODUCTION) {
                // set data-cls-name attribute with class name (fast development tool)
                me.on('render', function() {
                    el = me.getEl && me.getEl();
                    el && el.set({
                        'data-cls-name' : Ext.getClassName(me)
                    });
                }, this, {single : true});
            }
            //</debug>
        }
    };

});

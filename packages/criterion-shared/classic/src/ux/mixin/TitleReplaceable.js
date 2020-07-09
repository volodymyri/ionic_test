Ext.define('criterion.ux.mixin.TitleReplaceable', function() {

    return {
        extend : 'Ext.Mixin',

        mixinConfig : {
            id : 'criterionTitleReplaceable',
            before : {
                initComponent : 'beforeInit'
            },
            after : {
                initComponent : 'afterInit'
            }
        },

        replaceTitle : false,
        titleReplaced : false,

        replaceableTitle : null,

        beforeInit : function() {
            var me = this;

            if (me.replaceTitle && me.title && !me.header) {
                me.replaceableTitle = me.title;
                me.title = null;
                me.titleReplaced = false;
            }
        },

        afterInit : function() {
            var me = this,
                items;

            if (me.replaceableTitle && !me.titleReplaced) {
                me.titleReplaced = true;

                items = [
                    {
                        xtype : 'component',
                        cls : 'criterion-pseudo-header-title',
                        html : me.replaceableTitle
                    }
                ];

                if (Ext.isFunction(me.getAdditionalItems)) {
                    items = Ext.Array.merge(items, me.getAdditionalItems());
                }

                me.addDocked({
                    xtype : 'toolbar',
                    dock : 'top',
                    items : items,
                    cls : 'criterion-pseudo-header x-unselectable'
                });
            }
        }
    };

});

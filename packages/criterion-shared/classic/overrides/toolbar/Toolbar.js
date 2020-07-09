Ext.define('criterion.overrides.toolbar.Toolbar', {

    override : 'Ext.toolbar.Toolbar', // todo move this from overrides to custom components

    /**
     * @cfg {String}
     * Item margins if trackLastItems is true
     */
    itemMargin : '0 8 0 0',

    trackLastItems : false,

    autoTrackCls : 'criterion-ess-panel',

    initComponent : function() {
        var owner = this.up();

        if (owner && owner.hasCls(this.autoTrackCls)) {
            this.trackLastItems = true;
        }

        this.callParent(arguments);
    },

    add : function() {
        var ret = this.callParent(arguments);

        if (this.trackLastItems && this.itemMargin) {
            this.checkLastItem();
        }

        return ret;
    },

    move : function() {
        this.callParent(arguments);
        if (this.trackLastItems && this.itemMargin) {
            this.checkLastItem();
        }
    },

    onAdd : function(component) {
        this.callParent(arguments);
        this.trackLastItem(component);
    },

    onRemove : function (c) {
        this.callParent(arguments);
        this.trackLastItem(c, true);
    },

    privates : {
        /**
         * @private
         */
        trackLastItem : function(item, remove) {
            var me = this;

            if (me.trackLastItems && me.itemMargin) {
                item[remove ? 'un' : 'on']({
                    hide : me.checkLastItem,
                    show : me.checkLastItem,
                    scope : me
                });
            }
        },

        /**
         * @private
         */
        checkLastItem : function() {
            var me = this,
                lastVisible;

            me.items.each(function(item) {
                item.setMargin(me.itemMargin);

                if (!item.hidden) {
                    lastVisible = item;
                }
            });

            lastVisible && lastVisible.setMargin(0);
        }
    }
});

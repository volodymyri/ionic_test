Ext.define('criterion.view.hr.dashboard.RecentlyViewed', function() {

    return {

        alias : 'widget.criterion_hr_dashboard_recently_viewed',

        extend : 'Ext.container.Container',

        mixins : [
            'criterion.ux.mixin.Component',
            'criterion.ux.mixin.RecordsHolder'
        ],

        requires : [
            'criterion.view.hr.dashboard.RecentlyViewedItem'
        ],

        config : {
            /**
             * @cfg {Number} numColumns
             */
            maxCount : 4
        },

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        getRecordItems : function() {
            return this.query('criterion_hr_dashboard_recently_viewed_item');
        },

        getTotalCount : function() {
            return this.getRecordItems().length;
        },

        /**
         * Creates item.
         *
         * @param record
         * @returns
         */
        createRecordItem : function(record) {
            if (this.getTotalCount() > this.getMaxCount()) {
                return;
            }

            return {
                xtype : 'criterion_hr_dashboard_recently_viewed_item',
                record : record
            };
        },

        bindStore : function(store, initial) {
            var me = this;

            if (me.store && !initial) {
                if (me.storeRelayers) {
                    Ext.destroy(me.storeRelayers);
                }
            }

            Ext.util.StoreHolder.prototype.bindStore.apply(me, arguments);

            store = me.getStore();
            if (store) {
                store.sort('last', 'DESC');
                me.storeRelayers = me.relayEvents(
                    store,
                    Ext.Object.getKeys(this.getStoreListeners()), 'store'
                );

                me.handleStoreRefresh(store);
            }
        },

        initComponent : function() {
            var me = this;

            me.items = [
                {
                    html : Ext.util.Format.format('<h4>{0}</h4>', i18n.gettext('Recently viewed')),
                    margin : '0 0 0 10'
                }
            ];

            me.callParent(arguments);
            me.mixins.recordsholder.init.call(me);
        }
    };

});

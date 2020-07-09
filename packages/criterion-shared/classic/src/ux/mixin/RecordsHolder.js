Ext.define('criterion.ux.mixin.RecordsHolder', function() {

    return {

        extend : 'Ext.util.StoreHolder',

        mixinId : 'recordsholder',

        requires : [],

        createRecord : function() {
            return {};
        },

        removeRecord : function(record) {
            var me = this,
                store = me.getStore();

            store.remove(record);
        },

        addRecord : function(record) {
            var me = this,
                store = me.getStore();

            return store.add(record);
        },

        getRecordItems : function() {
            return this.query('*[record]');
        },

        getItemByRecord : function(record) {
            return Ext.Array.filter(this.getRecordItems(), function(item) {
                return item.record == record;
            })[0];
        },

        setItemRecord : function(item, record) {
            if (item.setRecord) {
                item.setRecord(record);
            } else {
                item.record = record;
            }
        },

        createRecordItem : function(record) {
            throw new Error('Abstract method call');
        },

        addRecordItem : function(item) {
            return this.add(item);
        },

        updateRecordItem : function(record) {
            var item = this.getItemByRecord(record);

            if (!item) {
                item = this.createRecordItem(record);

                if (item) {
                    item = this.addRecordItem(item, record);
                }
            }

            if (item) {
                this.setItemRecord(item, record);
            }
        },

        removeRecordItem : function(record) {
            var item = this.getItemByRecord(record);

            if (item) {
                item.destroy();
            }

            return item;
        },

        removeRecordItems : function() {
            var me = this,
                items = me.getRecordItems();

            Ext.each(items, function(item) {
                item.destroy();
            }, me);
        },

        syncRecords : function(records) {
            Ext.suspendLayouts();
            Ext.each(records, this.updateRecordItem, this);
            Ext.resumeLayouts(true);
        },

        handleStoreAdd : function(store, records) {
            this.syncRecords(records);
        },

        handleStoreUpdate : function(store, records) {
            this.syncRecords(records);
        },

        handleStoreRemove : function(store, records) {
            Ext.suspendLayouts();
            Ext.each(records, this.removeRecordItem, this);
            Ext.resumeLayouts(true);
        },

        handleStoreLoad : function(store, records) {
            this.removeRecordItems();
            this.syncRecords(records);
        },

        handleStoreRefresh : function(store) {
            this.handleStoreLoad(store, store.getRange());
        },

        /**
         * @overrides
         */
        getStoreListeners : function() {
            return {
                load : this.handleStoreLoad,
                refresh : this.handleStoreRefresh,
                add : this.handleStoreAdd,
                update : this.handleStoreUpdate,
                remove : this.handleStoreRemove
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
                me.storeRelayers = me.relayEvents(
                    store,
                    Ext.Object.getKeys(this.getStoreListeners()),
                    'store'
                );

                me.handleStoreRefresh(store);
            }
        },

        init : function() {
            var me = this;

            if (me.store) {
                me.bindStore(me.store, true);
            }
        }

    };

});

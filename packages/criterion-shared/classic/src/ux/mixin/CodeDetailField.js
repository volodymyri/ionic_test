Ext.define('criterion.ux.mixin.CodeDetailField', function() {

    return {

        mixinId : 'codeDetailField',

        config : {
            filterValues : null,
            allowSetDefault : true,
            uniqByField : null // get a list of unique values by field
        },

        handleCodeDataStoreDataChanged : function(codeDataStore) {
            var me = this,
                records = codeDataStore.getRange();

            me.loadStoreData(records);

            if (me.sortByDisplayField) {
                this.applyDefaultSorter();
            }

            if (me.getUniqByField()) {
                me.uniqueByField(me.getUniqByField());
            }

            Ext.Function.defer(me.setInitValue, 100, me);

            me.fireEvent('datachange', me);
        },

        loadStoreData : function(records) {
            var store = this.getStore();

            store.loadData(records);
        },

        initCodeDataStore : function() {
            var me = this,
                codeDataStore;

            codeDataStore = criterion.CodeDataManager.getStore(me.getCodeDataId());
            if (!codeDataStore.isLoaded() && !codeDataStore.isLoading()) {
                criterion.CodeDataManager.load([
                    me.getCodeDataId()
                ])
                    .then(function() {
                        me.fireEvent('codedetailsLoaded');
                    });
            } else if (codeDataStore.isLoaded()) {
                me.fireEvent('codedetailsLoaded');
            }

            me.mon(codeDataStore, 'datachanged', function() {
                me.handleCodeDataStoreDataChanged(codeDataStore);
            }, me);

            if (codeDataStore.getCount()) {
                me.handleCodeDataStoreDataChanged(codeDataStore);
            }
        },

        getRawForNonActiveValue : function(value) {
            var me = this,
                codeDataStore,
                rec;

            codeDataStore = criterion.CodeDataManager.getStore(me.getCodeDataId());
            rec = codeDataStore.getById(value);

            return rec ? (!rec.get('isActive') ? rec.get(me.displayField) : '') : '';
        },

        setInitValue : function() {
            var me = this,
                defRec,
                naRaw;

            if (!me.getStore()) {
                return;
            }

            if (!Ext.isEmpty(me.getValue())) {
                naRaw = me.getRawForNonActiveValue(me.getValue());
                me.setValue(me.getValue());
                if (naRaw) {
                    // me.setRawValue(naRaw);
                    me.setValue(null);
                }

            } else if (me.valueCode) {
                me.setValue(criterion.CodeDataManager.getCodeDetailRecord('code', me.valueCode, me.getCodeDataId()).getId());
            } else if (me.getAllowSetDefault()) {
                defRec = criterion.CodeDataManager.getCodeDetailRecord('isDefault', true, me.getCodeDataId());
                if (defRec) {
                    me.setValue(defRec.getId());
                }
            }
        },

        /**
         * @param {} value
         * {
         *    attribute : 'attribute1',
         *    value : 'true',
         *    strict : true
         * }
         */
        setFilterValues : function(value) {
            var store = this.getStore();

            store.clearFilter();

            if (value && value.attribute) {
                store.filterBy(function(record) {
                    var attributeValue = record.get(value.attribute);

                    return !value.strict ? (value.value === null || !attributeValue || attributeValue == value.value) : attributeValue === value.value;
                });
            }
        },

        setFilterByCodes : function(codes) {
            var store = this.getStore();

            store.clearFilter();
            if (codes && Ext.isArray(codes) && codes.length) {
                store.filterBy(function(record) {
                    var codeValue = record.get('code');

                    return Ext.Array.indexOf(codes, codeValue) !== -1;
                });
            }
        },

        uniqueByField : function(field) {
            let store = this.getStore(),
                map = {};

            store.each(rec => {
                if (!map[rec.get(field)]) {
                    map[rec.get(field)] = rec.getId();
                }
            });

            store.clearFilter();
            store.setFilters({
                property : 'id',
                value : Ext.Object.getValues(map),
                operator : 'in'
            });
        }
    };

});

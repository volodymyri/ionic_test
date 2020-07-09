Ext.define('criterion.ux.form.field.EmployerLabelsComboBox', function() {

    var DICT = criterion.consts.Dict;

    return {

        alias : 'widget.criterion_employer_labels_combobox',

        extend : 'Ext.form.field.Tag',

        requires : [
            'Ext.data.StoreManager',
            'criterion.store.codeTable.Details'
        ],

        config : {
            allowBlank : true
        },

        fieldLabel : i18n.gettext('System Labels'),

        store : {
            type : 'criterion_code_table_details'
        },

        displayField : 'description',
        valueField : 'id',
        editable : false,
        emptyText : i18n.gettext('Not selected'),
        queryMode : 'local',
        minHeight : 36,

        valuesStore : null,

        setValuesStore : function(valuesStore) {
            this.valuesStore = valuesStore;

            if (valuesStore.isLoaded()) {
                this.handleValuesStoreDataLoad();
            } else {
                this.mon(valuesStore, 'load', this.handleValuesStoreDataLoad, this);
            }
        },

        getValuesStore : function() {
            return this.valuesStore;
        },

        handleValuesStoreDataLoad : function() {
            var values = [];

            if (!this.valuesStore) {
                return;
            }

            this.valuesStore.each(function(rec) {
                values.push(rec.get('labelCd'));
            });

            if (values.length) {
                this.setValue(values);
                this.resetOriginalValue();
            }
        },

        loadValuesForRecord : function(record) {
            var params = {},
                dfd = Ext.create('Ext.Deferred');

            this.reset();

            if (record.phantom) {
                this.valuesStore.setData([], false);
                dfd.resolve();

                return dfd.promise
            }

            params[this.objectParam] = record.getId();

            if (this.valuesStore) {
                return this.valuesStore.loadWithPromise({
                    params : params
                });
            }

            dfd.resolve();

            return dfd.promise
        },

        saveValuesForRecord : function(record) {
            var me = this,
                labelsCdValues = this.getValue(),
                objectId = record.getId(),
                forRemove = [],
                presentValues = [],
                newValues,
                dfd;

            if (!this.valuesStore) {
                dfd = Ext.create('Ext.Deferred');
                dfd.resolve();

                return dfd.promise;
            }

            this.valuesStore.each(function(rec) {
                if (Ext.Array.indexOf(labelsCdValues, rec.getId()) !== -1) {
                    presentValues.push(rec.get('labelCd'));
                } else {
                    forRemove.push(rec);
                }
            });

            if (forRemove.length) {
                this.valuesStore.remove(forRemove);
            }

            newValues = Ext.Array.difference(labelsCdValues, presentValues);
            if (newValues.length) {
                Ext.Array.each(newValues, function(labelCd) {
                    var value = {
                        labelCd : labelCd
                    };
                    value[me.objectParam] = objectId;

                    me.valuesStore.add(value);
                });
            }

            return this.valuesStore.syncWithPromise();
        },

        /**
         * Called when the internal {@link #store}'s data has changed.
         */
        onStoreDataChanged : function(store) {
            var me = this,
                initialConfig = me.getInitialConfig(),
                value = me.getValue();

            if (value || value === 0) {
                me.setValue(value);
            }

            if (me.getValue() === null) {
                if (me.cachedValue || me.cachedValue === 0) {
                    me.setValue(me.cachedValue);
                    me.cachedValue = null;
                } else if (initialConfig.hasOwnProperty('value')) {
                    me.setValue(initialConfig.value);
                }

                if (me.getValue() === null && me.getAutoSelect()) {
                    if (store.getCount() > 0) {
                        me.setValue(store.getAt(0));
                    }
                }
            }
        },

        handleCodeDataStoreDataChanged : function(codeDataStore) {
            var me = this,
                records,
                store = this.getStore();

            records = Ext.Array.filter(codeDataStore.getRange(), function(rec) {
                return rec.get('isActive');
            });

            if (me.sortByDisplayField) {
                this.applyDefaultSorter();
            }

            store.loadData(records);

            Ext.defer(function() {
                me.onStoreDataChanged(store);
            }, 100)
        },

        initCodeDataStore : function() {
            var me = this,
                codeDataStore;

            codeDataStore = criterion.CodeDataManager.getStore(DICT.LABEL);
            if (!codeDataStore.isLoaded() && !codeDataStore.isLoading()) {
                criterion.CodeDataManager.load([DICT.LABEL])
                    .then(function() {
                        if (me.valueCode) {
                            me.setValue(criterion.CodeDataManager.getCodeDetailRecord('code', me.valueCode, DICT.LABEL));
                        }
                    });
            }

            me.mon(codeDataStore, 'datachanged', function() {
                me.handleCodeDataStoreDataChanged(codeDataStore);
            }, me);

            if (codeDataStore.getCount()) {
                me.handleCodeDataStoreDataChanged(codeDataStore);
            }
        },

        constructor : function() {
            this.callParent(arguments);
            this.initCodeDataStore();
        }

    }
});

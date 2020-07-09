Ext.define('criterion.ux.field.CodeDetailMulty', function() {

    return {

        alias : 'widget.criterion_code_detail_multy',

        extend : 'Ext.form.FieldSet',

        requires : [
            'Ext.data.Store',
            'Ext.data.StoreManager',
            'criterion.store.codeTable.Details'
        ],

        config : {

            value : [],

            readOnly : false,

            label : null,

            /**
             * @cfg {String/Number} valueField The underlying {@link Ext.data.Field#name data value name} (or numeric Array index) to bind to this
             * Select control.
             * @accessor
             */
            valueField : 'id',

            /**
             * @cfg {String/Number} displayField The underlying {@link Ext.data.Field#name data value name} (or numeric Array index) to bind to this
             * Select control. This resolved value is the visibly rendered value of the available selection options.
             * @accessor
             */
            displayField : 'description',

            /**
             * @cfg {Ext.data.Store/Object/String} store The store to provide selection options data.
             * Either a Store instance, configuration object or store ID.
             * @accessor
             */
            store : {
                type : 'criterion_code_table_details'
            },

            /**
             * @cfg {Boolean} autoSelect
             * `true` to auto select the first value in the {@link #store} or {@link #options} when they are changed. Only happens when
             * the {@link #value} is set to `null`.
             */
            autoSelect : true
        },

        classCls : 'criterion_code_detail_multy',

        viewModel : {
            data : {
                title : null,
                values : {}
            }
        },

        bind : {
            title : '{title}'
        },

        codeDataId : null,

        getCodeDataId : function() {
            return this.codeDataId;
        },

        applyLabel : function(label) {
            this.getViewModel().set('title', label);
        },

        setLabel : function(label) {
            this.getViewModel().set('title', label);
            this.callParent(arguments);
        },

        applyReadOnly : function(readOnly) {
            this.getViewModel().set('readOnly', readOnly);
        },

        setReadOnly : function(readOnly) {
            this.getViewModel().set('readOnly', readOnly);
            this.callParent(arguments);
        },

        setValue : function(value) {
            var vm = this.getViewModel(),
                values = {};

            if (Ext.isArray(value)) {
                Ext.Array.each(value, function(val) {
                    values[val] = true;
                });

                vm.set('values', values);
            }

            this.callParent(arguments);
        },

        // is not need now
        //getValue : function() {
        //    var all_vals = this.getViewModel().get('values'),
        //        vals = {};
        //
        //    // filter checked
        //    Ext.each(all_vals, function(key, value) {
        //        if (value) {
        //            vals[key] = value;
        //        }
        //    });
        //
        //    return Ext.Array.map(Ext.Object.getKeys(vals), function(val) {
        //        return parseInt(val, 10);
        //    });
        //},

        applyStore : function(store) {
            if (store === true) {
                store = Ext.create('Ext.data.Store', {
                    fields : [this.getValueField(), this.getDisplayField()],
                    autoDestroy : true
                });
            }

            if (store) {
                store = Ext.data.StoreManager.lookup(store);
            }

            return store;
        },

        updateStore : function(store, oldStore) {
            var me = this;

            if (oldStore && oldStore.getAutoDestroy()) {
                oldStore.destroy();
            }

            if (store) {
                store.on({
                    scope : this,
                    add : 'onStoreDataChanged',
                    remove : 'onStoreDataChanged',
                    update : 'onStoreDataChanged',
                    refresh : 'onStoreDataChanged'
                });
                me.onStoreDataChanged(store);
            }
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

            me.renderItems(records);

            Ext.defer(function() {
                me.onStoreDataChanged(store);
            }, 100)
        },

        renderItems : function(records) {
            var me = this;

            Ext.Array.each(records, function(rec) {
                var label = rec.get(me.getDisplayField()),
                    value = parseInt(rec.get(me.getValueField()), 10);

                me.add({
                    xtype : 'checkboxfield',
                    labelWidth : '90%',
                    bodyAlign : 'end',
                    label : label,
                    bind : {
                        checked : '{values.' + value + '}',
                        disabled : '{readOnly}'
                    }
                });
            });
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
                        if (me.valueCode) {
                            me.setValue(criterion.CodeDataManager.getCodeDetailRecord('code', me.valueCode, me.getCodeDataId()));
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

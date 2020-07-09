Ext.define('criterion.ux.field.Combobox', function() {

    return {

        alias : 'widget.criterion_combobox',

        extend : 'Ext.field.Select',

        config : {
            /**
             * @cfg {String} [valueNotFoundText]
             * When using a name/value combo, if the value passed to setValue is not found in the store, valueNotFoundText will
             * be displayed as the field text if defined. If this default text is used, it means there
             * is no value set and no validation will occur on this field.
             */
            valueNotFoundText : null,

            resetOnFilterChange : false,

            picker : 'floated'
        },

        clearable : true,
        triggers : {
            clear: {
                type: 'clear'
            }
        },

        sortByDisplayField : true,

        publishes : {
            selection : 1,
            value : 1
        },

        expand : function() {
            if (!this.expanded && !this.getDisabled() && !this.getReadOnly()) {
                this.showPicker();
            }
        },

        applyValueNotFoundText : function(v) {
            var me = this,
                valueNotFoundRecord = me.valueNotFoundRecord || (me.valueNotFoundRecord = new Ext.data.Model()),
                valueField = me.getValueField(),
                displayField = me.getDisplayField();

            valueNotFoundRecord.set(displayField, v);
            if (valueField && displayField !== valueField) {
                valueNotFoundRecord.set(valueField, v);
            }

            return v;
        },

        updateValue : function(value, oldValue) {
            this.syncValue();

            // Note that we must not invoke superclass updateValue because that updates the
            // field UI in ways that SelectFields cannot handle.
            // We must directly invoke the base class's updateValue. That fires the change
            // event and validates the value which we still need to happen.
            Ext.field.Field.prototype.updateValue.call(this, value, oldValue);

            this.publishState('value', value);

            // for support value not found fallback
            if (this.valueNotFoundRecord && value && !this.findRecordByValue(value)) {
                this.setSelection(this.valueNotFoundRecord);
            }
        },

        constructor : function(config) {
            this.updateValue = Ext.Function.createBuffered(this.updateValue, 100, this);

            this.callParent([config]);
        },

        setStore : function() {
            var store;

            this.callParent(arguments);

            store = this.getStore();
            if (store && this.sortByDisplayField) {
                store.on('load', this.applyDefaultSorter, this, {single : true});
            }
        },

        applyDefaultSorter : function() {
            var store = this.getStore(),
                displayField = this.getDisplayField(),
                sorters = store && store.getSorters();

            if (sorters && !sorters.count()) {
                store.sort({
                    property : displayField,
                    direction : 'ASC'
                });
            }
        },

        showPicker : function() {
            var picker;

            this.fireEvent('beforeshowpicker', this);

            this.callParent(arguments);

            picker = this.getPicker();

            if (picker) {
                picker.on('hide', function() {
                    this.fireEvent('hidepicker', this);
                }, this, {single : true});
            }
        },

        setFilters : function(filters) {
            const me = this,
                store = this.getStore();

            if (store) {
                store.clearFilter();
                store.setFilters(filters);

                if (me.getResetOnFilterChange()) {
                    if (store.findExact(me.getValueField(), me.getValue()) === -1) {
                        me.reset();
                    }
                }
            }
        }

    };

});


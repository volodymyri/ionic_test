Ext.define('criterion.ux.form.field.Tag', function() {

    return {

        alias : 'widget.criterion_tagfield',

        extend : 'Ext.form.field.Tag',

        config : {
            /**
             * Store to be populated from selection.
             */
            valuesStore : null,
            /**
             * Field to link store and valueStore.
             */
            linkField : ''
        },

        blockValueInput : false, // for blocking input but leave interactions

        editable : true,
        emptyText : i18n.gettext('Not selected'),
        queryMode : 'local',
        minHeight : 36,

        afterRender : function() {
            let me = this,
                inputEl = me.inputEl;

            if (me.blockValueInput && inputEl) {
                inputEl.dom.setAttribute('readonly', 'true');
            }

            me.callParent();
        },

        initComponent : function() {
            this.callParent(arguments);
            this.on('change', this.syncValuesStore, this);

            this.syncValuesStore();
        },

        updateValuesStore : function(valuesStore) {
            this.handleValuesStoreDataLoad(valuesStore);
            this.mon(valuesStore, 'load', this.handleValuesStoreDataLoad, this);
        },

        /**
         * Sync field value to loaded values store
         * @private
         */
        handleValuesStoreDataLoad : function(store) {
            var values = [],
                currentValue = this.valueCollection && this.getValue();

            store.each(function(rec) {
                values.push(rec.get(this.getLinkField()));
            }, this);

            if (values.length) {
                this.setValue(values);
                this.resetOriginalValue();
            } else if (currentValue && currentValue.length){
                this.syncValuesStore();
            }
        },

        /**
         * Sync values store to field value
         * @private
         */
        syncValuesStore : function() {
            var me = this,
                selectedValues = this.getValue(),
                valuesStore = this.getValuesStore(),
                linkField = me.getLinkField(),
                forRemove = [],
                presentValues = [],
                newValues;

            if (!valuesStore) {
                return;
            }

            valuesStore.each(function(rec) {
                if (Ext.Array.indexOf(selectedValues, rec.get(linkField)) !== -1) {
                    presentValues.push(rec.get(linkField));
                } else {
                    forRemove.push(rec);
                }
            });

            if (forRemove.length) {
                valuesStore.remove(forRemove);
            }

            newValues = Ext.Array.difference(selectedValues, presentValues);

            if (newValues.length) {
                Ext.Array.each(newValues, function(selectedRecordId) {
                    var value = {};
                    value[linkField] = selectedRecordId;

                    me.getValuesStore().add(value);
                });
            }
        }
    }
});

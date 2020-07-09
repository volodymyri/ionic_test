Ext.define('criterion.ux.form.field.ExtendedComboBox', function() {

    return {

        alias : [
            'widget.extended_combobox',
            'widget.extended_combo'
        ],

        extend : 'Ext.form.field.ComboBox',

        config : {
            nullValueText : i18n.gettext('Not selected'),
            allowBlank : false
        },

        forceSelection : true,

        nullRecord : null,

        bindStore : function(store) {
            var compStore;

            this.callParent(arguments);
            if (!store) {
                return;
            }
            compStore = this.getStore();

            if (compStore.getCount()) {
                this.handleStoreDataLoad(compStore);
            }
            this.mon(compStore, 'load', this.handleStoreDataLoad, this);
        },

        handleStoreDataLoad : function(store) {
            var me = this,
                records = store.getRange(),
                value = this.getValue(),
                oVal,
                item = {};

            if (this.allowBlank) {
                if (store.find('isBlank', true) < 0) {
                    item['isBlank'] = true;
                    item[this.valueField] = null;
                    item[this.displayField] = this.emptyText || this.nullValueText;
                    item['autoGroup'] = 0;

                    if (me.sortByDisplayField) {
                        Ext.Array.each(records, function(rec) {
                            rec.set('autoGroup', 1, {
                                dirty : false,
                                silent : true
                            })
                        });
                        me.store.group('autoGroup', 'ASC');
                    }

                    records.unshift(item);
                    me.store.loadData(records);
                }

                this.nullRecord = store.getAt(0) || null;
                if (!value) {
                    oVal = me.getStore().getAt(0);
                    if (oVal && this.forceSelection) {
                        me.setValue(oVal.get(this.valueField));
                        me.originalValue = oVal.get(this.valueField);
                    }
                }
            } else {
                if (!value) {
                    oVal = me.getStore().getAt(0);
                    if (oVal && this.forceSelection) {
                        me.setValue(oVal.get(this.valueField));
                        me.originalValue = oVal.get(this.valueField);
                    }
                }
            }
        },

        getValue : function() {
            var me = this,
                value = this.store && this.callParent(arguments);

            if (me.nullRecord && value < 0) {
                value = null;
            }

            return value;
        },

        setValue : function(value) {
            var me = this;

            if (me.nullRecord && value === null) {
                value = me.nullRecord.get(this.valueField);
            }

            return me.callParent([value]);
        }
    }
});

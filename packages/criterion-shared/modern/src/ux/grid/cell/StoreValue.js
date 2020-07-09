Ext.define('criterion.ux.grid.cell.StoreValue', {
    extend : 'Ext.grid.cell.Text',
    xtype : 'storevalue',

    config : {
        store : null,
        valueField : 'id',
        fieldName : 'name',
        valueNotFoundTpl : null
    },

    __store : null,

    applyStore : function(store) {
        this.writeValue(store);
        this.__store = store;
    },

    updateValue : function() {
        if (this.__store) {
            this.writeValue(this.__store);
        }
        this.callParent(arguments);
    },

    writeValue : function(store) {
        var value = this.getValue(),
            record;

        if (store && value) {
            record = store.findRecord(this.getValueField(), value, 0, false, false, true);
            if (record) {
                this.setRawValue(record.get(this.getFieldName()));
            } else {
                this.setRawValue(this.getValueNotFoundText());
            }
        }
    },

    applyValueNotFoundTpl : function(tpl) {
        if (tpl && !tpl.isTemplate) {
            tpl = new Ext.XTemplate(tpl);
        }
        return tpl;
    },

    updateValueNotFoundTpl : function() {
        if (this.__store) {
            this.writeValue(this.__store);
        }
    },

    getValueNotFoundText : function() {
        var tpl = this.getValueNotFoundTpl();
        if (tpl) {
            var record = this.getRecord();
            return record ? tpl.apply(record.data) : '';
        } else {
            return '';
        }
    }
});

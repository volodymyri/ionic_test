Ext.define('criterion.ux.grid.cell.CodeData', {
    extend : 'Ext.grid.cell.Text',
    xtype : 'codetabledetailcell',

    config : {

        store : null,

        unselectedText : i18n.gettext('<unselected>'),

        codeDataDisplayField : 'description',

        /**
         * @cfg {String} undefinedText
         * The string to display when the column value is `undefined`.
         */
        undefinedText : ''
    },

    updateColumn : function(column, oldColumn) {
        this.callParent([column, oldColumn]);

        if (column) {
            var text,
                store;

            store = column.getStore();
            if (store !== null) {
                this.setStore(store);
            }

            text = column.getUnselectedText();
            if (text !== null) {
                this.setUnselectedText(text);
            }

            text = column.getCodeDataDisplayField();
            if (text !== null) {
                this.setCodeDataDisplayField(text);
            }

            text = column.getUndefinedText();
            if (text !== null) {
                this.setUndefinedText(text);
            }
        }
    },

    updateUnselectedText : function() {
        if (!this.isConfiguring) {
            this.writeValue();
        }
    },

    updateCodeDataDisplayField : function() {
        if (!this.isConfiguring) {
            this.writeValue();
        }
    },

    updateUndefinedText : function() {
        if (!this.isConfiguring) {
            this.writeValue();
        }
    },

    writeValue : function() {
        var me = this,
            record,
            value = me.getValue();

        if (value === undefined) {
            value = me.getUndefinedText();
        } else {
            record = this.getStore().getById(value);
            value = record ? record.get(this.getCodeDataDisplayField()) : this.getUnselectedText();
        }

        me.setRawValue(value);
    }
});


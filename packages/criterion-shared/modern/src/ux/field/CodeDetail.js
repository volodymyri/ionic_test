Ext.define('criterion.ux.field.CodeDetail', function() {

    return {

        alias : 'widget.criterion_code_detail_select',

        extend : 'criterion.ux.field.Combobox',

        requires : [
            'criterion.store.codeTable.Details'
        ],

        valueField : 'id',

        displayField : 'description',

        store : {
            type : 'criterion_code_table_details'
        },

        nullRecord : null,

        isCodeDataOwner : true,

        codeDataId : null,

        codeDataDisplayField : 'description',

        autoSelect : false,

        getCodeDataId : function() {
            return this.codeDataId;
        },

        getDisplayField : function() {
            return this.codeDataDisplayField;
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
            me.onStoreDataChanged(store);
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

        constructor : function(config) {
            if (config.allowBlank) {
                config.clearable = true;
            }

            this.callParent(arguments);
            this.initCodeDataStore();
        }
    };

});

Ext.define('criterion.data.field.CodeData', function() {

    return {

        alias : [
            'data.field.criterion_codedata'
        ],

        extend : 'Ext.data.field.Integer',

        requires : [],

        codeDataId : null,

        defaultValue : null,

        constructor : function(config) {
            this.callParent(arguments);

            var store = this.getStore();

            store.on('datachanged', this.handleDataChanged, this);

            if (store.getCount()) {
                this.handleDataChanged();
            }
        },

        handleDataChanged : function() {
            var defaultRecord = this.getStore().findRecord('isDefault', true);
            this.defaultValue = defaultRecord ? defaultRecord.getId() : null
        },

        getCodeDataId : function() {
            return this.codeDataId;
        },

        getStore : function() {
            return criterion.CodeDataManager.getStore(this.getCodeDataId());
        },

        convert : function(v) {
            return (typeof v == 'number') ? parseInt(v, 10) : null;
        }
    };

});

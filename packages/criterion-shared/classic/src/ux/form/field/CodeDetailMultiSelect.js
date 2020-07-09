Ext.define('criterion.ux.form.field.CodeDetailMultiSelect', function() {

    return {
        alias : 'widget.criterion_code_detail_field_multi_select',

        extend : 'Ext.form.field.Tag',

        mixins : [
            'criterion.ux.mixin.CodeDataOwner',
            'criterion.ux.mixin.CodeDetailField'
        ],

        requires : [
            'criterion.store.codeTable.Details'
        ],

        config : {
            filterValues : null,
            allowBlank : true
        },

        valueField : 'id',

        displayField : 'description',

        forceSelection : true,

        autoSelect : true,

        editable : true,

        queryMode : 'local',

        store : {
            type : 'criterion_code_table_details'
        },

        initComponent : function() {
            var initialValue;

            if (this.allowBlank) {
                this.editable = true;
            }

            this.callParent(arguments);
            this.initCodeDataStore();
            initialValue = this.value;

            if (this.getValue() !== initialValue) {
                // hack to set initial data; warning - it won't help if c0de table data isn't loaded yet
                this.setValue(initialValue);
            }
        }
    };

});

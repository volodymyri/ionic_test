Ext.define('criterion.ux.form.field.CodeDetail', function() {

    return {
        alias : 'widget.criterion_code_detail_field',

        extend : 'Ext.form.field.ComboBox',

        mixins : [
            'criterion.ux.mixin.CodeDataOwner',
            'criterion.ux.mixin.CodeDetailField'
        ],

        requires : [
            'criterion.store.codeTable.Details'
        ],

        config : {
            allowBlank : true,
            nullValueText : null
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

        nullRecord : null,

        encodeHtml : true,

        getValue : function() {
            var me = this,
                value = this.callParent(arguments);

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
        },

        loadStoreData : function(records) {
            var me = this,
                store = this.getStore();

            records = Ext.Array.filter(records, this.filterFn, this);

            if (me.allowBlank && me.nullValueText) {
                var nullItem = {};

                nullItem[me.valueField] = null;
                nullItem[me.displayField] = me.nullValueText;
                nullItem['isActive'] = true;

                records.unshift(nullItem);
            }

            store.loadData(records);

            if (me.allowBlank && me.nullValueText) {
                me.nullRecord = store.findRecord(me.displayField, me.nullValueText);
            }
        },

        /**
         * Ext.Array.filter
         * @returns {boolean}
         */
        filterFn : function(item, index) {
            return true;
        },

        setInitValue : function() {
            var me = this;

            me.mixins.codeDetailField.setInitValue.call(me);

            if (me.nullRecord && Ext.isEmpty(me.getValue())) {
                var value = me.nullRecord.get(this.valueField);
                me.setValue(value);
            }
        },

        initComponent : function() {
            var initialValue;

            if (this.allowBlank && !this.nullValueText) {
                this.editable = true;
            }

            this.tpl = this.tpl || Ext.create('Ext.XTemplate',
                    '<ul class="x-list-plain">',
                      '<tpl for=".">',
                        '<li role="option" class="x-boundlist-item item-enab-{isActive}">{' + this.displayField + (this.encodeHtml ? ':htmlEncode' : '') + '}</li>',
                      '</tpl>',
                    '</ul>'
                );

            this.callParent(arguments);
            this.initCodeDataStore();
            initialValue = this.value;

            if (this.getValue() != initialValue) {
                // hack to set initial data; warning - it won't help if c0de table data isn't loaded yet
                this.setValue(initialValue);
            }
        },

        getErrors : function(value) {
            var errors = this.callParent(arguments),
                checkActive = true,
                v;

            this.getValue() && (v = this.getStore().getById(this.getValue()));
            v && (checkActive = v.get('isActive'));
            if (!checkActive) {
                errors.push(i18n.gettext('You can\'t use this value'));
            }

            return errors;
        },

        applyDefaultSorter : function() {
            if (this.allowBlank && this.nullValueText) {
                var nullRecord = this.store.findRecord(this.displayField, this.nullValueText);

                if (nullRecord) {
                    var sorters = this.store.getSorters();

                    nullRecord.set('isDefault', true);

                    if (sorters && !sorters.count()) {
                        this.store.sort([
                            {
                                property : 'isDefault',
                                direction : 'DESC'
                            },
                            {
                                property : this.displayField,
                                direction : 'ASC'
                            }
                        ]);
                    }
                }
            } else {
                this.callParent(arguments);
            }
        }
    };

});

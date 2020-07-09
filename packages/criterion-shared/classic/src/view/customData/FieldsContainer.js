Ext.define('criterion.view.customData.FieldsContainer', function() {

    return {
        alias : 'widget.criterion_customdata_fieldscontainer',

        extend : 'Ext.container.Container',

        mixins : [
            'criterion.ux.mixin.Component',
            'criterion.ux.mixin.RecordsHolder'
        ],

        requires : [
            'criterion.store.CustomData',
            'criterion.view.customData.Field'
        ],

        config : {
            /**
             * @cfg {Number} numColumns
             */
            numColumns : 2,

            /**
             * @cfg {Number} numColumns
             */
            entityTypeCd : undefined,

            entityTypeCode : undefined,

            labelWidth : null,

            isResponsive : true,

            readOnly : false
        },

        store : {
            type : 'criterion_customdata'
        },

        layout : 'hbox',

        defaultType : 'container',

        defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM,

        getRecordItems : function() {
            return this.query('criterion_customdata_field');
        },

        addRecordItem : function(item, record) {
            var me = this,
                index = me.getStore().indexOf(record),
                column = me.down('#column' + (index % this.getNumColumns()));

            if (index < 0) {
                return
            }

            item['margin'] = '0 0 20 0';

            return column.add(item);
        },

        createRecordItem : function() {
            return {
                xtype : 'criterion_customdata_field',
                labelWidth : this.getLabelWidth(),
                readOnly : this.getReadOnly()
            };
        },

        initComponent : function() {
            var me = this,
                column;

            me.items = [];
            for (var i = 0; i < this.getNumColumns(); i++) {
                column = {
                    itemId : 'column' + i
                };
                me.items.push(column);
            }

            if (this.getIsResponsive()) {
                this.plugins = [
                    'criterion_responsive_column'
                ];
            }

            me.callParent(arguments);
            me.mixins.recordsholder.init.call(me);
        },

        setReadOnly : function(value) {
            this.items && this.items.items && Ext.Array.each(this.getRecordItems(), function(field) {
                field.setReadOnly(value);
            });

            this.callParent(arguments);
        }
    };
});

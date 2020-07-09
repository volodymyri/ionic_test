Ext.define('criterion.view.CustomFields', function() {

    var DICT = criterion.consts.Dict;

    return {
        alias : 'widget.criterion_customfields',

        extend : 'criterion.ux.Panel',

        mixins : [
            'criterion.ux.mixin.RecordsHolder'
        ],

        requires : [
            'criterion.controller.CustomFields',
            'criterion.store.customField.Values',
            'criterion.view.customData.FieldsContainer'
        ],

        config : {
            /**
             * @cfg {Number} numColumns
             */
            numColumns : 2,

            /**
             * @cfg {String} entityTypeCode
             *
             * Code of entity.
             */
            entityTypeCode : undefined,

            /**
             * @cfg {Number} entityTypeCd
             */
            entityTypeCd : undefined,

            customFieldStore : undefined,

            labelWidth : null,

            isResponsive : true,

            readOnly : false
        },

        controller : {
            type : 'criterion_customfields'
        },

        listeners : {
            scope : 'controller',
            show : 'handleShow'
        },

        store : {
            type : 'criterion_customdata_values',
            autoSync : false
        },

        layout : 'fit',

        getRecordItems : function() {
            return this.query('criterion_customdata_field');
        },

        items : [],

        getItemByRecord : function(record) {
            var customFieldId = record.get('customFieldId');

            return this.getItemByCustomFieldId(customFieldId);
        },

        getItemByCustomFieldId : function(customFieldId) {
            return Ext.Array.filter(this.getRecordItems(), function(item) {
                return item.getCustomFieldId() == customFieldId;
            })[0];
        },

        setItemRecord : function(item, record) {
            item.setValue(record.get('value'));
            item.resetOriginalValue();
        },

        createRecordItem : function(record) {
        },

        addRecordItem : function(item) {
        },

        removeRecordItem : function(record) {
        },

        removeRecordItems : function() {
            if (this.destroyed) {
                return;
            }

            var me = this,
                items = me.getRecordItems();

            Ext.each(items, function(item) {
                item.setValue();
            }, me);
        },

        syncRecords : function(records) {
            this.mixins.recordsholder.syncRecords.call(this, records);
        },

        updateRecord : function(item) {
            var store = this.getStore(),
                customFieldId = item.getCustomFieldId(),
                record = store.findRecord('customFieldId', customFieldId, 0, false, false, true),
                isNotEmpty,
                value = item.getValue();

            switch (item.getDataType()) {
                case criterion.Consts.DATA_TYPE.CHECKBOX:
                    isNotEmpty = !!item.getField().getValue();
                    break;
                default:
                    isNotEmpty = !Ext.isEmpty(item.getField().getValue());
                    break;
            }

            if (!record && isNotEmpty) {
                if (Ext.isDate(value)) {
                    // convert date value to DATE_FORMAT
                    value = Ext.Date.format(value, criterion.consts.Api.DATE_FORMAT);
                }

                this.addRecord({
                    customFieldId : customFieldId,
                    customField : item.getRecord().getData(),
                    value : value
                });
            } else if (record && !isNotEmpty) {
                this.removeRecord(record);
            } else if (record && isNotEmpty) {
                if (Ext.isDate(value)) {
                    // convert date value to DATE_FORMAT
                    value = Ext.Date.format(value, criterion.consts.Api.DATE_FORMAT);
                }
                record.set('value', value);
            }
        },

        updateStore : function() {
            Ext.each(this.getRecordItems(), this.updateRecord, this);
        },

        getFieldsValues : function() {
            var vals = [];

            Ext.each(this.getRecordItems(), function(item) {
                vals.push(
                    {
                        customFieldId : item.getCustomFieldId(),
                        value : item.getValue()
                    }
                )
            });

            return vals;
        },

        setFieldsValues : function(values) {
            var me = this;

            if (values && Ext.isArray(values)) {
                Ext.each(values, function(val) {
                    var item = me.getItemByCustomFieldId(val.customFieldId);
                    item && item.setValue(val.value);
                });
            }
        },

        getFieldsContainer : function() {
            return this.down('criterion_customdata_fieldscontainer');
        },

        handleCustomDataLoad : function() {
            this.syncRecords(this.getStore().getRange());
        },

        initComponent : function() {
            var me = this;

            me.callParent(arguments);
            me.mixins.recordsholder.init.call(me);

            if (criterion.CodeDataManager.isEmptyStore(DICT.ENTITY_TYPE)) {
                criterion.CodeDataManager.load([DICT.ENTITY_TYPE], function() {
                    me._setFieldsContainer();
                }, this);
            } else {
                me._setFieldsContainer();
            }
        },

        _setFieldsContainer : function() {
            var me = this,
                entityTypeCode = me.getEntityTypeCode(),
                cdRec = criterion.CodeDataManager.getCodeDetailRecord('code', entityTypeCode, DICT.ENTITY_TYPE);

            if (!me.items) {
                console.warn('Items for entityType: ' + entityTypeCode + ' not created!');
                return;
            }

            if (!cdRec) {
                console.warn('Record for entityType: ' + entityTypeCode + ' not found!');
                return;
            }
            me.setEntityTypeCd(cdRec.get('id'));

            me.add(
                {
                    xtype : 'criterion_customdata_fieldscontainer',
                    entityTypeCd : me.getEntityTypeCd(),
                    entityTypeCode : me.getEntityTypeCode(),
                    numColumns : me.getNumColumns(),
                    isResponsive : me.getIsResponsive(),
                    labelWidth : this.getLabelWidth(),
                    readOnly : this.getReadOnly(),
                    listeners : {
                        scope : this,
                        storeload : this.handleCustomDataLoad,
                        storerefresh : this.handleCustomDataLoad
                    }
                }
            );
        },

        setReadOnly : function(value) {
            this.items && this.items.items && Ext.Array.each(this.query('criterion_customdata_fieldscontainer'), function(fieldscontainer) {
                fieldscontainer.setReadOnly(value);
            });

            this.callParent(arguments);
        }
    };
});

Ext.define('criterion.view.customData.Field', function() {

    var DICT = criterion.consts.Dict,
        DATA_TYPE = criterion.Consts.DATA_TYPE;

    return {
        alias : 'widget.criterion_customdata_field',

        extend : 'Ext.container.Container',

        mixins : [
            'Ext.form.field.Field',
            'criterion.ux.mixin.Component'
        ],

        requires : [
            'criterion.view.ux.form.field.CustomFormat'
        ],

        config : {
            record : undefined,
            customFieldId : undefined,
            dataType : null,
            labelWidth : null,
            readOnly : false,
            hideLabel : false
        },

        layout : 'hbox',

        defaults : {
            flex : 1
        },

        getField : function() {
            return this.down('#field');
        },

        createField : function(record) {
            var me = this,
                label = record.get('label') || '',
                isRequired = record.get('isRequired'),
                dataTypeCd = record.get('dataTypeCd'),
                dataType = dataTypeCd && criterion.CodeDataManager.getCodeDetailRecord('id', dataTypeCd, DICT.DATA_TYPE).get('code'),
                field;

            field = {
                itemId : 'field',
                fieldLabel : label,
                hideLabel : this.getHideLabel(),
                allowNull : true,
                labelWidth : this.getLabelWidth() || criterion.Consts.UI_DEFAULTS.LABEL_WIDTH,
                readOnly : this.getReadOnly(),
                allowBlank : !isRequired,
                isDirty : function() {
                    var me = this;
                    return !me.disabled && !me.isEqualAsString(me.getValue(), me.originalValue);
                },
                listeners : {
                    change : (cmp, newValue) => {
                        record.set('value', newValue);
                    }
                }
            };

            this.setDataType(dataType);

            switch (dataType) {
                default:
                case criterion.Consts.DATA_TYPE.TEXT:
                    if (record.get('fieldFormatTypeId')) {
                        field = Ext.apply(field, {
                            xtype : 'criterion_customformatfield',
                            fieldType : record.get('fieldFormatTypeId')
                        });
                    } else {
                        field = Ext.apply(field, {
                            xtype : 'textfield',
                            maxLength : record.get('maximumSize') || Number.MAX_VALUE
                        });
                    }

                    break;

                case criterion.Consts.DATA_TYPE.NUMBER:
                    field = Ext.apply(field, {
                        xtype : 'numberfield',
                        maxLength : record.get('maximumSize') || Number.MAX_VALUE
                    });

                    break;

                case criterion.Consts.DATA_TYPE.DATE:
                    field = Ext.apply(field, {
                        xtype : 'datefield'
                    });

                    break;

                case criterion.Consts.DATA_TYPE.CHECKBOX:
                    field = Ext.apply(field, {
                        xtype : 'toggleslidefield'
                    });

                    break;

                case criterion.Consts.DATA_TYPE.DROPDOWN:
                    field = Ext.apply(field, {
                        xtype : 'criterion_code_detail_field',
                        allowSetDefault : false,
                        codeDataId : criterion.CodeDataManager.getCodeTableNameById(record.get('codeTableId'))
                    });

                    break;

                case criterion.Consts.DATA_TYPE.MEMO:
                    field = Ext.apply(field, {
                        xtype : 'textarea',
                        height : record.get('maximumSize') * 22 || 150,
                        isMemo : true
                    });

                    break;

                case criterion.Consts.DATA_TYPE.CURRENCY:
                    field = Ext.apply(field, {
                        xtype : 'criterion_currencyfield',
                        maxLength : record.get('maximumSize') || Number.MAX_VALUE,
                        validateValue : function(value) {
                            var me = this,
                                errors = value ? me.getErrors(value) : [],
                                isValid = Ext.isEmpty(errors);

                            if (!me.preventMark) {
                                if (isValid) {
                                    me.clearInvalid();
                                } else {
                                    me.markInvalid(errors);
                                }
                            }

                            return isValid;
                        }
                    });

                    break;
            }

            return field;
        },

        updateRecord : function(record) {
            var me = this,
                field = me.getField();

            if (field) {
                me.remove(field);
            }

            me.setCustomFieldId(record.getId());

            field = me.createField(record);

            if (field) {
                field = me.add(field);

                if (field['isMemo']) {
                    me['isMemo'] = true;
                }

                field.initValue();

                record._customField = field;
            }
        },

        getErrors : function() {
            var field = this.getField(),
                errors = [],
                value = this.getValue();

            if (field) {
                errors = value ? field.getErrors(this.getValue()) : [];
            }

            return errors;
        },

        setValue : function(value) {
            var field = this.getField();

            if (field) {
                if (Ext.isString(value)) {
                    switch (this.getDataType()) {
                        case DATA_TYPE.DATE:
                            value = Ext.Date.parse(value, criterion.consts.Api.DATE_FORMAT);
                            break;
                    }
                }

                field.setValue(value);
                // Clear dirty on initial value set
                field.resetOriginalValue();
            }
        },

        getValue : function() {
            var field = this.getField(),
                value;

            if (field) {
                value = field.getValue();
            }

            return value;
        },

        reset : function() {
            var field = this.getField();

            if (field) {
                field.reset();
            }
        },

        isDirty : function() {
            var field = this.getField();

            return field ? field.isDirty() : false;
        },

        setReadOnly : function(value) {
            this.items && this.down().setReadOnly(value);

            this.callParent(arguments);
        }
    };

});

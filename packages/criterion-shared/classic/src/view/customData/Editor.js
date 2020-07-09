Ext.define('criterion.view.customData.Editor', function() {

    const DICT = criterion.consts.Dict,
        DATA_TYPE = criterion.Consts.DATA_TYPE,
        CUSTOMIZABLE_ENTITIES = criterion.Consts.getCustomizableEntities();

    return {
        alias : [
            'widget.criterion_customdata_editor'
        ],

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.view.customData.ListItem',
            'criterion.store.customField.Items',
            'criterion.store.CustomFieldFormats'
        ],

        controller : {
            externalUpdate : false
        },

        title : i18n.gettext('Custom Field Details'),

        bodyPadding : '25 10 10',

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        defaults : criterion.Consts.UI_CONFIG.ONE_COL_FORM,

        viewModel : {
            formulas : {
                showInEssIsHidden : function(get) {
                    return !Ext.Array.contains([CUSTOMIZABLE_ENTITIES.CUSTOMIZABLE_ENTITY_DEMOGRAPHICS.code], get('record.entityTypeCode'));
                },

                isTypeNumber : function(get) {
                    return get('dataTypeCd') && get('dataTypeField.selection.code') === DATA_TYPE.NUMBER;
                },
                isTypeText : function(get) {
                    return get('dataTypeCd') && get('dataTypeField.selection.code') === DATA_TYPE.TEXT;
                },
                isTypeMemo : function(get) {
                    return get('dataTypeCd') && get('dataTypeField.selection.code') === DATA_TYPE.MEMO;
                },
                isTypeCodeTable : function(get) {
                    return get('dataTypeCd') && get('dataTypeField.selection.code') === DATA_TYPE.DROPDOWN;
                },

                hideMaxLength : function(get) {
                    return !get('isPhantom') || !(get('isTypeNumber') || get('isTypeText'));
                }
            }
        },

        items : [
            {
                xtype : 'criterion_code_detail_field',
                codeDataId : DICT.DATA_TYPE,
                fieldLabel : i18n.gettext('Data type'),
                name : 'dataTypeCd',
                reference : 'dataTypeField',
                allowBlank : false,
                bind : {
                    value : '{dataTypeCd}',
                    hidden : '{!isPhantom}'
                }
            },
            {
                xtype : 'textfield',
                fieldLabel : i18n.gettext('Code'),
                name : 'code',
                allowBlank : false
            },
            {
                xtype : 'textfield',
                fieldLabel : i18n.gettext('Label'),
                name : 'label',
                allowBlank : false
            },
            {
                xtype : 'numberfield',
                fieldLabel : i18n.gettext('Max. Length'),
                name : 'maximumSize',
                allowBlank : false,
                minValue : 0,
                hidden : true,
                bind : {
                    hidden : '{hideMaxLength}',
                    disabled : '{hideMaxLength}'
                }
            },
            {
                xtype : 'numberfield',
                fieldLabel : i18n.gettext('Display Lines'),
                name : 'maximumSize',
                allowBlank : false,
                minValue : 5,
                value : 15,
                hidden : true,
                bind : {
                    hidden : '{!isPhantom || !isTypeMemo}',
                    disabled : '{!isTypeMemo}'
                }
            },
            {
                xtype : 'combobox',
                fieldLabel : i18n.gettext('Field Format'),
                store : Ext.StoreManager.lookup(criterion.Consts.GLOBAL_STORES.FIELD_FORMAT_CUSTOM.storeId),
                displayField : 'name',
                valueField : 'id',
                name : 'fieldFormatTypeId',
                allowBlank : true,
                hidden : true,
                forceSelection : true,
                queryMode : 'local',
                bind : {
                    hidden : '{!isPhantom || !isTypeText}',
                    disabled : '{!isTypeText}'
                }
            },
            {
                xtype : 'combobox',
                fieldLabel : i18n.gettext('Code Table'),
                store : criterion.CodeDataManager.getCodeTablesStore(),
                valueField : 'id',
                displayField : 'description',
                name : 'codeTableId',
                allowBlank : false,
                hidden : true,
                forceSelection : true,
                queryMode : 'local',
                bind : {
                    readOnly : '{!isPhantom}',
                    hidden : '{!isTypeCodeTable}',
                    disabled : '{!isTypeCodeTable}'
                }
            },
            {
                xtype : 'toggleslidefield',
                fieldLabel : i18n.gettext('Hidden'),
                name : 'isHidden'
            },
            {
                xtype : 'toggleslidefield',
                fieldLabel : i18n.gettext('Show in ESS'),
                name : 'showInEss',
                bind : {
                    hidden : '{showInEssIsHidden}'
                }
            },
            {
                xtype : 'toggleslidefield',
                fieldLabel : i18n.gettext('Required'),
                name : 'isRequired'
            }
        ]
    };

});

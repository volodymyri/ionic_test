Ext.define('criterion.view.codeTable.Detail', function() {

    var SYSTEM_TYPE = 1;

    var mainColumns = [
            {
                xtype : 'gridcolumn',
                minWidth : 130,
                flex : 0,
                bind : {
                    flex : '{hasCustomColumns ? 0 : 1}'
                },
                text : i18n.gettext('Code'),
                dataIndex : 'code',
                editor : 'textfield'
            },
            {
                xtype : 'gridcolumn',
                minWidth : 130,
                flex : 0,
                bind : {
                    flex : '{hasCustomColumns ? 0 : 1}'
                },
                text : i18n.gettext('Description'),
                dataIndex : 'description',
                editor : 'textfield',
                renderer : function(value, metaData, record) {
                    var localField = this.down('#localizationField'),
                        local = localField ? localField.getValue() : null,
                        locals = record.get('localizations') || {},
                        res = '';

                    if (!local || (local === criterion.CodeDataManager.getCodeDetailRecord('code', criterion.Consts.LOCALIZATION_LANGUAGE_EN, criterion.consts.Dict.LOCALIZATION_LANGUAGE).getId())) {
                        res = value;
                    } else {
                        Ext.each(locals, function(o) {
                            if (o.localizationLanguageCd === local) {
                                res = o.description;
                            }
                        });
                    }

                    return res;
                }
            },
            {
                xtype : 'booleancolumn',
                text : i18n.gettext('Active'),
                dataIndex : 'isActive',
                width : 100,
                trueText : i18n.gettext('Yes'),
                falseText : i18n.gettext('No'),
                editor : 'checkbox'
            },
            {
                xtype : 'booleancolumn',
                text : i18n.gettext('Default'),
                dataIndex : 'isDefault',
                width : 100,
                trueText : i18n.gettext('Yes'),
                falseText : i18n.gettext('No'),
                editor : 'checkbox'
            }
        ],
        actionsColumns = [
            // {
            //    xtype : 'criterion_actioncolumn',
            //
            //    bind : {
            //        hidden : '{preventAction}'
            //    },
            //
            //    items : [
            //        {
            //            glyph : criterion.consts.Glyph['ios7-trash-outline'],
            //            tooltip : i18n.gettext('Delete'),
            //            action : 'removeaction'
            //        }
            //    ]
            // }
        ],
        CODETABLE_FIELDS_CONFIG = criterion.Consts.CODETABLE_FIELDS_CONFIG;

    return {
        alias : 'widget.criterion_codetable_detail',

        extend : 'criterion.view.GridView',

        requires : [
            'criterion.controller.codeTable.Detail',
            'criterion.store.codeTable.Details',
            'criterion.view.codeTable.DetailForm'
        ],

        config : {
            codeTableId : null,
            codeTableName : null,
            codeTableRecord : null,
            type : SYSTEM_TYPE
        },

        viewModel : {
            data : {
                codeTableId : null,
                type : SYSTEM_TYPE,
                employerId : null,
                hasCustomColumns : false
            },

            formulas : {
                isSystem : function(data) {
                    return data('type') === SYSTEM_TYPE;
                },

                preventAction : function(data) {
                    return data('type') === SYSTEM_TYPE || !data('codeTableId');
                },

                preventEditing : function(data) {
                    return data('type') === SYSTEM_TYPE || !data('codeTableId');
                }
            }
        },

        controller : {
            type : 'criterion_codetable_detail',
            editor : {
                xtype : 'criterion_settings_codetable_detail_form',
                allowDelete : true,
                plugins : [
                    {
                        ptype : 'criterion_sidebar'
                    }
                ],
                listeners : {
                    save : function() {
                        criterion.Utils.toast(i18n.gettext('Saved.'));
                    }
                }
            }
        },

        listeners : {
            scope : 'controller',
            onSetCodeTableId : 'handleSetCodeTableId',
            onSetType : 'handleSetType'
        },

        store : {
            type : 'criterion_code_table_details'
        },

        tbar : [
            {
                xtype : 'button',
                reference : 'addButton',
                text : i18n.gettext('Add'),
                cls : 'criterion-btn-feature',
                listeners : {
                    click : 'handleAddClick'
                },
                bind : {
                    hidden : '{preventAction}'
                }
            },
            '->',
            {
                xtype : 'criterion_code_detail_field',
                itemId : 'localizationField',
                fieldLabel : i18n.gettext('Show descriptions in'),
                labelWidth : 160,
                codeDataId : criterion.consts.Dict.LOCALIZATION_LANGUAGE,
                editable : false,
                listeners : {
                    change : 'handleChangeLocal'
                }
            }
        ],

        title : i18n.gettext('Code Data'),

        columns : Ext.Array.merge(mainColumns, actionsColumns),

        setCodeTableId : function(codeTableId) {
            this.callParent(arguments);
            this.fireEvent('onSetCodeTableId', codeTableId);
        },

        setType : function(type) {
            this.callParent(arguments);
            this.fireEvent('onSetType', type);
        },

        setEmployerId : function(employerId) {
            this.getViewModel().set('employerId', employerId);
        },

        setCodeTableRecord : function(record) {
            this.callParent(arguments);

            var customColumns = [],
                codeTables = [],
                data = record.getData();

            criterion.CodeDataManager.codeTablesStoreFreezeFilters();

            Ext.Array.each(Ext.Object.getKeys(CODETABLE_FIELDS_CONFIG), function(fieldName) {
                if (data[fieldName]) {
                    var fc = CODETABLE_FIELDS_CONFIG[fieldName],
                        sourceField = fc.source,
                        ctName;

                    if (sourceField && data[sourceField]) {
                        ctName = criterion.CodeDataManager.getCodeTableNameById(parseInt(data[sourceField], 10));

                        codeTables.push(ctName);
                        customColumns.push({
                            xtype : 'criterion_codedatacolumn',
                            text : data[fieldName],
                            tooltip : data[fieldName],
                            dataIndex : fc.dataIndex,
                            codeDataId : ctName,
                            flex : 1
                        });
                    } else {
                        customColumns.push({
                            xtype : fc.columnType,
                            text : data[fieldName],
                            tooltip : data[fieldName],
                            dataIndex : fc.dataIndex,
                            flex : 1
                        });
                    }
                }
            });

            criterion.CodeDataManager.codeTablesStoreUnfreezeFilters();

            if (codeTables.length) {
                criterion.CodeDataManager.load(codeTables, function() {
                    this.reconfigure(
                        this.getStore(),
                        Ext.Array.merge(mainColumns, customColumns, actionsColumns)
                    );
                }, this);

            } else {
                this.reconfigure(
                    this.getStore(),
                    Ext.Array.merge(mainColumns, customColumns, actionsColumns)
                );
            }

            this.getViewModel().set('hasCustomColumns', customColumns.length > 0);
        },

        initComponent : function() {
            this.callParent(arguments);

            if (!this.getCodeTableRecord() && this.getCodeTableName()) {
                Ext.Function.defer(this.setCodeTableRecord, 100, this, [criterion.CodeDataManager.getCodeTablesStore().getById(this.getCodeTableName())]);
                Ext.Function.defer(this.setCodeTableId, 100, this, [criterion.CodeDataManager.getCodeTableIdByName(this.getCodeTableName())]);
            }
        }
    };
});

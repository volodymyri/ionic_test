Ext.define('criterion.view.customData.GridView', function() {

    return {
        alias : 'widget.criterion_customdata_gridview',

        extend : 'criterion.view.GridView',

        requires : [
            'criterion.controller.customData.GridView',
            'criterion.view.customData.Editor',
            'criterion.store.CustomData'
        ],

        config : {
            /**
             * @cfg {String} entityTypeCode
             *
             * Code of entity.
             */
            entityTypeCode : undefined,

            /**
             * @cfg {Number} entityTypeCd
             *
             * Identifier of entity.
             */
            entityTypeCd : undefined,

            customFormId : undefined
        },

        controller : {
            type : 'criterion_customdata_gridview',
            showTitleInConnectedViewMode : true,
            editor : {
                xtype : 'criterion_customdata_editor',
                plugins : [
                    {
                        ptype : 'criterion_sidebar',
                        height : 'auto'
                    }
                ]
            }
        },

        listeners : {
            scope : 'controller',
            render : 'handleShow'
        },

        viewModel : {
            data : {
                timesheetDetailEntity : null,
                storeCount : 0,
                showEntitySelector : true
            }
        },

        store : {
            type : 'criterion_customdata'
        },

        tbar : [
            {
                xtype : 'criterion_code_detail_field',
                reference : 'customizableEntityField',
                fieldLabel : i18n.gettext('Page'),
                margin : '0 0 0 10',
                labelWidth : 55,
                listeners : {
                    change : 'handleChangeEntityType'
                },
                codeDataId : criterion.consts.Dict.ENTITY_TYPE,
                valueCode : 'EMPLOYER',
                allowBlank : false,
                skipRequiredMark : true,
                hidden : true,
                bind : {
                    hidden : '{!showEntitySelector}',
                    disabled : '{!showEntitySelector}'
                },
                store : {
                    type : 'criterion_code_table_details',
                    filters : [
                        // in UI we should show only records with attribute1 = true
                        {
                            property : 'attribute1',
                            value : true
                        }
                    ]
                }
            },
            '->',
            {
                xtype : 'button',
                reference : 'addButton',
                text : i18n.gettext('Add'),
                cls : 'criterion-btn-feature',
                listeners : {
                    click : 'handleAddClick'
                }
            },
            {
                xtype : 'toggleslidefield',
                fieldLabel : i18n.gettext('Show Hidden'),
                margin : '0 0 0 20',
                labelWidth : 100,
                reference : 'showHidden',
                inputValue : '1',
                listeners : {
                    change : 'handleChangeShowHidden'
                }
            }
        ],

        columns : [
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Sequence'),
                dataIndex : 'sequenceNumber',
                flex : 1
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Label'),
                dataIndex : 'label',
                flex : 2
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Code'),
                dataIndex : 'code',
                flex : 2
            },
            {
                xtype : 'criterion_codedatacolumn',
                text : i18n.gettext('Data Type'),
                flex : 2,
                dataIndex : 'dataTypeCd',
                codeDataId : criterion.consts.Dict.DATA_TYPE
            },
            {
                xtype : 'booleancolumn',
                text : i18n.gettext('Hidden'),
                flex : 1,
                dataIndex : 'isHidden',
                trueText : i18n.gettext('Yes'),
                falseText : i18n.gettext('No')
            },
            {
                xtype : 'criterion_actioncolumn',
                width : criterion.Consts.UI_DEFAULTS.ACTION_COL_ITEM_WIDTH * 3,
                items : [
                    {
                        glyph : criterion.consts.Glyph['ios7-arrow-thin-up'],
                        tooltip : i18n.gettext('Move Up'),
                        text : '',
                        action : 'moveupaction'
                    },
                    {
                        glyph : criterion.consts.Glyph['ios7-arrow-thin-down'],
                        tooltip : i18n.gettext('Move Down'),
                        text : '',
                        action : 'movedownaction'
                    },
                    {
                        glyph : criterion.consts.Glyph['ios7-trash-outline'],
                        tooltip : i18n.gettext('Delete'),
                        action : 'removeaction'
                    }
                ]
            }
        ]
    };
});

Ext.define('criterion.view.reports.dataGrid.ColumnCriteriaEditor', function() {

    const DATA_GRID_SORT_TYPES = criterion.Consts.DATA_GRID_SORT_TYPES,
          DATA_GRID_FIELD_TYPE = criterion.Consts.DATA_GRID_FIELD_TYPE;

    const CRITERIA_FIELD_BY_DATA_GRID_FIELD_TYPE = {
        STRING : [
            DATA_GRID_FIELD_TYPE.STRING
        ],
        NUMERIC : [
            DATA_GRID_FIELD_TYPE.DOUBLE,
            DATA_GRID_FIELD_TYPE.INTEGER
        ],
        DATE : [
            DATA_GRID_FIELD_TYPE.DATE
        ],
        TIME : [
            DATA_GRID_FIELD_TYPE.TIME
        ]
    };

    return {
        extend : 'criterion.ux.form.Panel',

        alias : 'widget.criterion_reports_data_grid_column_criteria_editor',

        requires : [
            'criterion.controller.reports.dataGrid.ColumnCriteriaEditor',
            'criterion.store.dataGrid.Criteria'
        ],

        controller : {
            type : 'criterion_reports_data_grid_column_criteria_editor'
        },

        listeners : {
            show : 'handleShow'
        },

        viewModel : {
            data : {
                columnData : null,
                criteriaType : null,
                criteriaValue : null,
                blockCriteria : false
            },

            stores : {
                sorting : {
                    type : 'store',
                    proxy : {
                        type : 'memory'
                    },
                    fields : ['val', 'title'],
                    data : [
                        {
                            val : DATA_GRID_SORT_TYPES.ASC,
                            title : DATA_GRID_SORT_TYPES.ASC.toUpperCase()
                        },
                        {
                            val : DATA_GRID_SORT_TYPES.DESC,
                            title : DATA_GRID_SORT_TYPES.DESC.toUpperCase()
                        }
                    ]
                },

                criteriaTypes : {
                    type : 'store',
                    proxy : {
                        type : 'memory'
                    },
                    fields : [
                        {
                            name : 'operator',
                            type : 'string'
                        },
                        {
                            name : 'text',
                            type : 'string'
                        },
                        {
                            name : 'types'
                        },
                        {
                            name : 'special',
                            type : 'boolean',
                            defaultValue : false
                        }
                    ],
                    data : criterion.Consts.DATA_GRID_CRITERIA_TYPES()
                },

                criteria : {
                    type : 'criterion_data_grid_criteria'
                }
            },

            formulas : {
                isNotSpecialCriteria : data => data('criteriaField.selection') && !data('criteriaField.selection.special'),

                isStringCriteria : data => data('isNotSpecialCriteria') && Ext.Array.contains(CRITERIA_FIELD_BY_DATA_GRID_FIELD_TYPE.STRING, data('columnData.type')),
                isNumericCriteria : data => data('isNotSpecialCriteria') && Ext.Array.contains(CRITERIA_FIELD_BY_DATA_GRID_FIELD_TYPE.NUMERIC, data('columnData.type')),
                isDateCriteria : data => data('isNotSpecialCriteria') && Ext.Array.contains(CRITERIA_FIELD_BY_DATA_GRID_FIELD_TYPE.DATE, data('columnData.type')),
                isTimeCriteria : data => data('isNotSpecialCriteria') && Ext.Array.contains(CRITERIA_FIELD_BY_DATA_GRID_FIELD_TYPE.TIME, data('columnData.type'))
            }
        },

        buttons : [
            {
                xtype : 'button',
                text : i18n.gettext('Cancel'),
                cls : 'criterion-btn-light',
                listeners : {
                    click : 'handleCancel'
                }
            },
            '->',
            {
                xtype : 'button',
                text : i18n.gettext('Change'),
                cls : 'criterion-btn-primary',
                listeners : {
                    click : 'handleChange'
                }
            }
        ],

        modal : true,

        alwaysOnTop : true,

        draggable : false,

        plugins : {
            ptype : 'criterion_sidebar',
            modal : true,
            height : '85%',
            width : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_WIDTH
        },

        layout : 'vbox',

        bind : {
            title : i18n.gettext('Column Name: ') + '{columnData.label}'
        },

        items : [
            {
                xtype : 'combobox',
                reference : 'sortField',
                fieldLabel : i18n.gettext('Sort'),
                displayField : 'title',
                valueField : 'val',
                bind : {
                    store : '{sorting}',
                    value : '{columnData.sort}'
                },
                triggers : {
                    clear : {
                        type : 'clear',
                        cls : 'criterion-clear-trigger',
                        hideWhenEmpty : true
                    }
                },
                margin : '0 0 10 0'
            },
            {
                xtype : 'component',
                autoEl : 'hr',
                cls : 'criterion-horizontal-ruler',
                width : '100%',
                hidden : false,
                bind : {
                    hidden : '{blockCriteria}'
                }
            },
            {
                xtype : 'container',
                layout : 'hbox',
                margin : '10 0 0 0',
                hidden : false,
                bind : {
                    hidden : '{blockCriteria}'
                },
                items : [
                    {
                        xtype : 'combobox',
                        reference : 'criteriaField',
                        fieldLabel : i18n.gettext('Criteria'),
                        displayField : 'text',
                        valueField : 'operator',
                        sortByDisplayField : false,
                        bind : {
                            store : '{criteriaTypes}',
                            value : '{criteriaType}'
                        }
                    },

                    {
                        xtype : 'textfield',
                        margin : '0 0 0 10',
                        allowBlank : false,
                        disabled : true,
                        hidden : true,
                        bind : {
                            value : '{criteriaValue}',
                            hidden : '{!isStringCriteria}',
                            disabled : '{!isStringCriteria}'
                        }
                    },
                    {
                        xtype : 'numberfield',
                        margin : '0 0 0 10',
                        allowBlank : false,
                        disabled : true,
                        hidden : true,
                        bind : {
                            value : '{criteriaValue}',
                            hidden : '{!isNumericCriteria}',
                            disabled : '{!isNumericCriteria}'
                        }
                    },
                    {
                        xtype : 'datefield',
                        margin : '0 0 0 10',
                        allowBlank : false,
                        disabled : true,
                        hidden : true,
                        bind : {
                            value : '{criteriaValue}',
                            hidden : '{!isDateCriteria}',
                            disabled : '{!isDateCriteria}'
                        }
                    },
                    {
                        xtype : 'criterion_time_field',
                        margin : '0 0 0 10',
                        allowBlank : false,
                        disabled : true,
                        hidden : true,
                        bind : {
                            value : '{criteriaValue}',
                            hidden : '{!isTimeCriteria}',
                            disabled : '{!isTimeCriteria}'
                        }
                    },

                    {
                        xtype : 'button',
                        text : i18n.gettext('Add'),
                        margin : '0 0 0 10',
                        bind : {
                            disabled : '{!criteriaType}'
                        },
                        handler : 'handleAddCriteria'
                    }
                ]
            },
            {
                xtype : 'criterion_gridview',
                margin : '10 0',
                tbar : null,
                width : '100%',
                hidden : false,
                bind : {
                    store : '{criteria}',
                    hidden : '{blockCriteria}'
                },
                controller : {
                    customDeleteMsg : i18n.gettext('Do you want to delete this criteria?')
                },
                columns : [
                    {
                        xtype : 'templatecolumn',
                        text : i18n.gettext('Criteria'),
                        dataIndex : 'operator',
                        tpl : '{operator} {value}',
                        flex : 1
                    },
                    {
                        xtype : 'criterion_actioncolumn',
                        width : criterion.Consts.UI_DEFAULTS.ACTION_COL_ITEM_WIDTH,
                        items : [
                            {
                                glyph : criterion.consts.Glyph['ios7-trash-outline'],
                                tooltip : i18n.gettext('Delete'),
                                action : 'removeaction'
                            }
                        ]
                    }
                ]
            }
        ]
    }
});

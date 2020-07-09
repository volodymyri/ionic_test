Ext.define('criterion.view.reports.dataGrid.Editor', function() {

    const DATA_GRID_TYPES = criterion.Consts.DATA_GRID_TYPES;

    return {
        extend : 'criterion.view.FormView',

        alias : 'widget.criterion_reports_data_grid_editor',

        requires : [
            'criterion.controller.reports.dataGrid.Editor',
            'criterion.store.dataGrid.ModuleColumns',
            'criterion.store.dataGrid.FormFields',
            'criterion.store.Forms',
            'criterion.model.dataGrid.TableStruct',
            'criterion.ux.form.field.CodeEditor',
            'criterion.view.reports.dataGrid.editor.Form',
            'criterion.view.reports.dataGrid.editor.Module',
            'criterion.view.reports.dataGrid.editor.Table'
        ],

        controller : {
            type : 'criterion_reports_data_grid_editor'
        },

        layout : 'card',

        viewModel : {
            data : {
                dataGridType : DATA_GRID_TYPES.MODULES,
                dataViewMode : 0,
                dataGridChanged : false,

                dgOptions : {},
                dataform : null,
                webform : null,
                moduleRecord : null,
                formId : null,
                moduleId : null,

                dgCount : 1,
                dgPage : 1,
                dgLimit : criterion.Consts.PAGE_SIZE.DATA_GRID_DEFAULT,

                // for tables
                tables : [],
                availableTableNames : [],
                dgTableParameters : [],
                dgTableFilters : [],
                dgTableOrderBy : []
            },

            stores : {
                moduleColumns : {
                    type : 'criterion_data_grid_module_columns',
                    sorters : [
                        {
                            property : 'position',
                            direction : 'ASC'
                        }
                    ]
                },
                formsFields : {
                    type : 'criterion_data_grid_form_fields',
                    sorters : [
                        {
                            property : 'position',
                            direction : 'ASC'
                        }
                    ]
                },
                forms : {
                    type : 'criterion_forms',
                    proxy : {
                        type : 'memory'
                    }
                }
            },
            formulas : {
                tablesMode : data => data('dataGridType') === DATA_GRID_TYPES.TABLES,
                modulesMode : data => data('dataGridType') === DATA_GRID_TYPES.MODULES,
                formMode : data => data('dataGridType') === DATA_GRID_TYPES.FORMS,
                sqlMode : data => data('dataGridType') === DATA_GRID_TYPES.SQL,

                editorItem : data => Ext.Array.clean([
                    data('modulesMode') ? 0 : null,
                    data('tablesMode') ? 1 : null,
                    data('formMode') ? 2 : null,
                    data('sqlMode') ? 3 : null
                ])[0],
                allowAddFields : data => data('dgOptions.dataformId') || data('dgOptions.webformId'),

                dgPages : data => Math.ceil(data('dgCount') / data('dgLimit')),
                dgStart : data => ((data('dgPage') - 1) * data('dgLimit')) + 1,
                allowPrev : data => data('dgPage') > 1,
                allowNext : data => data('dgPage') < data('dgPages')
            }
        },

        noButtons : true,
        bodyPadding : 0,
        scrollable : 'vertical',

        bind : {
            activeItem : '{dataViewMode}'
        },

        buttons : [
            {
                xtype : 'button',
                text : i18n.gettext('Delete'),
                cls : 'criterion-btn-remove',
                hidden : true,
                bind : {
                    hidden : '{isPhantom}'
                },
                handler : 'handleDeleteDataGrid'
            },
            '->',
            {
                xtype : 'button',
                text : i18n.gettext('Cancel'),
                cls : 'criterion-btn-light',
                handler : 'handleCancel'
            },
            {
                xtype : 'button',
                text : i18n.gettext('Next'),
                cls : 'criterion-btn-primary',
                hidden : true,
                bind : {
                    hidden : '{dataViewMode}'
                },
                handler : 'handleNext'
            },
            {
                xtype : 'button',
                text : i18n.gettext('Edit'),
                cls : 'criterion-btn-primary',
                hidden : true,
                bind : {
                    hidden : '{!dataViewMode}'
                },
                handler : 'handleEdit'
            },
            {
                xtype : 'button',
                text : i18n.gettext('Save'),
                cls : 'criterion-btn-primary',
                hidden : true,
                bind : {
                    hidden : '{!isPhantom || !dataViewMode}'
                },
                handler : 'handleMemorizeDataGrid'
            },
            {
                xtype : 'button',
                text : i18n.gettext('Save'),
                cls : 'criterion-btn-primary',
                hidden : true,
                bind : {
                    hidden : '{isPhantom || !dataViewMode}'
                },
                handler : 'handleSaveMemorized'
            }
        ],

        dockedItems : [
            {
                xtype : 'toolbar',
                dock : 'top',
                padding : '10',
                hidden : true,
                bind : {
                    hidden : '{dataViewMode}'
                },

                items : [
                    {
                        xtype : 'combobox',
                        displayField : 'name',
                        valueField : 'id',
                        bind : {
                            value : '{dataGridType}',
                            disabled : '{!isPhantom}'
                        },
                        sortByDisplayField : false,
                        forceSelection : true,
                        store : {
                            data : [
                                {
                                    id : DATA_GRID_TYPES.MODULES,
                                    name : i18n.gettext('Modules')
                                },
                                {
                                    id : DATA_GRID_TYPES.TABLES,
                                    name : i18n.gettext('Tables')
                                },
                                {
                                    id : DATA_GRID_TYPES.FORMS,
                                    name : i18n.gettext('Forms')
                                },
                                {
                                    id : DATA_GRID_TYPES.SQL,
                                    name : i18n.gettext('SQL')
                                }
                            ]
                        },
                        listeners : {
                            change : 'handleChangeType'
                        }
                    },
                    {
                        xtype : 'combobox',
                        displayField : 'name',
                        valueField : 'id',
                        hidden : true,
                        queryMode : 'local',
                        forceSelection : true,
                        autoSelect : true,
                        editable : true,
                        bind : {
                            store : '{sModules}',
                            hidden : '{!modulesMode}',
                            value : '{moduleId}',
                            disabled : '{!isPhantom}'
                        },
                        listeners : {
                            change : 'handleChangeModule'
                        }
                    },
                    {
                        xtype : 'combobox',
                        displayField : 'name',
                        valueField : 'id',
                        hidden : true,
                        queryMode : 'local',
                        forceSelection : true,
                        autoSelect : true,
                        editable : true,
                        bind : {
                            store : '{forms}',
                            hidden : '{!formMode}',
                            value : '{formId}',
                            disabled : '{!isPhantom}'
                        },
                        listeners : {
                            change : 'handleChangeForm'
                        }
                    },
                    '->'
                ]
            },
            {
                xtype : 'toolbar',
                dock : 'top',
                padding : '10',
                hidden : true,
                bind : {
                    hidden : '{!dataViewMode}'
                },

                items : [
                    {
                        xtype : 'textfield',
                        margin : '0 0 0 5',
                        hidden : true,
                        bind : {
                            hidden : '{isPhantom}',
                            value : '{record.name}'
                        }
                    },
                    '->',
                    {
                        xtype : 'criterion_splitbutton',
                        cls : 'criterion-btn-primary',
                        text : i18n.gettext('Export to Excel'),
                        textAlign : 'left',
                        handler : 'handleExportToExcel',

                        menu : [
                            {
                                text : i18n.gettext('Export to CSV'),
                                handler : 'handleExportToCSV'
                            }
                        ]
                    }
                ]
            }
        ],

        items : [
            {
                xtype : 'container',
                layout : 'card',
                flex : 1,

                bind : {
                    activeItem : '{editorItem}'
                },

                items : [

                    // module
                    {
                        xtype : 'criterion_reports_data_grid_editor_module',
                        flex : 1,
                        bodyPadding : 0
                    },

                    // tables
                    {
                        xtype : 'criterion_reports_data_grid_editor_table',
                        flex : 1,
                        bodyPadding : 0,
                        listeners : {
                            applyNewTables : 'handleApplyNewTables',
                            setNewTablesParams : 'handleSetNewTablesParams'
                        }
                    },

                    // form
                    {
                        xtype : 'criterion_reports_data_grid_editor_form',
                        flex : 1,
                        bodyPadding : 0
                    },

                    // sql
                    {
                        xtype : 'container',
                        flex : 1,
                        items : [
                            {
                                xtype : 'criterion_code_editor_field',
                                reference : 'code_editor_field',
                                bind : '{dgOptions.sql}',
                                aceOptions : {
                                    enableBasicAutocompletion : true,
                                    enableLiveAutocompletion : true,
                                    enableSnippets : true,
                                    mode : 'ace/mode/sql'
                                },
                                height : '100%',
                                width : '100%',
                                margin : 0,
                                padding : 0,
                                allowBlank : false
                            }
                        ]
                    }
                ]
            },
            {
                xtype : 'criterion_gridpanel',
                cls : 'criterion-yellow-dirty-cell',
                reference : 'dataGrid',
                flex : 1,
                bodyPadding : 0,
                tbar : null,
                preventStoreLoad : true,
                columns : [],
                listeners : {
                    columnmove : 'handleColumnMoving'
                },
                dockedItems : [
                    {
                        xtype : 'toolbar',
                        dock : 'bottom',
                        cls : Ext.baseCSSPrefix + 'grid-paging-toolbar criterion-toolbar-paging',
                        defaultButtonUI : 'plain-toolbar',
                        items : [
                            {
                                xtype : 'component',
                                cls : 'x-toolbar-text tbtext x-box-item x-toolbar-item x-toolbar-text-default',
                                bind : {
                                    html : '{dgCount} rows'
                                }
                            },
                            {
                                xtype : 'tbseparator'
                            },
                            {
                                tooltip : i18n.gettext('Previous Page'),
                                overflowText : i18n.gettext('Previous Page'),
                                iconCls : Ext.baseCSSPrefix + 'tbar-page-prev',
                                disabled : true,
                                hidden : false,
                                bind : {
                                    disabled : '{!allowPrev}',
                                    hidden : '{!dgCount}'
                                },
                                handler : 'handleLoadPreviousPage'
                            },
                            {
                                xtype : 'component',
                                cls : 'x-toolbar-text tbtext x-box-item x-toolbar-item x-toolbar-text-default',
                                hidden : false,
                                bind : {
                                    html : 'Page {dgPage} of {dgPages}',
                                    hidden : '{!dgCount}'
                                }
                            },
                            {
                                tooltip : i18n.gettext('Next Page'),
                                overflowText : i18n.gettext('Next Page'),
                                iconCls : Ext.baseCSSPrefix + 'tbar-page-next',
                                disabled : true,
                                hidden : false,
                                bind : {
                                    disabled : '{!allowNext}',
                                    hidden : '{!dgCount}'
                                },
                                handler : 'handleLoadNextPage'
                            },
                            {
                                xtype : 'tbseparator',
                                hidden : false,
                                bind : {
                                    hidden : '{!dgCount}'
                                }
                            },
                            '->',
                            {
                                xtype : 'combobox',
                                queryMode : 'local',
                                triggerAction : 'all',
                                displayField : 'name',
                                valueField : 'limit',
                                width : 170,
                                lazyRender : true,
                                allowBlank : false,
                                enableKeyEvents : false,
                                value : criterion.Consts.PAGE_SIZE.DATA_GRID_DEFAULT,
                                editable : false,
                                forceSelection : true,
                                sortByDisplayField : false,
                                store : Ext.Array.map(criterion.Consts.PAGE_SIZE.DATA_GRID_VALUES, val => {
                                    return {
                                        name : val ? i18n.gettext(Ext.String.format('Limit to {0} rows', val)) : i18n.gettext('Don\'t Limit'),
                                        limit : val
                                    }
                                }),
                                listeners : {
                                    change : 'handleChangeDataGridLimit'
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    }
});

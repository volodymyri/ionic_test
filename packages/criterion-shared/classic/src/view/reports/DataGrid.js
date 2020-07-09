Ext.define('criterion.view.reports.DataGrid', function() {

    return {

        alias : 'widget.criterion_reports_datagrid',

        extend : 'criterion.view.GridView',

        requires : [
            'criterion.controller.reports.DataGrid',
            'criterion.view.reports.dataGrid.Editor',
            'criterion.store.DataGrids',
            'criterion.store.dataGrid.AvailableTables',
            'criterion.store.dataGrid.Modules',
            'criterion.store.dataGrid.DataForms',
            'criterion.store.dataGrid.WebForms'
        ],

        controller : {
            type : 'criterion_reports_data_grid',
            loadRecordOnEdit : false,
            editor : {
                xtype : 'criterion_reports_data_grid_editor',
                plugins : {
                    ptype : 'criterion_sidebar'
                }
            }
        },

        viewModel : {
            data : {
                selectionCount : 0
            },
            stores : {
                availableTables : {
                    type : 'criterion_available_tables'
                },
                sModules : {
                    type : 'criterion_data_grid_modules'
                },
                dataforms : {
                    type : 'criterion_data_grid_dataforms'
                },
                webforms : {
                    type : 'criterion_data_grid_webforms'
                }
            }
        },

        store : {
            type : 'criterion_data_grids'
        },

        tbar : [
            '->',
            {
                xtype : 'button',
                text : i18n.gettext('Clone'),
                cls : 'criterion-btn-feature',
                bind : {
                    disabled : '{!selectionCount}'
                },
                listeners : {
                    click : 'handleCloneClick'
                }
            },
            {
                xtype : 'button',
                reference : 'addButton',
                text : i18n.gettext('New'),
                cls : 'criterion-btn-feature',
                listeners : {
                    click : 'handleAddClick'
                }
            },
            {
                xtype : 'button',
                reference : 'refreshButton',
                cls : 'criterion-btn-transparent',
                glyph : criterion.consts.Glyph['ios7-refresh-empty'],
                scale : 'medium',
                listeners : {
                    click : 'handleRefreshClick'
                }
            }
        ],

        selModel : {
            selType : 'checkboxmodel',
            checkOnly : true,
            listeners : {
                scope : 'controller',
                selectionchange : 'handleSelectionChange'
            }
        },

        columns : [
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Name'),
                dataIndex : 'name',
                flex : 1
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Type'),
                dataIndex : 'type',
                width : 150
            }
        ]
    };

});

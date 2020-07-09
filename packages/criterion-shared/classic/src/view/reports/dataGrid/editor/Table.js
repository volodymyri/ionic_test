Ext.define('criterion.view.reports.dataGrid.editor.Table', function() {

    return {

        extend : 'criterion.ux.Panel',

        alias : 'widget.criterion_reports_data_grid_editor_table',

        requires : [
            'criterion.controller.reports.dataGrid.editor.Table',
            'criterion.store.dataGrid.AvailableTables'
        ],

        layout : 'border',

        bodyPadding : 0,

        controller : {
            type : 'criterion_reports_data_grid_editor_table'
        },

        viewModel : {
            data : {
                tableName : null
            },
            stores : {
                allTables : {
                    type : 'criterion_available_tables',
                    filters : [
                        {
                            property : 'label',
                            value : '{tableName}',
                            operator : 'like',
                            disabled : '{!tableName}'
                        },
                        {
                            property : 'name',
                            value : '{availableTableNames}',
                            operator : 'in',
                            disabled : '{!availableTableNames}'
                        }
                    ]
                },
                tablesColumn : {
                    type : 'tree',
                    model : 'criterion.model.dataGrid.TableColumn',
                    proxy : {
                        type : 'memory'
                    }
                }
            },
            formulas : {
                disableFilter : data => data('availableTableNames') && data('tables').length
            }
        },

        listeners : {
            activate : 'handleActivate'
        },

        items : [
            {
                xtype : 'criterion_gridpanel',
                bodyPadding : 0,
                bind : {
                    store : '{allTables}'
                },
                border : 1,
                dockedItems : [
                    {
                        xtype : 'textfield',
                        flex : 1,
                        dock : 'top',
                        reference : 'filterField',
                        bind : {
                            value : '{tableName}',
                            disabled : '{disableFilter}'
                        },
                        padding : '4 5 5 5'
                    }
                ],
                split : true,
                region : 'west',
                width : 300,

                scrollable : 'vertical',
                height : '100%',
                listeners : {
                    scope : 'controller',
                    beforecellclick : 'handleAddTable'
                },

                columns : [
                    {
                        xtype : 'templatecolumn',
                        dataIndex : 'label',
                        flex : 1,
                        tpl : '<span data-qtip="{label}">{label}</span>'
                    },
                    {
                        xtype : 'gridcolumn',
                        width : 100,
                        align : 'right',
                        encodeHtml : false,
                        dataIndex : 'join',
                        renderer : () => Ext.String.format(
                            '<span class="{2}" data-qtip="{0}">{1}</span>',
                            i18n.gettext('Add Table'),
                            '&#10153;',
                            'criterion-darken-gray fs-1-2'
                        )
                    }
                ]
            },

            {
                xtype : 'treepanel',
                cls : 'criterion-datagrid-table-columns criterion-grid-panel',
                viewConfig : {
                    markDirty : false
                },
                region : 'center',

                useArrows : true,
                rootVisible : false,
                singleExpand : false,

                bodyPadding : 0,
                bind : {
                    store : '{tablesColumn}'
                },
                listeners : {
                    beforecellclick : 'handleAct',
                    editColumnsAction : 'handleEditColumnsAction',
                    removeAction : 'handleRemoveAction'
                },
                flex : 1,
                tbar : null,
                border : 1,

                scrollable : true,
                height : '100%',

                columns : [
                    {
                        xtype : 'treecolumn',
                        dataIndex : 'name',
                        text : i18n.gettext('Column Name'),
                        menuDisabled : true,
                        sortable : false,
                        flex : 1,
                        minWidth : 250
                    },
                    {
                        xtype : 'gridcolumn',
                        dataIndex : 'joinedBy',
                        text : i18n.gettext('Join'),
                        encodeHtml : false,
                        menuDisabled : true,
                        sortable : false,
                        flex : 1,
                        minWidth : 150,
                        renderer : function(value, metaData, record) {
                            let isLeaf = record && record.get('leaf'),
                                isLinkable = record && record.get('isLinkable'),
                                isLinked = record && record.get('isLinked');

                            return isLeaf ?
                                (isLinkable ? (isLinked ? '<span class="criterion-darken-gray fs-1-2" data-qtip="' + i18n.gettext('Edit Link') + '">&#9741;</span>' : '<span class="criterion-darken-gray fs-1-2" data-qtip="' + i18n.gettext('Add Link') + '">&#10011;</span>') : '')
                                : value;
                        }
                    },
                    {
                        xtype : 'gridcolumn',
                        dataIndex : 'sort',
                        width : 130,
                        encodeHtml : false,
                        text : i18n.gettext('Sort'),
                        menuDisabled : true,
                        sortable : false,
                        renderer : function(value, metaData, record) {
                            return record && record.get('leaf') ? '<span class="criterion-darken-gray showOnGridItemHover" data-qtip="' + i18n.gettext('Edit sort') + '">&#x270E;</span>&nbsp;' + (value || '').toUpperCase() : '';
                        }
                    },
                    {
                        xtype : 'gridcolumn',
                        dataIndex : 'criteria',
                        encodeHtml : false,
                        width : 300,
                        text : i18n.gettext('Criteria'),
                        menuDisabled : true,
                        sortable : false,
                        renderer : function(values, metaData, record) {
                            return record && record.get('leaf') && !record.get('isIDField') ? '<span class="criterion-darken-gray showOnGridItemHover" data-qtip="' + i18n.gettext('Edit criteria') + '">&#x270E;</span>&nbsp;' +
                                (
                                    values && Ext.isArray(values) && values.length ?
                                        Ext.Array.map(values, val => Ext.String.trim(Ext.String.format('{0} {1}', val['operator'], val['value']))).join('&nbsp;<span class="criterion-darken-gray">AND</span><br>' + Ext.String.repeat('&nbsp;', 4)) : ''
                                ) : '';
                        }
                    },
                    {
                        xtype : 'gridcolumn',
                        dataIndex : 'isShow',
                        encodeHtml : false,
                        align : 'center',
                        width : 100,
                        text : i18n.gettext('Show'),
                        tooltip : i18n.gettext('Show this column in the data grid'),
                        menuDisabled : true,
                        sortable : false,
                        renderer : function(value, metaData, record) {
                            let qtip = value ? i18n.gettext('Showed') : i18n.gettext('Hidden'),
                                sign = value ? '&#10003;' : '&#10007;',
                                cls = value ? 'criterion-green' : 'criterion-red';

                            return record && record.get('leaf') ? '<span class="cursor-pointer fs-1-2 ' + cls + '" data-qtip="' + qtip + '">' + sign + '</span>' : '';
                        }
                    },
                    {
                        xtype : 'criterion_actioncolumn',
                        width : criterion.Consts.UI_DEFAULTS.ACTION_COL_ITEM_WIDTH,
                        menuDisabled : true,
                        sortable : false,
                        items : [
                            {
                                glyph : criterion.consts.Glyph['ios7-trash-outline'],
                                tooltip : i18n.gettext('Delete'),
                                action : 'removeAction'
                            }
                        ]
                    }
                ]
            }
        ]

    };
});

Ext.define('criterion.view.ess.resources.CompanyDocuments', function() {

    return {

        alias : 'widget.criterion_selfservice_resources_company_documents',

        extend : 'criterion.view.common.DocumentTree',

        requires : [
            'criterion.controller.ess.resources.CompanyDocuments'
        ],

        controller : {
            type : 'criterion_selfservice_resources_company_documents'
        },

        cls : 'criterion-grid-panel',

        listeners : {
            beforecellclick : 'handleCellClick'
        },

        viewModel : {
            data : {
                gridColumns : [
                    {
                        xtype : 'treecolumn',
                        text : 'Name',
                        dataIndex : 'description',
                        flex : 3,
                        sortable : true
                    },
                    {
                        xtype : 'gridcolumn',
                        text : i18n.gettext('Type'),
                        dataIndex : 'documentTypeCd',
                        flex : 2,
                        renderer : (value, metaData, record) => record.get('isFolder') ? '' : record.get('documentTypeDesc')
                    },
                    {
                        xtype : 'datecolumn',
                        dataIndex : 'dueDate',
                        text : i18n.gettext('Due Date'),
                        width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH
                    },
                    {
                        xtype : 'gridcolumn',
                        text : i18n.gettext('Size'),
                        dataIndex : 'size',
                        align : 'right',
                        formatter : 'criterionFileSize',
                        flex : 1
                    },
                    {
                        xtype : 'criterion_actioncolumn',
                        width : criterion.Consts.UI_DEFAULTS.ACTION_COL_ITEM_WIDTH,
                        items : [
                            {
                                glyph : criterion.consts.Glyph['ios7-download-outline'],
                                tooltip : i18n.gettext('Download'),
                                action : 'viewaction',
                                permissionAction : function(v, cellValues, record) {
                                    return record.get('leaf');
                                }
                            }
                        ]
                    }
                ]
            }
        },

        header : {

            title : i18n.gettext('Company Documents'),

            items : [
                {
                    xtype : 'tbfill'
                },
                {
                    xtype : 'button',
                    reference : 'refreshButton',
                    cls : 'criterion-btn-glyph-only',
                    glyph : criterion.consts.Glyph['ios7-refresh-empty'],
                    scale : 'medium',
                    listeners : {
                        click : 'handleRefreshClick'
                    }
                }
            ]
        },

        tbar : null,

        bind : {
            store : '{employerDocumentTree}'
        },

        columns : []
    };

});

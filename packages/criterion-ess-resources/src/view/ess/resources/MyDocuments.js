Ext.define('criterion.view.ess.resources.MyDocuments', function() {

    return {

        alias : 'widget.criterion_selfservice_resources_my_documents',

        extend : 'criterion.view.common.DocumentTree',

        requires : [
            'criterion.controller.ess.resources.MyDocuments',
            'criterion.store.DocumentLocations'
        ],

        controller : {
            type : 'criterion_selfservice_resources_my_documents'
        },

        cls : 'criterion-grid-panel',

        listeners : {
            beforecellclick : 'handleCellClick'
        },

        viewModel : {
            data : {
                documentLocation : null,

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
            },

            stores : {
                documentLocations : {
                    type : 'criterion_document_locations'
                }
            }
        },

        header : {

            title : i18n.gettext('My Documents'),

            items : [
                {
                    xtype : 'tbfill'
                },

                {
                    xtype : 'combobox',
                    fieldLabel : i18n.gettext('Document Location'),
                    labelWidth : 160,
                    margin : '0 20 0 0',
                    displayField : 'description',
                    valueField : 'id',
                    editable : false,
                    queryMode : 'local',
                    sortByDisplayField : false,
                    bind : {
                        store : '{documentLocations}',
                        value : '{documentLocation}'
                    },
                    listeners : {
                        change : 'handleChangeDocumentLocation'
                    }
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

        bind : {
            store : '{employeeDocumentTree}'
        },

        tbar : null,

        layout : 'fit',

        columns : [],

        constructor : function() {
            let store = Ext.StoreManager.lookup(criterion.Consts.GLOBAL_STORES.DOCUMENT_LOCATIONS.storeId);

            this.callParent(arguments);

            if (!store.isLoaded()) {
                Ext.GlobalEvents.on('baseStoresLoaded', this.prepareDocumentLocations, this);
            } else {
                this.prepareDocumentLocations();
            }
        },

        prepareDocumentLocations : function() {
            let store = Ext.StoreManager.lookup(criterion.Consts.GLOBAL_STORES.DOCUMENT_LOCATIONS.storeId),
                vm = this.getViewModel(),
                documentLocations = vm.getStore('documentLocations');

            store.cloneToStore(documentLocations);
        }
    };

});

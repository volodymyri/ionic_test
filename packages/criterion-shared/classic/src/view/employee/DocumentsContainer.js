Ext.define('criterion.view.employee.DocumentsContainer', {

    alias : 'widget.criterion_employee_documents_container',

    extend : 'criterion.ux.Panel',

    title : i18n.gettext('Documents'),

    requires : [
        'criterion.view.common.DocumentTree',
        'criterion.controller.employee.Documents',
        'Ext.tree.plugin.TreeViewDragDrop'
    ],

    layout : 'card',

    defaults : {
        header : false
    },

    /**
     * Flag mark of deferred items for thew delayed activation
     */
    hasDeferredItems : true,
    deferredItemsReady : false,

    setActiveDeferredItem : function(pageId) {
        let me = this;

        if (this.deferredItemsReady) {
            me.activateItemByPageId(pageId);
        } else {
            this.on('deferredItemsReady', () => {
                me.activateItemByPageId(pageId);
            }, this, {single : true})
        }
    },

    activateItemByPageId : function(pageId) {
        let me = this;

        me.items.each(function(item) {
            if (item.itemId === pageId) {
                if (me.getLayout().getActiveItem() !== item) {
                    me.getLayout().setActiveItem(item);
                }
            }
        });
    },

    constructor : function() {
        this.callParent(arguments);

        let me = this;

        Ext.GlobalEvents.on('baseStoresLoaded', () => {
            if (me.destroyed) {
                // removed by security
                return;
            }

            let items = [],
                store = Ext.StoreManager.lookup(criterion.Consts.GLOBAL_STORES.DOCUMENT_LOCATIONS.storeId);

            store.each((rec) => {
                items.push({
                    xtype : 'criterion_common_document_tree',
                    cls : 'criterion-grid-panel',
                    title : rec.get('description'),
                    itemId : rec.get('code').toLowerCase(),
                    uploadUrl : criterion.consts.Api.API.EMPLOYEE_DOCUMENT_UPLOAD,
                    mode : criterion.Consts.ATTACHMENTS_CONFIG.MODE_PERSON,
                    controller : {
                        type : 'criterion_employee_documents',
                        loadRecordOnEdit : false,
                        documentLocation : rec.getId()
                    },
                    bind : {
                        store : '{employeeDocumentTree}'
                    },
                    dockedItems : [
                        {
                            xtype : 'toolbar',
                            dock : 'top',
                            items : [
                                '->',
                                {
                                    xtype : 'criterion_splitbutton',
                                    width : 120,
                                    reference : 'addButton',
                                    text : i18n.gettext('Add'),
                                    cls : 'criterion-btn-feature',
                                    handler : 'handleAddClick',
                                    menu : [
                                        {
                                            text : i18n.gettext('Add Folder'),
                                            handler : 'handleAddFolder'
                                        },
                                        {
                                            text : i18n.gettext('Mass Upload'),
                                            handler : 'handleMassUpload'
                                        }
                                    ]
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
                            ]
                        }
                    ],
                    viewConfig : {
                        plugins : {
                            ptype : 'treeviewdragdrop',
                            enableDrag : true,
                            enableDrop : true
                        }
                    }
                })
            });

            me.add(items);

            me.deferredItemsReady = true;
            me.fireEvent('deferredItemsReady');
        });
    }

});

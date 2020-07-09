Ext.define('criterion.view.RecordPicker', function() {

    return {
        alias : [
            'widget.criterion_record_picker'
        ],

        extend : 'criterion.ux.Panel',

        requires : [
            'criterion.ux.toolbar.ToolbarPaging',
            'criterion.ux.grid.Panel',
            'criterion.ux.plugin.Sidebar'
        ],

        plugins : [
            {
                ptype : 'criterion_sidebar',
                height : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_HEIGHT,
                modal : true
            }
        ],

        title : i18n.gettext('Search for Record'),

        modal : true,
        closable : true,
        layout : 'fit',
        draggable : true,

        config : {
            /**
             * Array of objects {fieldName: 'code', displayName: 'Code'}
             */
            searchFields : [],
            /**
             * Array of objects {xtype: 'datecolumn', dataIndex: 'dateActive'}
             */
            columns : [],

            actionColumns : [
                {
                    xtype : 'criterion_actioncolumn',
                    width : criterion.Consts.UI_DEFAULTS.ACTION_COL_ITEM_WIDTH,
                    items : [
                        {
                            glyph : criterion.consts.Glyph['ios7-arrow-forward'],
                            tooltip : i18n.gettext('Select')
                        }
                    ]
                }
            ],

            /**
             * Instance of store for grid OR config similar to viewModel's stores
             */
            store : null,
            /**
             * Search result grid plugins
             */
            gridPlugins : null,
            gridCls : 'criterion-record-picker def',
            gridListeners : {},

            extraItems : null,
            localFiltering : false
        },

        initComponent : function() {
            var me = this,
                bbar, store;

            if (!this.getStore()) {
                throw new Error('criterion.view.RecordPicker : wrong configuration.');
            }

            store = this.getStore();

            if (!store.isStore) {
                var storeType = store.type;

                delete store.type;

                store = Ext.createByAlias('store.' + storeType, store);
            }

            store.on('load', this.center, this);

            if (store.pageSize) {
                bbar = [
                    {
                        xtype : 'criterion_toolbar_paging',
                        dock : 'bottom',
                        displayInfo : true,
                        store : store,
                        margin : 0,
                        padding : 0
                    }
                ]
            }

            this.items = [
                {
                    xtype : 'criterion_gridpanel',
                    dockedItems : this.getDockedTop(),
                    cls : this.getGridCls(),
                    bbar : bbar,
                    store : store,
                    plugins : this.getGridPlugins(),
                    listeners : Ext.apply(me.getGridListeners(), {
                        itemclick : function(grid, record, html, rowIndex) {
                            me.handleSelectClick.apply(me, [grid, rowIndex]);
                        }
                    }),
                    columns : Ext.Array.merge(this.getColumns(), this.getActionColumns())
                }
            ];

            this.on('show', function() {
                var query = this.down('#query');

                query && query.focus();
                setTimeout(function() {
                    me.load()
                }, 0)
            });

            me.callParent(arguments);
        },

        getDockedTop : function() {
            var me = this,
                dockedTop = [];

            if (this.getSearchFields().length) {
                dockedTop.push({
                    xtype : 'toolbar',
                    dock : 'top',
                    items : [
                        {
                            xtype : 'combobox',
                            itemId : 'filterName',
                            store : Ext.create('Ext.data.Store', {
                                fields : ['fieldName', 'displayName'],
                                data : this.getSearchFields()
                            }),
                            displayField : 'displayName',
                            valueField : 'fieldName',
                            editable : false,
                            forceSelection : true,
                            allowBlank : false,
                            value : this.getSearchFields()[0].fieldName
                        },
                        {
                            xtype : 'textfield',
                            itemId : 'query',
                            listeners : {
                                specialkey : function(field, e) {
                                    if (e.getKey() === e.ENTER) {
                                        me.handleSearchClick();
                                    }
                                }
                            },
                            flex : 1
                        },
                        {
                            xtype : 'button',
                            text : i18n.gettext('Search'),
                            cls : 'criterion-btn-feature',
                            handler : function() {
                                me.handleSearchClick();
                            }
                        }
                    ]
                });
            }

            if (this.getExtraItems() && this.getExtraItems().length) {
                dockedTop.push({
                    xtype : 'toolbar',
                    padding : '0 15 10 25',
                    dock : 'top',
                    items : this.getExtraItems()
                });
            }

            return dockedTop;
        },

        handleSearchClick : function() {
            var store = this.down('grid').getStore(),
                me = this,
                query,
                extraParams = store.getProxy().getExtraParams(),
                filterName;

            if (this.down('#query')) {
                query = this.down('#query').getValue().trim();
            }

            if (!this.getLocalFiltering()) {
                Ext.Object.each(extraParams, function(key, value) {
                    if (Ext.Array.findBy(me.getSearchFields(), function(item) {
                        return item.fieldName === key;
                    })) {
                        delete extraParams[key];
                    }
                });

                if (query) {
                    extraParams[this.down('#filterName').getValue()] = query;
                }

                store.getProxy().setExtraParams(extraParams);

                this.load();
            } else {
                store.clearFilter();

                if (query) {
                    filterName = this.down('#filterName').getValue();

                    store.filterBy(function(record) {
                        return record.get(filterName).toLowerCase().indexOf(query.toLowerCase()) > -1;
                    });
                }

            }

        },

        handleSelectClick : function(grid, rowIndex, colIndex) {
            this.fireEvent('select', grid.getStore().getAt(rowIndex));
            Ext.Function.defer(function() {
                this.close();
            }, 100, this);
        },

        load : function(opts) {
            var store = this.down('grid').getStore();

            if (store.pageSize) {
                store.loadPage(1, opts || {});
            } else {
                store.load(opts || {});
            }
        }
    };

});

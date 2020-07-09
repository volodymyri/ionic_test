Ext.define('criterion.view.CodeDataPicker', function() {

    return {
        alias : [
            'widget.criterion_code_data_picker'
        ],

        extend : 'criterion.ux.Panel',

        requires : [
            'criterion.ux.grid.column.Action',
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

        config : {
            codeDataId : null,
            filters : null
        },

        title : i18n.gettext('Search'),

        closable : true,
        draggable : true,
        layout : 'fit',

        defaultListenerScope : true,

        listeners : {
            show : 'onShow'
        },

        tbar : [
            {
                xtype : 'combobox',
                store : Ext.create('Ext.data.Store', {
                    fields : ['fieldName', 'displayName'],
                    data : [
                        {
                            fieldName : 'description',
                            displayName : 'Description'
                        }
                    ]
                }),
                displayField : 'displayName',
                valueField : 'fieldName',
                editable : false,
                forceSelection : true,
                allowBlank : false,
                value : 'description',
                listeners : {
                    change : 'handleSearchTypeChange'
                }
            },
            {
                xtype : 'textfield',
                itemId : 'query',
                listeners : {
                    buffer : '300',
                    change : 'handleSearch'
                },
                flex : 1
            }
        ],

        items : {
            xtype : 'criterion_gridpanel',
            store : {
                type : 'criterion_code_table_details',
                sorters : {
                    property : 'description',
                    direction : 'DESC'
                }
            },
            columns : [
                {
                    xtype : 'gridcolumn',
                    text : i18n.gettext('Description'),
                    dataIndex : 'description',
                    flex : 1
                },
                {
                    xtype : 'criterion_actioncolumn',
                    width : criterion.Consts.UI_DEFAULTS.ACTION_COL_ITEM_WIDTH,
                    items : [
                        {
                            glyph : criterion.consts.Glyph['ios7-arrow-forward'],
                            tooltip : i18n.gettext('Select'),
                            handler : 'handleSelect'
                        }
                    ]
                }
            ]
        },

        initComponent : function() {
            var me = this,
                codeDataId = me.getCodeDataId();

            this.callParent();

            if (!codeDataId) {
                throw new Error('criterion.view.CodeDataPicker : codeDataId is undefined');
            }

            criterion.CodeDataManager.load([me.getCodeDataId()], this.onCodeDataLoad, this);
        },

        onCodeDataLoad : function() {
            var codeDataStore = criterion.CodeDataManager.getStore(this.getCodeDataId()),
                store = this.down('criterion_gridpanel').getStore();

            store.loadData(codeDataStore.getRange());
            this.handleSearch();
        },

        handleSearchTypeChange : function() {
            this.down('#query').setValue();
            this.handleSearch();
        },

        handleSearch : function() {
            var filters = this.getFilters(),
                store = this.down('criterion_gridpanel').getStore(),
                query;

            if (this.down('#query')) {
                query = this.down('#query').getValue().trim();
            }

            store.clearFilter();
            filters && store.addFilter(filters);
            if (query) {
                store.addFilter({
                    property : this.down('combo').getValue(),
                    value : query,
                    operator : 'like'
                });
            }
        },

        handleSelect : function(grid, rowIndex) {
            var me = this;

            me.fireEvent('select', grid.getStore().getAt(rowIndex));
            Ext.Function.defer(function() {
                me.close();
            }, 1);
        },

        onShow : function() {
            this.down('#query').focus();
        }
    };
});
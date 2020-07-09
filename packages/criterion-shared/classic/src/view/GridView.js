Ext.define('criterion.view.GridView', function() {

    return {
        alias : [
            'widget.criterion_gridview'
        ],

        extend : 'criterion.ux.grid.Panel',

        requires : [
            'criterion.ux.plugin.Sidebar',
            'criterion.controller.GridView',
            'Ext.grid.plugin.RowEditing'
        ],

        rowEditing : false,
        /**
         * Probably deprecated option, used only in {@link criterion.ux.grid.PanelExtended|
         * @deprecated
         */
        useDefaultTbar : false,
        /**
         * Probably deprecated option, used only in {@link criterion.ux.grid.PanelExtended|
         * @deprecated
         */
        useDefaultActionColumn : false,
        /**
         * special config for pages with {@see criterion.view.settings.EmployerBar}
         */
        controlEmployerBar : false,

        controller : {
            type : 'criterion_gridview'
        },

        config : {
            preventStoreLoad : false
        },

        listeners : {
            scope : 'controller',
            rowselect : 'handleRowSelect',
            canceledit : 'handleCancelEdit',
            edit : 'handleAfterEdit',
            removeaction : 'handleRemoveAction',
            editaction : 'handleEditAction',
            moveupaction : 'handleMoveUpAction',
            movedownaction : 'handleMoveDownAction',
            activate : 'handleActivate',
            show : 'handleShow',
            beforeedit : 'handleBeforeEdit',
            beforecellclick : 'handleBeforeCellClick',
            afterrender : 'handleAfterRender'
        },

        viewConfig : {
            listeners : {
                scope : 'this',
                canceledit : function() {
                },
                selectionchange : function(selModel, models) {
                    this.fireEvent('rowselect', models[0]);
                }
            }
        },

        tbar : [
            {
                xtype : 'button',
                reference : 'addButton',
                text : i18n.gettext('Add'),
                cls : 'criterion-btn-feature',
                listeners : {
                    click : 'handleAddClick'
                }
            },
            '->',
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

        setFilters : function(filtersConfig) {
            var store = this.getStore();
            store.clearFilter(true);
            store.setFilters([
                function(item) {
                    var vals = Ext.isArray(filtersConfig.value) ? filtersConfig.value : [filtersConfig.value];
                    return Ext.Array.indexOf(vals, item.get(filtersConfig.property)) !== -1;
                }
            ]);
        },

        initComponent : function() {
            var me = this;

            if (me.rowEditing) {

                if (!me.plugins) {
                    me.plugins = [];
                }

                me.plugins.push(
                    {
                        ptype : 'rowediting',
                        pluginId : 'rowEditing',
                        clicksToMoveEditor : 1,
                        clicksToEdit : 1,
                        autoUpdate : true,
                        errorSummary : false
                    }
                );
            }

            // Right side of the all grids can be moved to left. It is better don't allow user to do that
            if (Ext.isObject(me.columns)) {
                me.columns.items[me.columns.items.length - 1]['resizable'] = false;
            } else if (me.columns.length) {
                me.columns[me.columns.length - 1]['resizable'] = false;
            }

            me.callParent(arguments);
        }
    };
});

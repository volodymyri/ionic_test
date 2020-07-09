Ext.define('criterion.ux.grid.PanelExtended', function() {

    return {
        extend : 'criterion.grid.Panel',

        alias : [
            'widget.criterion_gridpanel_extended'
        ],

        mixins : [
            'criterion.ux.mixin.Component'
        ],

        requires : [
            'Ext.grid.plugin.RowEditing'
        ],

        // Fixes issue with incorect action column width
        //reserveScrollbar : true,

        columnLines : false,

        enableLocking : false,

        rowEditing : true,

        useDefaultTbar : true,

        useDefaultActionColumn : true,
        /**
         * Name of int field to order records in store. Will add "up" and "down" buttons to default action column.
         */
        orderField : null,

        leftAlignActionColumns : false,

        hasOwnSelModel : false,

        /**
         *
         * @param selModel
         * @param models
         */
        handleSelectionChange : function(selModel, models) {
            this.fireEvent('rowselect', this, models[0]);
        },

        getSelectionModel : function() {
            var me = this,
                selModel = me.selModel,
                addListener;

            addListener = !selModel || !selModel.hasRelaySetup;

            selModel = this.callParent(arguments);

            if (addListener) {
                // Fixes missing context in default selectionchange
                this.mon(selModel, 'selectionchange', me.handleSelectionChange, this);
            }

            return selModel;
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
                        errorSummary : false
                    }
                );
            }

            // Dont allow to change selection model
            if (!me.hasOwnSelModel) {
                me.selModel = null;
                me.selType = 'rowmodel';
                me.simpleSelect = true;
            }

            if (!me.tbar && me.useDefaultTbar) {
                me.tbar = me.getDefaultTbar();
            }

            if (!me.columns) {
                me.columns = [];
            }
            if (me.useDefaultActionColumn) {
                me.columns[me.leftAlignActionColumns ? 'unshift' : 'push'](me.getDefaultActionColumn());
            }

            me.on('beforecellclick', this.handleBeforeCellClick, this);

            me.callParent(arguments);
        },

        reconfigure : function(store, columns) {
            var me = this;

            if (columns && me.useDefaultActionColumn) {
                columns[me.leftAlignActionColumns ? 'unshift' : 'push'](me.getDefaultActionColumn());
            }

            me.callParent(arguments);
        },

        getAddButton : function(cfg) {
            return Ext.apply({
                xtype : 'button',
                cls : 'criterion-btn-primary',
                text : i18n.gettext('Add'),
                action : 'add'
            }, cfg);
        },

        getRefreshButton : function(cfg) {
            return Ext.apply({
                xtype : 'button',
                action : 'refresh',
                cls : 'criterion-btn-transparent',
                glyph : criterion.consts.Glyph['ios7-refresh-empty'],
                scale : 'medium'
            }, cfg);
        },

        getDefaultTbar : function(cfg, addCfg, refreshCfg) {
            return Ext.apply({
                items : [
                    this.getAddButton(addCfg),
                    '->',
                    this.getRefreshButton(refreshCfg)
                ]
            });
        },

        getEditAction : function(cfg) {
            return Ext.apply({
                glyph : criterion.consts.Glyph['ios7-compose-outline'],
                tooltip : i18n.gettext('Modify'),
                text : '',
                action : 'editaction',
                permissionAction : this.permissionEditAction
            }, cfg);
        },

        permissionEditAction : null,

        getDeleteAction : function(cfg) {
            return Ext.apply({
                glyph : criterion.consts.Glyph['ios7-trash-outline'],
                tooltip : i18n.gettext('Delete'),
                text : '',
                action : 'removeaction',
                permissionAction : this.permissionDeleteAction
            }, cfg);
        },

        permissionDeleteAction : null,

        getMoveUpAction : function(cfg) {
            return Ext.apply({
                glyph : criterion.consts.Glyph['ios7-arrow-thin-up'],
                tooltip : i18n.gettext('Move Up'),
                text : '',
                action : 'moveupaction',
                permissionAction : this.permissionMoveUpAction
            }, cfg);
        },

        permissionMoveUpAction : null,

        getMoveDownAction : function(cfg) {
            return Ext.apply({
                glyph : criterion.consts.Glyph['ios7-arrow-thin-down'],
                tooltip : i18n.gettext('Move Down'),
                text : '',
                action : 'movedownaction',
                permissionAction : this.permissionMoveDownAction
            }, cfg);
        },

        permissionMoveDownAction : null,

        getDefaultActionColumn : function(cfg, editCfg, deleteCfg) {
            var items = [],
                width = criterion.Consts.UI_DEFAULTS.ACTION_COL_ITEM_WIDTH;

            if (this.orderField) {
                width = criterion.Consts.UI_DEFAULTS.ACTION_COL_ITEM_WIDTH * 3;
                items = items.concat([
                    this.getMoveDownAction(editCfg),
                    this.getMoveUpAction(deleteCfg)
                ]);
            }

            return Ext.apply({
                xtype : 'criterion_actioncolumn',
                sortable : false,
                hideable : false,
                resizable : false,
                menuDisabled : true,
                editRenderer : Ext.emptyFn,
                stopSelection : false,
                width : width,
                items : items
            }, cfg);
        },

        handleBeforeCellClick : function(grid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
            var cbModelClick = (grid.getSelectionModel() && grid.getSelectionModel().type == 'checkboxmodel' && cellIndex == 0),
                actionClick = (e.position && e.position.column && e.position.column.xtype == 'criterion_actioncolumn');

            if (!actionClick && !cbModelClick && this.hasListener('editaction') &&
                (!this.getViewModel() || this.getViewModel() && !this.getViewModel().get('preventEditing'))) {
                this.fireEvent('editaction', record);
                return false;
            } else {
                return true;
            }
        }
    };

});

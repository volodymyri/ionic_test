Ext.define('criterion.ux.grid.Panel', function() {

    return {
        alias : [
            'widget.criterion_gridpanel'
        ],

        alternateClassName : [
            'criterion.grid.Panel',
            'criterion.GridPanel'
        ],

        extend : 'Ext.grid.Panel',

        mixins : [
            'criterion.ux.mixin.Component'
        ],

        requires : [
            'Ext.grid.column.CheckColumn',
            'Ext.grid.column.RowNumberer',
            'Ext.grid.column.Date',
            'Ext.grid.column.Number',
            'Ext.grid.column.Boolean',
            'criterion.ux.grid.column.CodeData',
            'criterion.ux.grid.column.Action',
            'criterion.ux.grid.column.Widget',
            'criterion.ux.grid.column.WidgetMultiType',
            'criterion.ux.grid.column.Currency'
        ],

        componentCls : 'criterion-grid-panel',

        columnLines : false,

        enableLocking : false,

        disableGrouping : false,

        emptyText : i18n.gettext('No records'),

        initComponent : function() {
            var me = this;

            if (criterion.Application.isAdmin() && !me.disableGrouping) {
                me._addGroupingFeature();
            }

            me.callParent(arguments);

            // var header = me.getHeaderContainer();

            me.headerCt.itemSeparatorDisabled = true;
            me.headerCt.on('menucreate', function() {
                var menu = me.headerCt.getMenu(),
                    headerMenu = me.headerCt.getHeaderMenu();

                menu.addCls('criterion-grid-menu');
                headerMenu.addCls('criterion-grid-menu');
            });
        },

        _addGroupingFeature : function() {
            var features = this.features || [],
                groupingFeature;

            if (!Ext.isArray(features)) {
                features = [features];
            }

            groupingFeature = Ext.Array.findBy(features, function(feature) {
                if (feature.ftype === 'grouping') {
                    return true;
                }
            });

            if (!groupingFeature) {
                features.push({
                    ftype : 'grouping',
                    groupHeaderTpl : '{columnName}: {name:htmlEncode}'
                });

                this.features = features;
            }
        }
    };

});

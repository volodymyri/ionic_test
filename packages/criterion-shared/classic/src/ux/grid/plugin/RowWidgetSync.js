Ext.define('criterion.ux.grid.plugin.RowWidgetSync', function() {

    return {

        alias : 'plugin.criterion_row_widget_sync',

        extend : 'criterion.ux.grid.plugin.RowWidget',

        requires : [
            'criterion.ux.grid.feature.RowBodySync'
        ],

        getFeatureConfig : function(grid) {
            var me = this,
                features = [],
                featuresCfg = {
                    ftype : 'criterion_row_body_sync',
                    rowExpander : me,
                    doSync : false,
                    rowIdCls : me.rowIdCls,
                    bodyBefore : me.bodyBefore,
                    recordsExpanded : me.recordsExpanded,
                    rowBodyHiddenCls : me.rowBodyHiddenCls,
                    rowCollapsedCls : me.rowCollapsedCls,
                    setupRowData : me.setupRowData,
                    setup : me.setup,

                    // Do not relay click events into the client grid's row
                    onClick : Ext.emptyFn
                };

            features.push(Ext.apply({
                lockableScope : 'normal'
            }, featuresCfg));

            // Locked side will need a copy to keep the two DOM structures symmetrical.
            // A lockedWidget config is available to create content in locked side.
            // The enableLocking flag is set early in Ext.panel.Table#initComponent if any columns are locked.
            if (grid.enableLocking) {
                features.push(Ext.apply({
                    lockableScope : 'locked'
                }, featuresCfg));
            }

            return features;
        },

        constructor : function(config) {
            this.callParent(arguments);
            this._syncColumnState = Ext.Function.createBuffered(this.syncColumnState, 100, this);
        },

        afterToggleRowActions : function(rowIdx, record) {
            this.syncColumnState();
        },

        syncColumnState : function() {
            var rowExpander = this,
                recordsExpandedInternalIds = Ext.Object.getAllKeys(rowExpander.recordsExpanded),
                view = rowExpander.normalView || rowExpander.view,
                store = rowExpander && rowExpander.grid && rowExpander.grid.getStore();

            Ext.Array.each(recordsExpandedInternalIds, function(recordsExpandedInternalId) {
                var recordExpanded = store.getByInternalId(recordsExpandedInternalId),
                    internalGridPanel = recordExpanded && rowExpander.getWidget(view, recordExpanded),
                    mainColumns = view.grid.getColumns(),
                    innerColumns = internalGridPanel && internalGridPanel.getColumns(),
                    innerColumnsMap = {},
                    widthSync = 0;

                if (!innerColumns) {
                    return;
                }

                Ext.Array.each(innerColumns, function(iclm) {
                    innerColumnsMap[iclm.dataIndex] = iclm;
                });

                Ext.Array.each(mainColumns, function(clm) {
                    var innCl = innerColumnsMap[clm.dataIndex],
                        width = clm.getWidth();

                    if (clm.isExpanderEl) {
                        return;
                    }
                    if (innCl) {
                        innCl.setWidth(width)
                    } else {
                        widthSync += width;
                    }
                });

                innerColumnsMap['__internalWidthSync__'].setWidth(widthSync)
            })
        }
    }
});

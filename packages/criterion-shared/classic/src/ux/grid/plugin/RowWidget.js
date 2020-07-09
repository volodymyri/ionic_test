Ext.define('criterion.ux.grid.plugin.RowWidget', function() {

    return {

        alias : 'plugin.criterion_rowwidget',

        extend : 'Ext.grid.plugin.RowWidget',

        allowExpander : function(record) {
            return true;
        },

        getHeaderConfig : function() {
            var me = this,
                lockable = me.grid.lockable && me.grid;

            return {
                width : me.headerWidth,
                ignoreExport : true,
                lockable : false,
                autoLock : true,
                sortable : false,
                resizable : false,
                draggable : false,
                hideable : false,
                menuDisabled : true,
                isExpanderEl : true,
                tdCls : Ext.baseCSSPrefix + 'grid-cell-special',
                innerCls : Ext.baseCSSPrefix + 'grid-cell-inner-row-expander',
                encodeHtml : false,
                renderer : function(i, gridcell, record) {
                    return me.allowExpander(record) ? '<div class="' + Ext.baseCSSPrefix + 'grid-row-expander" role="presentation" tabIndex="0"></div>' : '';
                },
                processEvent : function(type, view, cell, rowIndex, cellIndex, e, record) {
                    var isTouch = e.pointerType === 'touch',
                        isExpanderClick = !!e.getTarget('.' + Ext.baseCSSPrefix + 'grid-row-expander');

                    if ((type === "click" && isExpanderClick) || (type === 'keydown' && e.getKey() === e.SPACE)) {

                        // Focus the cell on real touch tap.
                        // This is because the toggleRow saves and restores focus
                        // which may be elsewhere than clicked on causing a scroll jump.
                        if (isTouch) {
                            cell.focus();
                        }
                        me.toggleRow(rowIndex, record, e);
                        e.stopSelection = !me.selectRowOnExpand;
                    } else if (e.type === 'mousedown' && !isTouch && isExpanderClick) {
                        e.preventDefault();
                    }
                },

                // This column always migrates to the locked side if the locked side is visible.
                // It has to report this correctly so that editors can position things correctly
                isLocked : function() {
                    return lockable && (lockable.lockedGrid.isVisible() || this.locked);
                },

                // In an editor, this shows nothing.
                editRenderer : function() {
                    return '&#160;';
                }
            };
        },

        afterToggleRowActions : function(rowIdx, record) {},

        privates : {

            toggleRow : function(rowIdx, record) {
                var me = this,
                    // If we are handling a lockable assembly,
                    // handle the normal view first
                    view = me.normalView || me.view;

                this.callParent(arguments);

                Ext.defer(function() {
                    view.refreshSize(true);
                    me.afterToggleRowActions(rowIdx, record);
                }, 100)
            }
        }
    }
});

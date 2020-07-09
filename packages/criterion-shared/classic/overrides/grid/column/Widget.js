Ext.define('criterion.overrides.grid.column.Widget', {

    override : 'Ext.grid.column.Widget',

    privates : {
        onItemAdd : function(records) {
            var me = this,
                view = me.getView(),
                hasAttach = !!me.onWidgetAttach,
                dataIndex = me.dataIndex,
                isFixedSize = me.isFixedSize,
                len = records.length, i,
                record,
                cell,
                widget,
                el,
                focusEl,
                width;

            // Loop through all records added, ensuring that our corresponding cell in each item
            // has a Widget of the correct type in it, and is updated with the correct value from the record.
            if (me.isVisible(true)) {
                for (i = 0; i < len; i++) {
                    record = records[i];
                    if (record.isNonData) {
                        continue;
                    }

                    cell = view.getCell(record, me);

                    // May be a placeholder with no data row
                    if (cell) {
                        cell = cell.firstChild;
                        if (!isFixedSize && !width && me.lastBox) {
                            width = me.lastBox.width - parseInt(me.getCachedStyle(cell, 'padding-left'), 10) - parseInt(me.getCachedStyle(cell, 'padding-right'), 10);
                        }

                        widget = me.getWidget(record);
                        widget.$widgetColumn = me;
                        widget.$widgetRecord = record;

                        // Render/move a widget into the new row
                        Ext.fly(cell).empty();

                        // Call the appropriate setter with this column's data field
                        if (widget.defaultBindProperty && dataIndex) {
                            widget.setConfig(widget.defaultBindProperty, record.get(dataIndex));
                        }

                        el = widget.el || widget.element;

                        if (el && el.destroyed) { // <-- changed
                            continue;
                        }                         // <---

                        if (el) {
                            cell.appendChild(el.dom);
                            if (!isFixedSize) {
                                widget.setWidth(width);
                            }
                            widget.reattachToBody();
                        } else {
                            if (!isFixedSize) {
                                // Must have a width so that the initial layout works
                                widget.width = width || 100;
                            }
                            widget.render(cell);
                        }

                        // We have to run the callback *after* reattaching the Widget
                        // back to the document body. Otherwise widget's layout may fail
                        // because there are no dimensions to measure when the callback is fired!
                        if (hasAttach) {
                            Ext.callback(me.onWidgetAttach, me.scope, [me, widget, record], 0, me);
                        }

                        // If the widget has a focusEl, ensure that its tabbability status is synched
                        // with the view's navigable/actionable state.
                        focusEl = widget.getFocusEl();

                        if (focusEl) {
                            if (view.actionableMode) {
                                if (!focusEl.isTabbable()) {
                                    focusEl.restoreTabbableState();
                                }
                            } else {
                                if (focusEl.isTabbable()) {
                                    focusEl.saveTabbableState();
                                }
                            }
                        }
                    }
                }
            } else {
                view.refreshNeeded = true;
            }
        }
    }


});

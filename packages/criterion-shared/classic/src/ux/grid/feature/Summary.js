Ext.define('criterion.ux.grid.feature.Summary', {

    extend : 'Ext.grid.feature.Summary',

    alias : 'feature.criterion_summary',

    onStoreUpdate : function(store) {
        var me = this,
            view = me.view,
            selector = me.summaryRowSelector,
            dock = me.dock,
            record, newRowDom, oldRowDom, p;

        if (!view.rendered) {
            return;
        }

        record = me.createSummaryRecord(view);
        newRowDom = Ext.fly(view.createRowElement(record, -1)).down(selector, true);

        if (!newRowDom) {
            return;
        }

        // Summary row is inside the docked summaryBar Component
        if (dock) {
            p = me.summaryBar.item.dom.firstChild;
            oldRowDom = p.firstChild;

            p.insertBefore(newRowDom, oldRowDom);
            p.removeChild(oldRowDom);

            // If docked, the updated row will need sizing because it's outside the View
            me.onColumnHeaderLayout();
        }
        // Summary row is a regular row in a THEAD inside the View.
        // Downlinked through the summary record's ID
        else {
            oldRowDom = view.el.down(selector, true);
            p = oldRowDom && oldRowDom.parentNode;

            if (p) {
                p.removeChild(oldRowDom);
            }

            if (!store.count()) {
                Ext.defer(function() {
                    oldRowDom = view.el.down(selector, true);
                    p = oldRowDom && oldRowDom.parentNode;

                    if (p) {
                        p.removeChild(oldRowDom);
                    }
                }, 100);
                return;
            }

            // We're always inserting the new summary row into the last rendered row,
            // unless no rows exist. In that case we will be appending to the special
            // placeholder in the node container.
            p = view.getRow(view.all.last());

            if (p) {
                p = p.parentElement;
            }
            // View might not have nodeContainer yet.
            else {
                p = me.getSummaryRowPlaceholder(view);
                p = p && p.tBodies && p.tBodies[0];
            }

            if (p) {
                p.appendChild(newRowDom);
            }
        }
    }
});

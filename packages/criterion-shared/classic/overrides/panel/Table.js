Ext.define('criterion.overrides.panel.Table', {

    override : 'Ext.panel.Table'

    // @todo kill after 08/01/2020
    // update ExtJS 7.0 -> 7.2

    // onItemAdd : function(records, index, nodes, view) {
    //     var me = this,
    //         recCount = records.length,
    //         freeRowContexts = me.freeRowContexts,
    //         liveRowContexts = me.liveRowContexts || (me.liveRowContexts = {}),
    //         rowContext, i, record;
    //
    //     // Ensure we have RowContexts ready for all the widget owners
    //     // (Widget columns or RowWidget plugin) which will be needing instantiated
    //     // Widgets with attached ViewModels.
    //     for (i = 0; i < recCount; i++) {
    //         record = records[i];
    //
    //         // We may have already been informed about the addition of this item
    //         // by the opposite locking partner
    //         if (!liveRowContexts[record.internalId]) {
    //             // <----- CHANGED ---------
    //             if (freeRowContexts) {
    //                 // find in freeRowContexts by
    //                 rowContext = Ext.Array.findBy(freeRowContexts, function(cntx) {
    //                     return cntx['__recordInternalId__'] === record.internalId;
    //                 });
    //
    //                 if (rowContext) {
    //                     Ext.Array.remove(freeRowContexts, rowContext)
    //                 } else if (freeRowContexts.length) {
    //                     // default
    //                     rowContext = freeRowContexts.shift();
    //                 }
    //             } else {
    //                 rowContext = null;
    //             }
    //             // / <----- CHANGED ---------
    //
    //             // Need a new one
    //             if (!rowContext) {
    //                 rowContext = new Ext.grid.RowContext({
    //                     ownerGrid : me
    //                 });
    //             }
    //
    //             me.liveRowContexts[record.internalId] = rowContext;
    //             rowContext.setRecord(record, index++);
    //         }
    //     }
    // },
    //
    // onItemRemove : function(records, index, nodes, view) {
    //     var me = this,
    //         freeRowContexts = me.freeRowContexts || (me.freeRowContexts = []),
    //         liveRowContexts = me.liveRowContexts,
    //         len = nodes.length,
    //         i, id, context;
    //
    //     for (i = 0; i < len; i++) {
    //         id = nodes[i].getAttribute('data-recordId');
    //         context = liveRowContexts[id];
    //
    //         // We may have already been informed about the removal of this item
    //         // by the opposite locking partner
    //         if (context) {
    //             context['__recordInternalId__'] = parseInt(id, 10);  // <<< ------ CHANGED ---------
    //             context.free(view);
    //             freeRowContexts.push(context);
    //             delete liveRowContexts[id];
    //         }
    //     }
    // }
});

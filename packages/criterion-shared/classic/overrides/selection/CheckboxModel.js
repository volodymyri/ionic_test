/**
 * 1. Sencha bug fix. EXTJS-16164 in 5.1.1.
 * 2. added support skipping record from selection
 */
Ext.define('criterion.overrides.selection.CheckboxModel', {

    override : 'Ext.selection.CheckboxModel',

    headerWidth : 45,

    canBeUnselectable : true,

    getHeaderConfig : function() {
        var cfg = this.callParent(arguments);

        /*
            sample:

             checkColumnRenderer : function(value, meta, record) {
                 var me = this,
                 cls = me.checkboxCls;

                 if (value) {
                    cls += ' ' + me.checkboxCheckedCls;
                 }

                 if (record.get('skipped')) {
                     record.markAsSkippedForSelection = true;
                     return '';
                 } else {
                     delete record.markAsSkippedForSelection;
                     return '<span class="tg-checkbox ' + cls + '"></span>';
                 }
             }
         */

        if (Ext.isFunction(this.checkColumnRenderer)) {
            cfg.renderer = this.checkColumnRenderer;
        }

        return cfg;
    },

    onHeaderClick : function(headerCt, header, e) {
        var me = this,
            store = me.store,
            isChecked, records, i, len,
            selections, selection;

        if (me.showHeaderCheckbox !== false && header === me.column && me.mode !== 'SINGLE') {
            e.stopEvent();
            isChecked = header.el.hasCls(Ext.baseCSSPrefix + 'grid-hd-checker-on');

            // selectAll will only select the contents of the store, whereas deselectAll
            // will remove all the current selections. In this case we only want to
            // deselect whatever is available in the view.
            if (isChecked) {
                records = [];
                selections = this.getSelection();
                for (i = 0, len = selections.length; i < len; ++i) {
                    selection = selections[i];
                    if (store.indexOf(selection) > -1) {
                        records.push(selection);
                    }
                }
                if (records.length > 0) {
                    me.deselect(records);
                }
            } else {
                // <- changed
                if (!me.canBeUnselectable) {
                    me.selectAll();
                } else {
                    records = [];
                    store.each(function(rec) {
                        if (!rec.markAsSkippedForSelection) {
                            records.push(rec);
                        }
                    });

                    if (records.length > 0) {
                        me.doSelect(records, true);
                    }
                }
            }
        }
    },

    updateHeaderState : function() {
        // check to see if all records are selected
        var me = this,
            store = me.store,
            storeCount = store.getCount(),
            views = me.views,
            hdSelectStatus = false,
            selectedCount = 0,
            selected, len, i;

        // <-- add this
        store.each(function(rec) {
            if (!rec.markAsSkippedForSelection) {
                ++storeCount;
            }
        });
        //

        if (!store.isBufferedStore && storeCount > 0) {
            selected = me.selected;
            hdSelectStatus = true;

            for (i = 0, len = selected.getCount(); i < len; ++i) {
                if (store.indexOfId(selected.getAt(i).id) > -1) {
                    ++selectedCount;
                }
            }

            hdSelectStatus = storeCount === selectedCount;
        }

        if (views && views.length) {
            me.column.setHeaderStatus(hdSelectStatus);
        }
    },

    processColumnEvent : function(type, view, cell, recordIndex, cellIndex, e, record, row) {
        if (type === 'click' && record && record.markAsSkippedForSelection) {
            return;
        }
        this.callParent(arguments);
    },

    onSelectChange : function(record, isSelected) {
        if (record && record.markAsSkippedForSelection) {
            return;
        }

        this.callParent(arguments);
    },

    privates : {

        selectWithEventMulti : function(record, e, isSelected) {
            var me = this;

            if (!e.shiftKey && !e.ctrlKey && e.getTarget(me.checkSelector)) { // <-- changed
                if (isSelected) {
                    me.doDeselect(record);
                } else {
                    me.doSelect(record, true);
                }
            } else {
                me.callParent([record, e, isSelected]);
            }
        }
    }
});

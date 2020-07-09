Ext.define('criterion.controller.reports.dataGrid.editor.Base', function() {
    return {

        extend : 'criterion.app.ViewController',

        requires : [
            'criterion.view.reports.dataGrid.ColumnCriteriaEditor'
        ],

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex'
        ],

        handleColumnSelectionChange() {
            this.syncSelections();
        },

        handleColumnBeforeSelection() {
        },

        syncSelections(records) {
        },

        handleEditCriteria(record, column) {
            let me = this,
                columnEditor;

            if (Ext.Array.contains(['criteria', 'sort'], column.dataIndex)) {
                columnEditor = Ext.create('criterion.view.reports.dataGrid.ColumnCriteriaEditor', {
                    viewModel : {
                        data : {
                            columnData : Ext.clone(record.getData())
                        }
                    }
                });

                columnEditor.show();

                Ext.defer(() => me.setCorrectMaskZIndex(true), 10);

                columnEditor.on({
                    save : columnData => record.set(columnData),
                    close : () => me.setCorrectMaskZIndex(false)
                });
            }
        },

        setSelectionFromUsed() {
        },

        onAfterRemoveUsedColumn() {
            this.setSelectionFromUsed();
        }
    }

});

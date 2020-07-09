Ext.define('criterion.controller.settings.system.overtime.OvertimeSequence', function() {

    function updateRecordsOrder(store, fieldName) {
        Ext.each(store.getRange(), function(record, index) {
            record.set(fieldName, index + 1);
        })
    }

    return {

        extend : 'criterion.controller.GridView',

        alias : 'controller.criterion_settings_overtime_sequence',

        requires : [
            'criterion.view.settings.system.overtime.IncomeForm'
        ],

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex'
        ],

        editor : {
            xtype : 'criterion_settings_overtime_income_form',
            allowDelete : true
        },

        createEditor : function(editor, record) {
            var me = this,
                editor = Ext.create(editor),
                incomeLists = this.getViewModel().get('incomeLists');

            editor.setTitle((record.phantom ? 'Add' : 'Edit') + ' ' + editor.getTitle());

            editor.getViewModel().set('incomeLists', incomeLists);

            editor.on('close', function() {
                me.setCorrectMaskZIndex(false);
            });

            editor.show();

            me.setCorrectMaskZIndex(true);

            return editor;
        },

        renderIncome : function(value) {
            var vm = this.getViewModel(),
                incomeLists = vm.getStore('incomeLists'),
                record = incomeLists.getById(value);

            return record && record.get('description');
        },

        handleMoveUpAction : function(record, grid) {
            var store = grid.getStore(),
                range = store.getRange(),
                rangeIdx = Ext.Array.indexOf(range, record),
                filters = store.getFilters();

            if (rangeIdx > 0) {
                if (filters.length) {
                    store.clearFilter();
                }

                var targetIdx = store.indexOf(range[rangeIdx - 1]);
                store.remove(record);
                store.insert(targetIdx, record);

                if (filters.length) {
                    store.setFilters(filters);
                }

                updateRecordsOrder(store, grid.orderField);
            }
        },

        handleMoveDownAction : function(record, grid) {
            var store = grid.getStore(),
                range = store.getRange(),
                rangeIdx = Ext.Array.indexOf(range, record),
                filters = store.getFilters();

            if (rangeIdx < range.length - 1) {
                if (filters.length) {
                    store.clearFilter();
                }

                var targetIdx = store.indexOf(range[rangeIdx + 1]);
                store.remove(record);
                store.insert(targetIdx, record);

                if (filters.length) {
                    store.setFilters(filters);
                }

                updateRecordsOrder(store, grid.orderField);
            }
        },

        handleAfterEdit: function() {
            updateRecordsOrder(this.getView().getStore(), this.getView().orderField);
        },

        onCancel : function() {
            this.getView().fireEvent('cancel');
        }
    }
});

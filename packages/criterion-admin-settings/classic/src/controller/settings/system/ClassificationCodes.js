Ext.define('criterion.controller.settings.system.ClassificationCodes', function() {

    function updateRecordsOrder(store, fieldName) {
        Ext.each(store.getRange(), function(record, index) {
            record.set(fieldName, index);
        })
    }

    return {

        extend : 'criterion.controller.employer.GridView',

        alias : 'controller.criterion_settings_classification_codes',

        requires : [
            'criterion.store.codeData.Types'
        ],

        createEditor : function(editor, record) {
            editor['viewModel'] = {
                stores : {
                    codeDataTypes : this.getView().codedataTypeStore
                }
            };

            return this.callParent([editor, record]);
        },

        onEmployerChange : function() {
            this.load();
        },

        handleActivate : function() {
            this.getView().codedataTypeStore.loadWithPromise().then(function() {
                this.load();
            }, null, null, this);
        },

        getEmptyRecord : function() {
            var lastRec = this.getView().getStore().last();

            return {
                employerId : this.getEmployerId(),
                sequence : ( lastRec ? (lastRec.get('sequence') + 1) : 0 )
            };
        },

        handleMoveUpAction : function(record, grid) {
            var store = grid.getStore(),
                range = store.getRange(),
                rangeIdx = Ext.Array.indexOf(range, record),
                filters = store.getFilters();

            if (rangeIdx > 0) {
                store.suspendAutoSync();
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
                store.resumeAutoSync(true);
            }
        },

        handleMoveDownAction : function(record, grid) {
            var store = grid.getStore(),
                range = store.getRange(),
                rangeIdx = Ext.Array.indexOf(range, record),
                filters = store.getFilters();

            if (rangeIdx < range.length - 1) {
                store.suspendAutoSync();
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
                store.resumeAutoSync(true);
            }
        }

    };

});

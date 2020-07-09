Ext.define('criterion.controller.settings.general.dataForm.FieldsGrid', function() {

    return {

        extend : 'criterion.controller.GridView',

        alias : 'controller.criterion_settings_general_data_form_fields_grid',

        getStore() {
            return this.getView().getStore();
        },

        storeOperation(fn) {
            let store = this.getStore(),
                storeFilters = store.getFilters().getRange(),
                res;

            store.clearFilter();
            res = fn();
            store.getFilters().replaceAll(storeFilters);

            return res;
        },

        getEmptyRecord() {
            let mainRec = this.getViewModel().get('record'),
                store = this.getStore(),
                maxSeq = this.storeOperation(() => {
                    return store.max('sequenceNumber') || 0
                });

            return {
                dataformId : mainRec.getId(),
                sequenceNumber : maxSeq + 1
            };
        },

        handleChangeShowHidden(cmp, value) {
            let store = this.getStore();

            store.clearFilter();

            if (!value) {
                store.setFilters([
                    {
                        property : 'isHidden',
                        value : false,
                        exactMatch : true
                    }
                ]);
            }
        },

        handleMoveUpAction(record, grid) {
            let store = record.store,
                sequenceNumber = record.get('sequenceNumber');

            this.storeOperation(() => {
                store.getAt(store.indexOf(record) - 1).set('sequenceNumber', sequenceNumber);
                record.set('sequenceNumber', sequenceNumber - 1);
            });
        },

        /**
         * @param record
         * @param grid
         */
        handleMoveDownAction(record, grid) {
            let store = record.store,
                sequenceNumber = record.get('sequenceNumber');

            this.storeOperation(() => {
                store.getAt(store.indexOf(record) + 1).set('sequenceNumber', sequenceNumber);
                record.set('sequenceNumber', sequenceNumber + 1);
            });
        }
    };
});

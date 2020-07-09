Ext.define('criterion.controller.reports.dataGrid.editor.Module', function() {
    return {

        extend : 'criterion.controller.reports.dataGrid.editor.Base',

        alias : 'controller.criterion_reports_data_grid_editor_module',

        requires : [
            'criterion.model.dataGrid.module.Column'
        ],

        init() {
            let vm = this.getViewModel();

            this.prepareColumns = Ext.Function.createDelayed(this.prepareColumns, 500, this);

            this.callParent(arguments);

            vm.bind({
                bindTo : '{moduleId}'
            }, this.prepareColumns, this);
        },

        prepareColumns(moduleId) {
            let vm = this.getViewModel();

            vm.set('availables', null);

            if (!moduleId) {
                return;
            }

            let moduleColumns = vm.get('moduleColumns'),
                inputStore = Ext.create('Ext.data.Store', {
                    model : 'criterion.model.dataGrid.module.Column',
                    sorters : [{
                        property : 'label',
                        direction : 'ASC'
                    }]
                }),
                removeAbsent = [];

            if (moduleId) {
                vm.get('moduleRecord.columns').cloneToStore(inputStore);
            }

            vm.set('availables', inputStore);

            moduleColumns.each(item => {
                let column;

                column = inputStore.getById(item.getId());

                if (!column) {
                    removeAbsent.push(item);
                }
            });

            if (removeAbsent.length) {
                moduleColumns.remove(removeAbsent);
            }

            this.setSelectionFromUsed();
        },

        setSelectionFromUsed() {
            let vm = this.getViewModel(),
                selectedIds,
                selected;

            selectedIds = Ext.Array.map(vm.get('moduleColumns').getRange(), item => item.getId());

            selected = Ext.Array.clean(Ext.Array.map(vm.get('availables').getRange(), item => (Ext.Array.contains(selectedIds, item.getId()) ? item : null)));

            this.lookup('availablesGrid').getSelectionModel().select(selected, false, true);
        },

        syncSelections(records) {
            let vm = this.getViewModel(),
                recs = records || this.lookup('availablesGrid').getSelection(),
                moduleColumns = vm.get('moduleColumns'),
                selectedIds,
                existedIds,
                forAdd = [],
                forDelete = [];

            // delete
            selectedIds = Ext.Array.map(recs, item => item.getId());

            Ext.Array.each(moduleColumns.getRange(), item => {
                if (!Ext.Array.contains(selectedIds, item.getId())) {
                    forDelete.push(item);
                }
            });

            forDelete.length && moduleColumns.remove(forDelete);

            // adding
            existedIds = Ext.Array.map(moduleColumns.getRange(), item => item.getId());

            Ext.Array.each(recs, item => {
                let columnId = item.getId(),
                    data;

                if (!Ext.Array.contains(existedIds, columnId)) {
                    data = {
                        columnId : columnId,
                        gridLabel : item.get('gridLabel'),
                        type : item.get('type'),
                        isAggregated : item.get('isAggregated')
                    };

                    forAdd.push(data);
                }
            });

            forAdd.length && moduleColumns.add(forAdd);
        }
    }

});

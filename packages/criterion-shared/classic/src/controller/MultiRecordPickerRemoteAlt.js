Ext.define('criterion.controller.MultiRecordPickerRemoteAlt', function() {

    return {

        alias : 'controller.criterion_multi_record_picker_remote_alt',

        extend : 'criterion.controller.MultiRecordPickerRemote',

        onChangeSelectedRecords : function() {
            var view = this.getView(),
                vm = this.getViewModel(),
                selectedRecordIds = vm.get('selectedRecords'),
                inputStore = vm.getStore('inputStore'),
                excludedIds = vm.get('excludedIds');

            vm.set('selectedRecordCount', selectedRecordIds.length);

            inputStore.clearFilter();

            // excludedIds values
            inputStore.addFilter({
                property : 'id',
                value : excludedIds,
                operator : 'notin'
            });

            inputStore.addFilter({
                id : 'selectedRecordIds',
                property : 'id',
                value : selectedRecordIds,
                operator : 'notin'
            });

            view.lookupReference('selectButton').setDisabled((!view.getAllowEmptySelect() ? !selectedRecordIds.length : false));
        },

        onStoreLoad : function() {
            var view = this.getView(),
                vm = this.getViewModel(),
                selectedRecordIds = vm.get('selectedRecords'),
                selectedRecords = [],
                inputStore = vm.getStore('inputStore'),
                selectedStore = vm.get('selectedStore'),
                grid = view.lookupReference('grid');

            if (!view.getMultiSelect()) {
                Ext.Array.each(selectedRecordIds, function(recId) {
                    selectedRecords.push(inputStore.getById(recId));
                });
                selectedRecords = Ext.Array.clean(selectedRecords);
                grid.getSelectionModel().select(selectedRecords);
            }

            if (selectedStore && selectedStore.isStore) {
                selectedStore.each(function(rec) {
                    var selectedRecordId = rec.getId(),
                        inpRec = inputStore.getById(selectedRecordId);

                    selectedRecordIds.push(selectedRecordId);
                    if (inpRec) {
                        rec.set(inpRec.getData());
                    }
                });

                vm.set('selectedRecords', Ext.Array.unique(selectedRecordIds));
                this.onChangeSelectedRecords();
            }

            grid.setLoading(false);
        },

        handleSelectAction : function(rec) {
            var vm = this.getViewModel(),
                selectedStore = vm.get('selectedStore');

            selectedStore.add(rec.getData());
            vm.get('selectedRecords').push(rec.getId());
            this.onChangeSelectedRecords();
        },

        handleRemoveAction : function(rec) {
            var vm = this.getViewModel(),
                selectedStore = vm.get('selectedStore'),
                id = rec.getId();

            selectedStore.remove(selectedStore.getById(id));
            vm.set('selectedRecords', Ext.Array.remove(vm.get('selectedRecords'), id));

            this.onChangeSelectedRecords();
        },

        onSelectButtonHandler : function() {
            var view = this.getView(),
                vm = this.getViewModel(),
                selected,
                excludedIds = vm.get('excludedIds'),
                selectedStore = vm.get('selectedStore');

            if (!view.getMultiSelect()) {
                selected = this.getView().lookupReference('grid').getSelection();

                if (vm.get('usePagination') && excludedIds) {
                    selected = Ext.Array.filter(selected, function(record) {
                        return !Ext.Array.contains(excludedIds, record.getId())
                    })
                }
            } else {
                selected = selectedStore.getRange();
            }

            view.fireEvent('selectRecords', selected);
            view.destroy();
        }

    }
});

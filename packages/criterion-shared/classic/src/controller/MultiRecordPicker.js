Ext.define('criterion.controller.MultiRecordPicker', function() {

    return {
        alias : 'controller.criterion_multi_record_picker',

        extend : 'criterion.app.ViewController',

        requires : [],

        onShow : function() {
            var view = this.getView(),
                viewModel = this.getViewModel(),
                cancelBtn = this.lookup('cancelBtn'),
                searchCombo = this.lookupReference('searchCombo'),
                grid = this.lookupReference('grid'),
                searchText = this.lookupReference('searchText'),
                columns = viewModel.get('gridColumns'),
                storeParams = viewModel.get('storeParams'),
                inputStore = viewModel.getStore('inputStore'),
                searchComboStore = Ext.create('Ext.data.Store', {fields : []});

            Ext.defer(function() {
                cancelBtn.focus();
            }, 100);

            if (!viewModel.get('searchComboSortByDisplayField') && searchCombo['applyDefaultSorter']) {
                searchCombo.applyDefaultSorter = Ext.emptyFn;
                searchCombo.sortByDisplayField = false;
            }

            Ext.Array.each(columns, function(column) {
                !column.excludeFromFilters && searchComboStore.add({
                    dataIndex : column.dataIndex,
                    text : column.text,
                    type : column.filterType ? column.filterType : 'text',
                    cfg : column.filterCfg ? Ext.clone(column.filterCfg) : {}
                });
            });

            searchCombo.setStore(searchComboStore);
            if (searchComboStore.count()) {
                searchCombo.setSelection(searchComboStore.getAt(0));
                viewModel.set('searchComboHasValues', true);
                searchText.focus();
            } else {
                viewModel.set('searchComboHasValues', false);
                this.lookup('cancelBtn').focus();
            }

            if (!view.getInputStoreLocalMode()) {
                grid.setLoading(true);
                inputStore.loadWithPromise(
                    (storeParams) ? {params : storeParams} : {})
                    .then({
                        scope : this,
                        success : this._afterInputStoreLoaded
                    }).always(function() {
                    grid.setLoading(false);
                });
            } else {
                this._afterInputStoreLoaded();
            }
        },

        _afterInputStoreLoaded : function() {
            var me = this,
                viewModel = this.getViewModel();

            if (!viewModel) {
                // view already destroyed
                return;
            }

            var localStore = viewModel.getStore('localStore'),
                inputStore = viewModel.getStore('inputStore'),
                inputStoreData,
                excludedIds = viewModel.get('excludedIds'),
                selectedRecordIds = viewModel.get('selectedRecords'),
                selectedRecords = [],
                grid = this.lookupReference('grid');

            localStore.setModel(inputStore.getModel());
            if (inputStore.isFiltered()) {
                inputStoreData = inputStore.getData().getSource();
            } else {
                inputStoreData = inputStore.getData();
            }
            inputStoreData.each(function(rec) {
                if (!excludedIds || !Ext.Array.contains(excludedIds, rec.getId())) {
                    localStore.add(rec);
                }
            });

            me.clearStoreFilter();

            Ext.Array.each(selectedRecordIds, function(recId) {
                selectedRecords.push(localStore.getById(recId));
            });
            selectedRecords = Ext.Array.clean(selectedRecords);
            grid.getSelectionModel().select(selectedRecords);
        },

        searchTextHandler : function(searchText, newValue) {
            var store = this.lookupReference('grid').getStore(),
                currentSelFilter = this.getViewModel().get('searchCombo.selection');

            this.clearStoreFilter();
            if (newValue != '') {
                store.addFilter({
                    property : currentSelFilter.get('dataIndex'),
                    value : newValue,
                    operator : 'like'
                });
            }
        },

        handleSearchTypeComboChange : function() {
            var currentSelFilter = this.getViewModel().get('searchCombo.selection'),
                filterContainer = this.lookupReference('filterContainer');

            filterContainer.removeAll();
            this.clearFilters();
            if (currentSelFilter && currentSelFilter.get('type') !== 'text') {
                filterContainer.add(
                    Ext.create(
                        Ext.Object.merge(
                            currentSelFilter.get('cfg'),
                            {
                                flex : 1,
                                reference : 'customSearchField',
                                listeners : {
                                    change : 'handleChangeCustomSearchField'
                                }
                            }
                        )
                    )
                );
            }
        },

        handleChangeCustomSearchField : function(cmp, newValue) {
            var store = this.lookupReference('grid').getStore(),
                currentSelFilter = this.getViewModel().get('searchCombo.selection');

            this.clearStoreFilter();
            if (newValue) {
                store.addFilter({
                    property : currentSelFilter.get('dataIndex'),
                    value : newValue,
                    operator : '='
                });
            }
        },

        clearFilters : function() {
            var searchText = this.lookupReference('searchText'),
                customSearchField = this.lookupReference('customSearchField');

            searchText ? searchText.setValue() : null;
            customSearchField ? customSearchField.setValue() : null;
        },

        clearStoreFilter : function() {
            var store = this.lookupReference('grid').getStore(),
                viewModel = this.getViewModel(),
                storeFilters = viewModel.get('storeFilters') || [];

            store.clearFilter();
            storeFilters && store.addFilter(storeFilters);
        },

        onSelectionChange : function(grid, selected) {
            var view = this.getView();

            if (view.getSetRecordsSelected()) {
                grid.getStore().each(function(rec) {
                    rec.set('_selected', false);
                });

                Ext.Array.each(selected, function(rec) {
                    rec.set('_selected', true);
                });
            }

            this.lookupReference('selectButton').setDisabled((!view.getAllowEmptySelect() ? !selected.length : false));
        },

        onSelectButtonHandler : function() {
            var view = this.getView();

            view.fireEvent('selectRecords', this.getView().lookupReference('grid').getSelection());
            view.destroy();
        },

        onCancelHandler : function() {
            var view = this.getView();

            view.fireEvent('cancel');
            view.destroy();
        }

    }
});

Ext.define('criterion.controller.MultiRecordPickerRemote', function() {

    const REMOVE_FLAG = '__REMOVE_THIS_VALUE__',
        FILTER_TYPE_BOOLEAN_REVERSED = 'boolean_reversed',
        FILTER_TYPE_BOOLEAN = 'boolean';

    return {
        alias : 'controller.criterion_multi_record_picker_remote',

        extend : 'criterion.app.ViewController',

        init : function() {
            this.searchTextHandler = Ext.Function.createBuffered(this.searchTextHandler, 300);
        },

        onShow : function() {
            let view = this.getView(),
                vm = this.getViewModel(),
                searchCombo = view.lookupReference('searchCombo'),
                grid = view.lookupReference('grid'),
                searchText = view.lookupReference('searchText'),
                columns = vm.get('gridColumns'),
                inputStore = vm.getStore('inputStore'),
                searchComboStore = Ext.create('Ext.data.Store', {fields : []}),
                defaultRecord;

            Ext.defer(function() {
                view.lookup('cancelButton').focus();
            }, 500);

            view.lookupReference('selectButton').setDisabled((view.getAllowEmptySelect() ? false : true));

            Ext.Array.each(columns, function(column) {
                if (!column.excludeFromFilters) {
                    let records = searchComboStore.add({
                        dataIndex : column.dataIndex,
                        text : column.text,
                        type : column.filterType ? column.filterType : 'text',
                        cfg : column.filterCfg ? Ext.clone(column.filterCfg) : {}
                    });

                    // Default field to filter with
                    if (column.defaultSearch) {
                        defaultRecord = records[0];
                    }
                }
            });

            searchCombo.setStore(searchComboStore);

            if (searchComboStore.count()) {
                searchCombo.setSelection(defaultRecord || searchComboStore.getAt(0));
                vm.set('searchComboHasValues', true);
            } else {
                vm.set('searchComboHasValues', false);
            }

            this.createAdditionalFilters();

            inputStore.on('beforeLoad', function() {
                grid.setLoading(true);
            }, this);
            inputStore.on('load', this.onStoreLoad, this);

            this.loadWithParams();

            searchText.focus();
        },

        createAdditionalFilters : function() {
            let additionalFiltersBlock = this.lookup('additionalFiltersBlock'),
                vm = this.getViewModel(),
                additionalFilters = vm.get('additionalFilters');

            if (additionalFilters && additionalFilters.length) {
                Ext.Array.each(additionalFilters, function(af) {
                    additionalFiltersBlock.add(af);
                });
            }
        },

        loadWithParams : function(params) {
            let vm = this.getViewModel(),
                storeParams = vm.get('storeParams') || {},
                store = vm.getStore('inputStore'),
                proxy = store.getProxy(),
                datas = Ext.Object.merge({}, storeParams, params || {}, this.getAdditionalFiltersValues());

            Ext.Object.each(datas, function(key, val) {
                if (val === REMOVE_FLAG) {
                    delete datas[key];
                }
            });

            proxy.setExtraParams(datas);
            store.loadPage(1);
        },

        getAdditionalFiltersValues : function() {
            let additionalFiltersBlock = this.lookup('additionalFiltersBlock'),
                fields = additionalFiltersBlock.query('[name]'),
                res = {};

            Ext.Array.each(fields, function(field) {
                let val = field.getValue();

                if (field.filterType === FILTER_TYPE_BOOLEAN_REVERSED) {
                    if (!val) {
                        res[field.name] = true;
                    } else {
                        res[field.name] = REMOVE_FLAG;
                    }
                } else {
                    res[field.name] = val;
                }
            });

            return res;
        },

        onStoreLoad : function() {
            let view = this.getView(),
                vm = this.getViewModel(),
                selectedRecordIds = vm.get('selectedRecords'),
                selectedRecords = [],
                inputStore = vm.getStore('inputStore'),
                grid = view.lookupReference('grid');

            Ext.Array.each(selectedRecordIds, function(recId) {
                selectedRecords.push(inputStore.getById(recId));
            });

            selectedRecords = Ext.Array.clean(selectedRecords);
            grid.getSelectionModel().select(selectedRecords);
            if (selectedRecords.length) {
                this.onSelectionChange(null, selectedRecords);
            }
            grid.setLoading(false);
        },

        additionalFilterHandler : function() {
            let currentSelFilter = this.getViewModel().get('searchCombo.selection'),
                dataIndex = currentSelFilter.get('dataIndex'),
                params = {},
                newValue = this.lookup('searchText').getValue();

            if (newValue !== '') {
                params[dataIndex] = newValue;
            }

            this.loadWithParams(params);
        },

        searchTextHandler : function(searchText, newValue) {
            let vm = this.getViewModel(),
                currentSelFilter = vm && vm.get('searchCombo.selection'),
                params = {};

            if (!vm) {
                return;
            }

            if (newValue !== '') {
                params[currentSelFilter.get('dataIndex')] = newValue;
            }

            this.loadWithParams(params);
        },

        handleSearchTypeComboChange : function() {
            let currentSelFilter = this.getViewModel().get('searchCombo.selection'),
                filterContainer = this.lookupReference('filterContainer');

            this.clearFilters();
            filterContainer.removeAll();

            if (currentSelFilter && currentSelFilter.get('type') !== 'text') {
                filterContainer.add(
                    Ext.create(this.getSearchFieldCfg(currentSelFilter))
                );
            }
        },

        getSearchFieldCfg : function(currentSelFilter) {
            return Ext.Object.merge(
                currentSelFilter.get('cfg'),
                {
                    flex : 1,
                    reference : 'customSearchField',
                    listeners : {
                        change : 'handleChangeCustomSearchField'
                    }
                }
            )
        },

        handleChangeCustomSearchField : function(cmp, newValue) {
            let currentSelFilter = this.getViewModel().get('searchCombo.selection'),
                params = {},
                dataIndex = currentSelFilter.get('dataIndex'),
                filterType = currentSelFilter.get('type');

            /**
             * boolean_reversed type: by default his value == false and in the request isActive = true
             * but if value == true the flag isActive will remove from params of the request
             */
            switch (filterType) {
                case FILTER_TYPE_BOOLEAN_REVERSED:
                    if (newValue) {
                        params[dataIndex] = REMOVE_FLAG;
                    } else {
                        params[dataIndex] = true;
                    }

                    break;

                case FILTER_TYPE_BOOLEAN:
                    params[dataIndex] = !!newValue;

                    break;

                default:
                    if (newValue) {
                        params[dataIndex] = newValue;
                    }

                    break;
            }

            this.loadWithParams(params);
        },

        clearFilters : function() {
            let view = this.getView(),
                searchText = view.lookupReference('searchText'),
                customSearchField = view.lookupReference('customSearchField');

            searchText ? searchText.setValue() : null;
            customSearchField ? customSearchField.setValue() : null;
        },

        onSelectionChange : function(grid, selected) {
            let view = this.getView();

            view.lookupReference('selectButton').setDisabled((!view.getAllowEmptySelect() ? !selected.length : false));
        },

        onSelectButtonHandler : function() {
            let view = this.getView(),
                vm = this.getViewModel(),
                selected = this.getView().lookupReference('grid').getSelection(),
                excludedIds = vm.get('excludedIds');

            if (vm.get('usePagination') && excludedIds) {
                selected = Ext.Array.filter(selected, function(record) {
                    return !Ext.Array.contains(excludedIds, record.getId())
                })
            }

            view.fireEvent('selectRecords', selected);

            if (view.getAfterSelectAction()) {
                view[view.getAfterSelectAction()].call(view);
            }
        },

        onCancelHandler : function() {
            let view = this.getView();

            view.fireEvent('cancel');

            if (view.getAfterCancelAction()) {
                view[view.getAfterCancelAction()].call(view);
            }
        },

        statics : {
            FILTER_TYPE_BOOLEAN_REVERSED : FILTER_TYPE_BOOLEAN_REVERSED,
            FILTER_TYPE_BOOLEAN : FILTER_TYPE_BOOLEAN
        }

    }
});

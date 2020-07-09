Ext.define('criterion.controller.settings.system.CodeTables', function() {

    return {

        alias : 'controller.criterion_settings_codetables',

        extend : 'criterion.controller.codeTable.Detail',

        requires : [
            'criterion.view.codeTable.CodeTableForm'
        ],

        handleChangeType : function(combo, newVal) {
            var codeTable = this.lookupReference('codeTable'),
                store = codeTable.getStore(),
                codeTableType = this.lookupReference('codeTableType').getValue();

            codeTable.setValue(null);
            this.redirectTo(this.baseRoute, null);
            this.lookupReference('codetableDetailGrid').setCodeTableId(0);
            store.clearFilter();
            newVal && this.filterCodeTableStore(store, codeTableType);

            this.lookupReference('codetableDetailGrid').setType(newVal);
        },

        handleChangeTable : function(cmp, val) {
            if (!val) {
                return
            }

            var record = cmp.getStore().getById(val);
            this.redirectTo(this.baseRoute + '/' + record.get('id'), null);
        },

        handleBeforeDeactivate : function() {
            var codeTable = this.lookupReference('codeTable'),
                codeTableType = this.lookupReference('codeTableType'),
                store = codeTable.getStore();

            store.isFiltered() && store.clearFilter();
            codeTable.setValue(null);
            codeTableType.reset();
        },

        handleBeforeActivate : function() {
            var view = this.getView(),
                codeTableType = this.lookupReference('codeTableType');

            !codeTableType.getValue() && codeTableType.setValue(view.types.SYSTEM.value);
        },

        onBeforeEmployerChange : function(employer) {
            this.getViewModel().set('employerId', employer ? employer.getId() : null);
        },

        onEmployerChange : function(employer) {
            this.getViewModel().set('employerId', employer ? employer.getId() : null);
            this.lookupReference('codetableDetailGrid').getController().load();
        },

        _createEditor : function(record, create) {
            var editor = Ext.create('criterion.view.codeTable.CodeTableForm', {
                plugins : [
                    {
                        ptype : 'criterion_sidebar',
                        height : 400
                    }
                ],
                viewModel : {
                    data : {
                        isCreate : create
                    }
                }
            });

            editor._connectedView = this.getView();
            editor.shadow = false;
            editor.loadRecord(record);

            editor.on({
                scope : this,
                save : this.handleSaveTable,
                remove : this.handleRemoveTable
            });

            editor.show();
        },

        handleSaveTable : function(record, form) {
            var codeTable = this.lookupReference('codeTable');

            criterion.CodeDataManager.removeFromCache(record.getId());
            criterion.CodeDataManager.codeTablesStoreFreezeFilters();

            record.store.syncWithPromise().then(function() {
                criterion.CodeDataManager.codeTablesStoreUnfreezeFilters();

                form.getController().close();
                codeTable.setValue(null);
                Ext.Function.defer(function() {
                    codeTable.setValue(record.getId());
                }, 500);
            });
        },

        handleCreateNewTable : function() {
            var record,
                store = criterion.CodeDataManager.getCodeTablesStore();

            record = store.add({
                name : '_',
                isSystem : false,
                isCustom : true
            })[0];
            record.phantom = true;

            this._createEditor(record, true);
        },

        handleEditTable : function() {
            var codeTableSelector = this.lookupReference('codeTable'),
                record = codeTableSelector.getStore().getById(codeTableSelector.getValue());

            this._createEditor(record, false);
        },

        handleRemoveTable : function(record, form) {
            var me = this,
                codeTable = this.lookupReference('codeTable'),
                store = criterion.CodeDataManager.getCodeTablesStore();

            criterion.Msg.confirmDelete({
                    title : i18n.gettext('Delete record'),
                    message : i18n.gettext('Do you want to delete the record?')
                },
                function(btn) {
                    if (btn === 'yes') {
                        criterion.CodeDataManager.codeTablesStoreFreezeFilters();

                        store.remove(record);
                        store.syncWithPromise().then(function() {
                            criterion.CodeDataManager.codeTablesStoreUnfreezeFilters();
                            form.getController().close();
                            codeTable.setValue(null);
                            me.redirectTo(me.baseRoute, null);
                        });
                    }
                }
            );
        },

        handleGridRoute : function(value) {
            var typeCombo = this.lookup('codeTableType'),
                combo = this.lookup('codeTable'),
                grid = this.lookup('codetableDetailGrid'),
                ctName,
                record,
                type,
                types = this.getView().types;

            combo.store.clearFilter(true);
            record = combo.store.findRecord('id', parseInt(value, 10), 0, false, false, true);

            if (record) {
                ctName = record.getId();

                grid.setCodeTableName(ctName);
                grid.setCodeTableId(criterion.CodeDataManager.getCodeTableIdByName(ctName));
                grid.setCodeTableRecord(record);

                typeCombo.suspendEvents(false);
                if (record.get('isSystem') && !record.get('isCustom')) {
                    typeCombo.select(types.SYSTEM.value);
                }
                if (!record.get('isSystem') && !record.get('isCustom')) {
                    typeCombo.select(types.USER.value);
                }

                if (record.get('isCustom')) {
                    typeCombo.select(types.CUSTOM.value);
                }
                type = typeCombo.getValue();

                this.filterCodeTableStore(combo.store, typeCombo.getValue());
                grid.getViewModel().set({
                    type : type,
                    codeTableName : ctName
                });

                combo.suspendEvents(false);
                this.getViewModel().set({
                    type : type,
                    codeTableName : ctName
                });
                combo.select(record);
                combo.resumeEvents();
                typeCombo.resumeEvents();

            } else {
                grid.setCodeTableName(null);
                grid.setCodeTableId(null);
            }
        },

        filterCodeTableStore : function(store, codeTableType) {
            var types = this.getView().types;

            store.filterBy(function(record) {
                switch (codeTableType) {
                    case types.SYSTEM.value:
                        if (record.get('isSystem') && !record.get('isCustom')) {
                            return record;
                        }
                        break;

                    case types.USER.value:
                        if (!record.get('isSystem') && !record.get('isCustom')) {
                            return record;
                        }
                        break;

                    case types.CUSTOM.value:
                        if (record.get('isCustom')) {
                            return record;
                        }
                        break;
                }

                if (record.get('isSystem') == codeTableType) {
                    return record;
                }
            });
        }
    };

});

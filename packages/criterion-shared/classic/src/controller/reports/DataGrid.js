Ext.define('criterion.controller.reports.DataGrid', function() {

    return {

        extend : 'criterion.controller.GridView',

        requires : [
            'criterion.store.dataGrid.AvailableTables'
        ],

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex'
        ],

        alias : 'controller.criterion_reports_data_grid',

        load() {
            let view = this.getView(),
                vm = this.getViewModel(),
                dataforms = vm.get('dataforms'),
                webforms = vm.get('webforms');

            view.getSelectionModel().deselectAll();
            view.setLoading(true);

            return Ext.promise.Promise.all([
                this.loadStoreIfEmpty('availableTables'),
                this.callParent(arguments),
                dataforms.loadWithPromise(),
                webforms.loadWithPromise(),
                this.loadStoreIfEmpty('sModules')
            ]).always(() => {
                view.setLoading(false);
            });
        },

        loadStoreIfEmpty(ident) {
            let dfd = Ext.create('Ext.Deferred'),
                vm = this.getViewModel(),
                store = vm.get(ident);

            if (!store.isLoaded()) {
                store.loadWithPromise().then(() => {
                    dfd.resolve();
                });
            } else {
                dfd.resolve();
            }

            return dfd.promise;
        },

        createEditor(editorCfg, record) {
            let editor = this.callParent(arguments);

            editor.on('close', function() {
                this.load();
            }, this);

            return editor;
        },

        cancelEdit() {
            this.load();
        },

        handleSelectionChange(g, selection) {
            this.getViewModel().set('selectionCount', selection.length);
        },

        handleCloneClick() {
            let picker,
                me = this,
                view = this.getView(),
                selectedItems = Ext.Array.map(view.getSelection(), select => select.get('name')),
                selectedIds = Ext.Array.map(view.getSelection(), select => select.getId()),
                selectionCount = selectedItems.length;

            picker = Ext.create('criterion.ux.form.CloneForm', {
                title : i18n.gettext('Clone Data Grids'),
                items : [
                    {
                        xtype : 'textarea',
                        readOnly : true,
                        value : selectedItems.join('\r\n'),
                        fieldLabel : selectionCount + ' ' + i18n.gettext('Data Grid') + (selectionCount > 1 ? 's' : '')
                    }
                ]
            });

            picker.show();
            picker.on({
                cancel : () => {
                    me.setCorrectMaskZIndex(false);
                    picker.destroy();
                },
                clone : data => {
                    me.setCorrectMaskZIndex(false);
                    picker.destroy();
                    me.cloneDataGrids(selectedIds);
                }
            });

            this.setCorrectMaskZIndex(true);
        },

        cloneDataGrids(selectedIds) {
            let me = this,
                view = this.getView();

            view.setLoading(true);

            criterion.Api.requestWithPromise({
                url : criterion.consts.Api.API.DATA_GRID_MEMORIZED_CLONE,
                method : 'POST',
                jsonData : {
                    datagridMemorizedClonedIds : selectedIds
                }
            }).then(() => {
                me.load();
                view.getSelectionModel().deselectAll();
            }).always(() => view.setLoading(false));
        }
    };

});

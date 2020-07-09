Ext.define('criterion.controller.codeTable.Detail', function() {

    return {
        alias : 'controller.criterion_codetable_detail',

        extend : 'criterion.controller.GridView',

        getEmptyRecord : function() {
            return {
                codeTableId : this.getView().getCodeTableId(),
                isActive : true
            };
        },

        createEditor : function(editor, record) {
            if (editor) {
                editor.codeTableRecord = this.getView().getCodeTableRecord();
            }

            var editor = Ext.create(editor);

            editor._connectedView = this.getView().up();
            editor.shadow = false;
            editor.show();

            editor.on('afterDelete', function() {
                this.load();
            }, this);

            editor.on('afterSave', function() {
                this.clearCDCache();
                this.load();
            }, this);

            editor.setTitle((record.phantom ? 'Add' : 'Edit') + ' ' + editor.getTitle());

            return editor;
        },

        clearCDCache : function() {
            var view = this.getView();

            criterion.CodeDataManager.removeFromCache(view.getCodeTableName());
        },

        load : function() {
            var view = this.getView(),
                store,
                codeTableName;

            if (!Ext.isFunction(view.getStore)) {
                return;
            }

            store = view.getStore();
            codeTableName = view.getCodeTableName();

            if (!(store.model)) {
                return;
            }

            if (!codeTableName) {
                store.loadData([]);
                return;
            }

            view.setLoading(true);

            criterion.CodeDataManager.load([codeTableName], function() {
                store.loadData(criterion.CodeDataManager.getStore(codeTableName).getRange());
                view.setLoading(false, null);
            }, this, {withLocalization : true});
        },

        handleChangeLocal : function() {
            this.load();
        },

        handleSetCodeTableId : function(codeTableId) {
            if (codeTableId) {
                this.load();
            } else {
                this.getView().getStore().isStore && this.getView().getStore().loadData([]);
            }
            this.getViewModel().set('codeTableId', codeTableId ? codeTableId : null);
        },

        handleSetType : function(type) {
            this.getViewModel().set('type', type);
        },

        init : function() {
            this.load = Ext.Function.createBuffered(this.load, 100, this);
            this.callParent(arguments);
        }
    };

});

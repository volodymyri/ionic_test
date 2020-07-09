Ext.define('criterion.controller.GridView', function() {

    return {
        alias : 'controller.criterion_gridview',

        extend : 'criterion.app.ViewController',

        config : {
            confirmDelete : true
        },

        getEmptyRecord : function() {
            return {};
        },

        createEditor : Ext.emptyFn,

        cancelEdit : function(record) {
            if (record.phantom) {
                record.store ? record.store.remove(record) : record.erase();
            } else {
                record.reject();
            }
        },

        load : function(opts) {
            var store = this.getView().getStore(),
                view = this.getView();

            if (Ext.isFunction(view.getPreventStoreLoad) && view.getPreventStoreLoad()) {
                return;
            }

            if (store) {
                store.load(Ext.apply({}, opts));
            }
        },

        init : function() {
            var me = this;

            me.load = Ext.Function.createBuffered(me.load, 100, me);
            me.handleActivate = Ext.Function.createBuffered(me.handleActivate, 100, me);

            this.callParent(arguments);
        },

        addRecord : function(record) {
            var me = this;

            return me.getView().getStore().add(record)[0];
        },

        add : function() {
            var me = this,
                record = this.getEmptyRecord();

            if (!record) {
                return;
            }

            me.getView().fireEvent('doAdd', me.addRecord(record));
        },

        edit : function(record) {
            this.getView().fireEvent('doEdit', record);
        },

        remove : function(record) {
            this.getView().getStore().remove(record);
        },

        handleRefreshClick : function() {
            this.load();
        },

        handleAddClick : function() {
            this.toggleAutoSync(false);
            this.add();
        },

        handleEditAction : function(grid, index, gridrow, record) {
            this.edit(record);
            this.toggleAutoSync(false);
        },

        handleRemoveAction : function(record, cmp, x, y, action, config, force) {
            var me = this;

            if (this.getConfirmDelete() && !force) {
                Ext.Msg.confirm(
                    'Delete record',
                    'Do you want to delete the record?',
                    function(btn) {
                        if (btn == 'yes') {
                            me.remove(record);
                        }
                    }
                );
            } else {
                this.remove(record);
            }
        },

        handleCancelEdit : function(rowEditing, context) {
            this.cancelEdit(context.record);
            this.toggleAutoSync(true);
        },

        handleAfterEdit : function(argument) {
            if (argument && argument.isModel && !argument.isValid()) {
                console && console.debug && console.debug('Saved argument isn\'t valid', argument.getValidation());
            }
            this.toggleAutoSync(true);
        },

        handleActivate : function() {
            if (this.checkViewIsActive()) {
                Ext.Function.defer(this.load, 50, this);
            }
        },

        toggleAutoSync : function(state) {
            var store = this.getView().getStore();
            if (store.autoSync) {
                state ? store.resumeAutoSync(true) : store.suspendAutoSync();
            }
        }
    };

});

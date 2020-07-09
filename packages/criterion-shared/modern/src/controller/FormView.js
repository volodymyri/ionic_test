Ext.define('criterion.controller.FormView', function() {

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_formview',

        handlePainted : function() {
            var view = this.getView(),
                menuBar = this.getMenuBar(),
                me = this;

            menuBar && menuBar.toggleNavMode(function() {
                me.handleCancel();
            });
        },

        getMenuBar : function() {
            var view = this.getView();

            return view.up('[hasMenuBar]') && view.up('[hasMenuBar]').down('ess_modern_menubar');
        },

        close : function() {
            var view = this.getView(),
                menuBar = this.getMenuBar();

            menuBar && menuBar.defNavMode();
            view.fireEvent('close');
        },

        getRecord : function() {
            return this.getViewModel().get('record');
        },

        handleSubmit : function() {
            console && console.warn('Method needs to be overriden.')
        },

        handleDelete : function() {
            var me = this,
                form = me.getView(),
                record = this.getRecord();

            Ext.Msg.show({
                ui : 'rounded',
                title : i18n.gettext('Delete record'),
                message : i18n.gettext('Do you want to delete the record?'),
                buttons : Ext.MessageBox.YESNO,
                prompt : false,
                scope : me,
                fn : function(btn) {
                    if (btn === 'yes') {
                        form.fireEvent('delete', record, me);
                        me.deleteRecord();
                    }
                }
            });
        },

        deleteRecord : function() {
            var me = this,
                view = this.getView(),
                record = this.getRecord();

            view.setMasked({
                xtype : 'loadmask',
                message : i18n.gettext('Removing...')
            });

            record.erase({
                success : function() {
                    view.setMasked(false);
                    me.close();
                }
            });
        },

        handleCancel : function() {
            var me = this,
                record = this.getRecord(),
                view = this.getView();

            if (Ext.isFunction(view.getFieldsAsArray)) {
                Ext.suspendLayouts();
                Ext.Array.each(view.getFieldsAsArray(), function(field) {
                    field.clearInvalid();
                });
                Ext.resumeLayouts(true);
            }

            if (record.store && record.phantom) {
                record.store.remove(record);
            } else {
                record.reject();
            }

            me.close();
        },

        handleRecordUpdate : Ext.emptyFn,

        handleRecordLoad : Ext.emptyFn,

        handleSubmitClick : Ext.emptyFn,

        handleSave : function() {
            var me = this,
                view = this.getView(),
                record = this.getRecord();

            record.save({
                success : function() {
                    view.fireEvent('save', record);
                    criterion.Utils.toast(i18n.gettext('Saved.'));
                    me.close();
                }
            });
        }
    };
});


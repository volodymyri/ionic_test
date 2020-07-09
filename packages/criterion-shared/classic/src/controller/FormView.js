Ext.define('criterion.controller.FormView', function() {

    return {
        alias : 'controller.criterion_formview',

        extend : 'criterion.app.ViewController',

        config : {
            /**
             * If false, this class will trigger API operations for the record.
             * Otherwise it will only fire events.
             */
            externalUpdate : true,

            /**
             * If true the form will be close after cancel
             */
            closeFormAfterCancel : true,

            /**
             * If true the form will be close after save
             */
            closeFormAfterSave : true,

            /**
             * If true the form will be close after delete
             */
            closeFormAfterDelete : true,

            /**
             * Object additional data for record save
             */
            recordSaveParams : {},

            showDeleteConfirm : true,

            maskOnUpdate : false
        },

        getRecord : function() {
            let view = this.getView(),
                vm = this.getViewModel();
            // if press cancel very quickly after load for some reason getView() may return null, so avoiding this
            return view && view.getRecord() || vm && vm.get('record');
        },

        findInvalidField : function() {
            return this.getView().getForm().getFields().findBy(field => !field.isValid());
        },

        focusInvalidField : function() {
            let field = this.findInvalidField();

            field && field.focus();
        },

        close : function() {
            let view = this.getView();

            if (view) {
                // view can be already destroyed by parent
                view.close();
            }
        },

        // eslint-disable-next-line no-unused-vars
        handleRecordLoad : function(record) {
            // handle before record loaded
        },

        // eslint-disable-next-line no-unused-vars
        handleAfterRecordLoad : function(record) {
            // handle after record loaded
        },

        handleRecordUpdate : function(record) {
            let me = this,
                view = this.getView(),
                store = record.store,
                isNew = record.phantom;

            view.fireEvent('save', record);

            if (!me.getExternalUpdate()) {
                let dirtyAssoc = false;

                Ext.iterate(record.associations, function(name) {
                    if (Ext.isFunction(record[name]) && record[name]().needsSync) {
                        dirtyAssoc = true;

                        return true;
                    }
                });

                /* eslint-disable */
                if (record.dirty || record.phantom || dirtyAssoc) {

                    if (me.getMaskOnUpdate()) {
                        view.setLoading(true);
                    }

                    record.save({
                        params : me.getRecordSaveParams(),
                        success : function(record) {
                            me.onAfterSave.call(me, view, record, isNew);
                        },
                        failure : function(record, operation) {
                            me.onFailureSave(record, operation);
                        },
                        callback : function() {
                            if (me.getMaskOnUpdate()) {
                                view.setLoading(false);
                            }
                        }
                    });
                } else {
                    me.onAfterSave.call(me, view, record, isNew);
                }
                /* eslint-enable */

            } else {
                if (!store || !store.getAutoSync()) {
                    // as flag for a related sub record
                    record.$relatedPhantom = true;
                }

                if (me.getCloseFormAfterSave()) {
                    me.close();
                }
            }
        },

        /**
         * @param view
         * @param record
         * @param isNew as flag for phantom -> saved (as new record)
         */
        onAfterSave : function(view, record, isNew) {
            view.fireEvent('afterSave', view, record, isNew);

            if (this.getCloseFormAfterSave()) {
                this.close();
            }
        },

        // eslint-disable-next-line no-unused-vars
        onFailureSave : function(record, operation) {
        },

        handleCancelClick() {
            let me = this,
                view = me.getView(),
                record = this.getRecord(),
                preventReRoute = (arguments.length && Ext.isBoolean(arguments[0])) && arguments[0];

            if (record && record.phantom && !record.$relatedPhantom) {
                record.erase();
            }

            if (record && !record.phantom) {
                record.reject();
            }

            view._preventReRoute = preventReRoute;
            view.fireEvent('cancel', view, record);

            if (me.getCloseFormAfterCancel()) {
                me.close();
            }
        },

        handleDeleteClick : function() {
            let me = this,
                form = me.getView(),
                record = this.getRecord(),
                dfd = Ext.create('Ext.promise.Deferred');

            if (!record.phantom && this.getShowDeleteConfirm()) {
                criterion.Msg.confirmDelete({
                        title : i18n.gettext('Delete record'),
                        message : form.getDeleteConfirmMessage(record)
                    },
                    function(btn) {
                        if (btn === 'yes') {
                            dfd.resolve();
                        } else {
                            dfd.reject();
                        }
                    }
                );
            } else {
                dfd.resolve();
            }

            dfd.promise.then(function() {
                if (!me.getExternalUpdate()) {
                    me.deleteRecord();
                } else {
                    me.handleExternalDelete(record);
                }
            });
        },

        deleteRecord : function() {
            let me = this,
                form = me.getView(),
                record = this.getRecord(),
                store = record.store;

            // record.erase first set record.erased then call record drop, as result for store record is already erased
            // and cannot be restored by store.rejectChanges. So we have to remove record from store directly to enable
            // restore it in the store by rejectChanges.
            if (store) {
                //<debug>
                if (store.getAutoSync()) {
                    console.warn(Ext.String.format("For {0} FormView.deleteRecord try erase record from store with autoSync == true. Consider use externalUpdate or turn off autoSync.", form.getId()));
                }
                //</debug>
                store.remove(record);
            }

            record.erase({
                success : function() {
                    me.onAfterDelete(form, record);
                },
                failure : function() {
                    record.reject();
                    if (store) {
                        store.rejectChanges();
                    }
                }
            });
        },

        onAfterDelete : function(view, record) {
            view.fireEvent('afterDelete', this);

            if (this.getCloseFormAfterDelete()) {
                this.close();
            }
        },

        handleExternalDelete : function(record) {
            let form = this.getView();

            form.fireEvent('delete', record, this);

            if (this.getCloseFormAfterDelete()) {
                this.close();
            }
        },

        updateRecord : function(record, handler) {
            this.getView().updateRecord(record);
            Ext.isFunction(handler) ? handler.call(this, record) : null;
        },

        handleSubmitClick : function() {
            let me = this,
                form = me.getView(),
                record = this.getRecord();

            this.isNewRecord = record.phantom;

            if (form.isValid()) {
                me.updateRecord(record, this.handleRecordUpdate);
            } else {
                me.focusInvalidField();
            }
        },

        isViewActive() {
            let view = this.getView();

            return Ext.WindowManager.getActive() === view && view.isVisible(true);
        },

        navSaveHandler() {
            let vm = this.getViewModel();

            if (!vm.get('disableSave') && !vm.get('hideSave') && this.isViewActive()) {
                this.handleSubmitClick();
            }
        },

        navCancelHandler() {
            if (this.isViewActive()) {
                this.handleCancelClick();
            }
        },

        navDeleteHandler() {
            let targetEl = Ext.fly(event.target),
                targetCmp = targetEl && targetEl.component,
                vm;

            if (!targetCmp || !targetCmp.isTextInput) {
                vm = this.getViewModel();

                if (!vm.get('disableDelete') && !vm.get('hideDelete') && this.isViewActive()) {
                    this.handleDeleteClick();
                }
            }

        },

        navRightHandler() {
            let vm = this.getViewModel(),
                view = this.getView(),
                next = vm.get('transitionInfo.next');

            if (this.isViewActive() && vm.get('transitionInfo.allowNext') && next && view._connectedView) {
                this.redirectTo(next);
            }
        },

        navLeftHandler() {
            let vm = this.getViewModel(),
                view = this.getView(),
                prev = vm.get('transitionInfo.prev');

            if (this.isViewActive() && vm.get('transitionInfo.allowPrev') && prev && view._connectedView) {
                this.redirectTo(prev);
            }
        }
    };

});

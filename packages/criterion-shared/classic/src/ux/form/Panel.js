/**
 * Base class for app forms.
 */
Ext.define('criterion.ux.form.Panel', function() {

    return {

        extend : 'Ext.form.Panel',

        alias : [
            'widget.criterion_form'
        ],

        mixins : [
            'criterion.ux.mixin.Component'
        ],

        requires : [
            'Ext.form.field.*',
            'Ext.form.CheckboxGroup',
            'criterion.ux.form.*',
            'criterion.ux.form.field.*',
            'criterion.ux.form.trigger.*',
            'criterion.ux.plugin.ResponsiveColumn'
        ],

        config : {
            deleteConfirmTitle : i18n.gettext('Delete record'),
            deleteConfirmMessage : i18n.gettext('Do you want to delete the record?'),
            needConfirm : true,
            switchOffDirtyConfirmation : false
        },

        bodyPadding : 10,
        minButtonWidth : 100,

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        defaults : {
            validateOnChange : false
        },

        trackResetOnLoad : true,

        viewModel : {},

        defaultRecordName : 'record',

        recordIds : [],

        storeIds : [],

        dirtyRecords : [],

        dirtyStores : [],

        preCloseActions : [],

        callbacksQueue : [],

        skipDirtyConfirmation : false,

        parentView : undefined,

        parentHasSidebar : false,

        unsavedMessage : i18n.gettext('Unsaved changes will be lost, close form anyway?'),

        debugMode : false, // dev only

        hasDirty : function() {
            let vm = this.getViewModel(),
                record = this.getRecord() || vm && vm.get(this.defaultRecordName),
                hasDirty = false;

            if (this.recordIds.length || this.storeIds.length || this.preCloseActions.length || record) {
                this.dirtyRecords = [];
                this.dirtyStores = [];

                if (!vm && !record) {
                    return false;
                }

                Ext.Array.each(this.preCloseActions, function(action) {
                    if (action.scope === 'controller') {
                        this.getController()[action.fn]();
                    } else {
                        this[action.fn]();
                    }
                }, this);

                Ext.Array.each(this.recordIds, function(recId) {
                    let rec = vm.get(recId);
                    if (rec && rec.dirty) {
                        hasDirty = true;
                        this.dirtyRecords.push(rec);
                    }
                }, this);

                Ext.Array.each(this.storeIds, function(storeId) {
                    let store = vm.getStore(storeId);
                    if (store && (store.getModifiedRecords().length || store.getRemovedRecords().length)) {
                        hasDirty = true;
                        this.dirtyStores.push(store);
                    }
                }, this);

                //<debug>
                // for testing purposes
                if (this.debugMode) {
                    Ext.Array.each(this.storeIds, function(storeId) {
                        let store = vm.getStore(storeId);

                        if (store && (store.getModifiedRecords().length || store.getRemovedRecords().length)) {
                            console.log('dirty store>', store, store.getModifiedRecords(), store.getRemovedRecords());
                        }
                    }, this);
                    this.getForm().getFields().findBy(function(f) {
                        f.isDirty() ? console.log('dirty field>', f) : null;
                    });
                    if (record.dirty) {
                        console.log('dirty record>', record);
                    }
                }
                //</debug>

                if (record && record.dirty || this.getRecord() && this.getForm().isDirty()) {
                    this.dirtyRecords.push(record);
                    hasDirty = true;
                }

                return hasDirty;
            }
        },

        checkIsActive : function() {
            return this.rendered && this.isVisible(true);
        },

        onBeforeHideForm : function(scope, params, checkOnly) {
            let me = this;

            if (!this.checkIsActive()) {
                return true;
            }

            if (this.hasDirty() && !this.getSwitchOffDirtyConfirmation()) {
                if (this.getNeedConfirm()) {
                    this.callbacksQueue = [];
                    this.confirmClose(scope, params);
                    this.setNeedConfirm(false);
                } else {
                    return true;
                }
                !checkOnly && this.callbacksQueue.push({
                    scope : scope,
                    params : params
                });

                return false;
            } else {
                if (checkOnly) {
                    return true;
                }
                let sidebar,
                    controller;

                this.callbacksQueue = [];
                if (this.parentHasSidebar && this.parentView) {
                    sidebar = this.parentView.findPlugin('criterion_sidebar');
                    controller = this.parentView.getController();
                } else {
                    sidebar = this.findPlugin('criterion_sidebar');
                    controller = this.getController();
                }

                if (sidebar && !sidebar.modal) {
                    if (controller && Ext.isFunction(controller.handleCancelClick)) {
                        Ext.GlobalEvents.un('beforeHideForm', me.onBeforeHideForm, me);
                        me.items.each(function(item) {
                            item.onBeforeHideForm && Ext.GlobalEvents.un('beforeHideForm', item.onBeforeHideForm, item);
                        });

                        controller.handleCancelClick(true);

                    } else if (controller && Ext.isFunction(controller.handleCancel)) {
                        Ext.GlobalEvents.un('beforeHideForm', me.onBeforeHideForm, me);
                        me.items.each(function(item) {
                            item.onBeforeHideForm && Ext.GlobalEvents.un('beforeHideForm', item.onBeforeHideForm, item);
                        });

                        controller.handleCancel();
                    }
                }
                return true;
            }
        },

        confirmClose : function() {
            let me = this;

            criterion.Msg.confirm(
                i18n.gettext('Unsaved changes'),
                me.unsavedMessage,
                function(btn) {
                    if (btn === 'yes') {
                        me.handleClose();
                        Ext.GlobalEvents.fireEvent('dirtyFormClosed');
                    } else {
                        if (Ext.util.History.prevHash && !Ext.util.History.detectChanges) {
                            Ext.util.History.setHash(Ext.util.History.prevHash);
                        }
                        criterion.Utils.restoreToolbarButton();
                    }

                    me.setNeedConfirm(true);
                });
        },

        handleClose : function() {
            let me = this,
                callbacks = Ext.clone(me.callbacksQueue),
                form = me.getForm(),
                controller = this.getController();

            Ext.Array.each(me.dirtyRecords, rec => {
                rec.reject();
            });

            Ext.Array.each(me.dirtyStores, store => {
                store.rejectChanges();
            });

            if (me.getRecord() && form.isDirty()) {
                Ext.suspendLayouts();

                form.getFields().each(field => {
                    if (field && !field.destroyed && !field.destroying && field.reset) {
                        field.reset();
                    }
                });

                Ext.resumeLayouts(true);
            }

            Ext.Array.each(callbacks, callbackQueue => {
                if (callbackQueue.scope && callbackQueue.scope instanceof Ext.menu.Menu) {
                    callbackQueue.scope.fireEventArgs('click', callbackQueue.params);
                } else {
                    Ext.callback(callbackQueue.params.callee, callbackQueue.scope, Ext.clone(callbackQueue.params));
                }
            });

            if (controller && Ext.isFunction(controller.handleCancelClick)) {
                // If controller has redirectTo execution in handleCancelClick add true as argument and prevent re-routing in the method.
                controller.handleCancelClick(true);
            } else if (controller && Ext.isFunction(controller.handleCancel)) {
                controller.handleCancel();
            }
        },

        /**
         * Returns form submit button.
         *
         * @return {Ext.button.Button}
         */
        getSubmit : function getSubmit() {
            return this.down('button[action=submit]');
        },

        /**
         * Locks or unlocks form.
         * @chainable
         *
         * @param {Boolean} locked
         *
         * @returns criterion.ux.form.Panel
         */
        setLocked : function setLocked(locked) {
            let submit = this.getSubmit();

            if (submit) {
                submit.setDisabled(locked);
            }

            return this;
        },

        /**
         * Checks whether form is locked or not.
         *
         * @returns {Boolean}
         */
        isLocked : function isLocked() {
            let submit = this.getSubmit();

            return !!submit && submit.isDisabled();
        },

        getFormData : function() {
            return this.getForm().getValues(false, false, false, true);
        },

        initComponent : function() {
            let me = this;

            me.callParent(arguments);

            if (criterion.detectDirtyForms && !me.skipDirtyConfirmation) {
                Ext.GlobalEvents.on('beforeHideForm', me.onBeforeHideForm, me);
            }
        },

        /**
         * Validate fields from container specified by selector.
         *
         * @param selector
         * @return {boolean}
         * @param {boolean} [focus]
         */
        isValidSection : function(selector, focus) {
            let fields = this.query(selector + ' field'),
                fieldsValid = true;

            for (let i = 0; i < fields.length; i++) {
                let field = fields[i];

                if (!field.validate()) {
                    fieldsValid && focus && this.focusOnInvalidField(field); // focus on first invalid
                    fieldsValid = false;
                }
            }

            return fieldsValid
        },

        /**
         * Check if fields from container specified by selector were changed.
         *
         * @param selector
         * @returns {boolean}
         * @param {boolean} [clear]
         */
        isDirtySection : function(selector, clear) {
            let fields = this.query(selector + ' field'),
                fieldsDirty = false;

            for (let i = 0; i < fields.length; i++) {
                let field = fields[i];

                if (field.isDirty()) {
                    fieldsDirty = true;
                } else {
                    clear && field.clearInvalid();
                }
            }

            return fieldsDirty
        },

        focusOnInvalidField : function(field) {
            if (!field) {
                field = this.getForm().getFields().findBy(field => !field.isValid());
            }

            field && field.focus && field.focus();
        },

        /**
         * "Unfreeze" invalid form fields to compliment record.reject().
         *  See https://support.sencha.com/index.php#ticket-27911 and
         *  https://perfecthr.atlassian.net/browse/CRITERION-2805 for details.
         */
        rejectInvalidFields : function() {
            this.getForm().getFields().each(function(field) {
                if (!field.validate() && field.bind && field.bind.value) {
                    field.setValue(field.bind.value.lastValue);
                }
            });
        },

        focusFirstField : function() {
            let field = this.getForm().getFields().findBy(field => !field.disabled && !field.readOnly);

            Ext.Function.defer(() => {
                field && field.focus && field.focus();
            }, 100);
        }
    };

});

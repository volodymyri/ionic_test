Ext.define('criterion.controller.GridView', function() {

    return {
        alias : 'controller.criterion_gridview',

        extend : 'criterion.app.ViewController',

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex'
        ],

        config : {
            /**
             * Editor's configuration.
             *
             * @type {Object}
             */
            editor : undefined,

            /**
             * Show prompt on delete.
             */
            confirmDelete : true,

            /**
             * Field to be used as record title in UI.
             */
            recordTitleField : null,

            /**
             * Reload record's data from API before passing it to editor.
             */
            loadRecordOnEdit : true,

            /**
             * Object of extra options passed to request. Works with {@see loadRecordOnEdit} config.
             */
            loadRecordOnEditOptions : null,

            /**
             * Auto reloading grid after "afterSave" event from the editor
             */
            reloadAfterEditorSave : false,

            /**
             * Auto reloading grid after "afterDelete" event from the editor
             */
            reloadAfterEditorDelete : false,

            /**
             * Auto set On or Off loading state for the editor
             */
            disableAutoSetLoadingState : false,

            /**
             * Pass view component to editor, used for positioning of editor {@see criterion.ux.plugin.Sidebar}.
             * or object settings
             * {
             *   parentForSpecified : true // not connected to the specified view but to his parent
             * }
             */
            connectParentView : true,

            /**
             * Override "parent" view for connectParentView config.
             */
            connectedView : null,

            showTitleInConnectedViewMode : false,

            /**
             * Base route used by this GridView. If not set, grid won't set any routing.
             * For now, not applicable for rowEditing.
             */
            baseRoute : null,

            /**
             * Token for new entity used in routing.
             */
            newEntityToken : 'new',

            /**
             * Clear selection on {show} component event.
             *
             * @type {Boolean}
             */
            deselectOnShow : true,

            /**
             * Allows to configure suppression of events for {clearSelections} method.
             *
             * @type {Boolean}
             */
            clearSelectionSilent : true
        },

        /**
         * Confirm message for deleting record
         */
        customDeleteMsg : null,

        /**
         * @private
         */
        loadListener : null,

        /**
         * @private
         * Additional check restored grid view
         */
        gridViewRestored : true,

        /**
         * Returns data for empty row.
         */
        getEmptyRecord : function() {
            return {};
        },

        cancelEdit : function(record) {
            if (record && record.phantom && !record.$relatedPhantom) {
                record.store ? record.store.remove(record) : record.erase();
            }

            if (record && !record.phantom) {
                record.reject();
            }
        },

        createEditor : function(editorCfg, record) {
            let me = this,
                vm = this.getViewModel(),
                editor = Ext.create(editorCfg),
                editorVm,
                editorController = editor.getController(),
                sidebarPlugin = editor.findPlugin('criterion_sidebar');

            if (this.getConnectParentView()) {
                editor._connectedView = this.getConnectedView();
                !this.getShowTitleInConnectedViewMode() ? editor.setTitle(null) : null;
                editor.shadow = false;
                editor.draggable = false;
            } else {
                editor.setTitle((record.phantom ? i18n.gettext('Add') : i18n.gettext('Edit')) + ' ' + editor.getTitle());
                editor.on('destroy', function() {
                    me.setCorrectMaskZIndex(false);
                });
            }

            if (vm) {
                editorVm = editor.getViewModel();

                if (editorVm) {
                    // trick: moving a parent's view model datas to an editor view model.
                    editorVm.setData(Ext.Object.merge(editorVm.getData(), vm.getData()));
                    editorVm.set(me.getTransitionInfoByRecord(record));
                }
            }

            editor.on('show', this.handleEditorShow, this);

            if (!(editor.modal || (sidebarPlugin && sidebarPlugin.modal))) {
                this.getView().setStyle('opacity', 0);
            }

            editor.show();

            if (!this.getConnectParentView()) {
                this.setCorrectMaskZIndex(true);
            }

            if (Ext.isFunction(editorController.handleRecordLoad)) {
                editorController.handleRecordLoad.call(editorController, record);
            }

            return editor;
        },

        getTransitionInfoByRecord(record) {
            let store = this.getView().getStore(),
                idProperty = record && record.getIdProperty(),
                transitionInfo = {};

            if (store && idProperty) {
                let index = store.findExact(idProperty, record.get(idProperty)),
                    count = store.getCount(),
                    allowRouting = this.getHandleRoute(),
                    allowPrev = index > 0,
                    allowNext = index < (count - 1),
                    prevId = allowPrev ? store.getAt(index - 1).get(idProperty) : 0,
                    nextId = allowNext ? store.getAt(index + 1).get(idProperty) : 0;

                transitionInfo = {
                    allowPrev,
                    allowNext,
                    prevId,
                    nextId,

                    prev : allowRouting && !!prevId && this.makeGridToken(prevId),
                    next : allowRouting && !!nextId && this.makeGridToken(nextId)
                }
            }

            return {
                transitionInfo
            };
        },

        handleEditorShow : function() {
            this.getView().fireEvent('editorShow');
        },

        getConnectedView : function() {
            let externalCview = this.callParent(arguments),
                pvSet = this.getConnectParentView(),
                cView;

            cView = externalCview || this.getView();

            if (pvSet.parentForSpecified) {
                cView = cView.up();
            }

            return cView;
        },

        /**
         * @param editor
         * @param record
         * @private
         */
        _onCallbackLoad : function(editor, record) {
            if (!editor || editor.destroyed) {
                if (editor && !this.gridViewRestored) {
                    this.handleEditorDestroy();
                }
                return;
            }

            let me = this,
                view = this.getView(),
                active;

            if (editor.modal && Ext.Component.from(Ext.dom.Element.getActiveElement()) !== editor) {
                active = Ext.Element.getActiveElement();

                active && active.blur();
            }

            editor.loadRecord(record, view && Ext.isFunction(view.getStore) && view.getStore());
            !editor.disableAutoSetLoadingState && editor.setLoading(false);

            this._previousIdent = criterion.Application.getCurrentFormIdent();
            Ext.GlobalEvents.fireEvent('setCurrentFormIdent', editor.xtype);

            editor.on({
                save : me.handleAfterEdit,
                afterSave : me.handleAfterSave,
                afterDelete : me.handleAfterDelete,
                cancel : function(form, record) {
                    me.getView().fireEvent('editorCancel');
                    me.cancelEdit(record);
                    me.toggleAutoSync(true);
                },
                'delete' : function(record) {
                    me.handleRemoveAction(record, null, 0, 0, null, null, true);
                    me.toggleAutoSync(true);
                },
                destroy : me.handleEditorDestroy,
                scope : me
            });
        },

        handleEditorDestroy : function(editorView) {
            let view = this.getView();

            Ext.GlobalEvents.fireEvent('setCurrentFormIdent', this._previousIdent);

            view.fireEvent('editorDestroy');
            view.setStyle('opacity', 1);

            (!editorView || !editorView._preventReRoute) && this.updateGridToken();

            this.gridViewRestored = true;
        },

        startEdit : function(record, editor) {
            let me = this,
                grid = me.getView();

            if (record.phantom) {
                grid.getView().focusRow(record);
            }

            if (editor) {
                grid.getSelectionModel().select(record);
                editor = this.createEditor(editor, record);
            } else {
                editor = grid.getPlugin('rowEditing');

                if (editor) {
                    if (editor.autoCancel) {
                        editor.cancelEdit();
                    }
                    editor.startEdit(record, 0);
                    editor = editor.getEditor();
                }
            }

            if (!editor) {
                return;
            }

            !editor.disableAutoSetLoadingState && editor.setLoading(true);

            this.gridViewRestored = false;

            if (!record.phantom && this.getLoadRecordOnEdit()) {
                let opts = this.getLoadRecordOnEditOptions();

                record.load(Ext.apply(opts || {}, {
                    callback : Ext.bind(me._onCallbackLoad, me, [editor, record])
                }));
            } else {
                record.loadCodeData ? record.loadCodeData(Ext.bind(me._onCallbackLoad, me, [editor, record])) : me._onCallbackLoad(editor, record);
            }

            Ext.GlobalEvents.on('forcedFormClose', () => !editor.destroyed && editor.handleClose && editor.handleClose());

            return editor;
        },

        /**
         * @param opts
         * @returns {Ext.promise.Deferred.promise}
         */
        load : function(opts) {
            let view = this.getView(),
                dfd = Ext.create('Ext.Deferred');

            if (!view || !Ext.isFunction(view.getStore)) {
                dfd.resolve();

                return dfd.promise; // for prevent act deferred calls for destroyed views
            }

            // for quick click cases - https://criteriondev1.atlassian.net/browse/D1-12105
            // does not work well
            // https://criteriondev2.atlassian.net/browse/D2-13055
            // view.setStyle('opacity', 1);

            if (Ext.isFunction(view['getPreventStoreLoad']) && view['getPreventStoreLoad']()) {
                dfd.resolve();

                return dfd.promise;
            }

            if (Ext.isFunction(view.getStore().loadWithPromise)) {
                return view.getStore().loadWithPromise(Ext.apply({}, Ext.Object.merge(opts || {}, this.getAdditionalParams())));
            } else {
                view.getStore().load(Ext.apply({}, Ext.Object.merge(opts || {}, this.getAdditionalParams())));
                dfd.resolve();

                return dfd.promise;
            }
        },

        getAdditionalParams : function() {
            return {};
        },

        /**
         * @protected
         */
        getHandleRoute : function() {
            return !!this.getBaseRoute() && !this.getView().getPlugin('rowEditing')
        },

        /**
         * @protected
         * @returns {{}}
         */
        getGridRoutes : function(baseRoute) {
            let routes = {};

            routes[(baseRoute || this.getBaseRoute()) + '/:id'] = 'handleGridRoute';

            return routes;
        },

        /**
         * @protected
         * @param id
         */
        routeHandler : function(id) {
            let store = this.getView().getStore();

            if (id === this.getNewEntityToken()) {
                this.add();
            } else if (store.getById(id)) {
                this.edit(store.getById(id));
            }
        },

        /**
         * @protected
         */
        handleGridRoute : function() {
            let id = arguments[arguments.length - 1],
                store = this.getView().getStore(),
                handler = function() {
                    this.routeHandler(id);
                };

            this.loadListener && Ext.destroy(this.loadListener); // prevent double openers, see CRITERION-3202

            if (store.isLoaded()) {
                handler.apply(this);
            } else {
                this.loadListener = store.on('datachanged', handler, this, {single : true, destroyable : true});
            }
        },

        /**
         * @protected
         * @param id
         * @returns {*}
         */
        makeGridToken : function(id) {
            if (!id) {
                return this.getBaseRoute()
            } else {
                return this.getBaseRoute() + '/' + id
            }
        },

        /**
         * @protected
         * @param id
         */
        updateGridToken : function(id) {
            this.getHandleRoute() && Ext.History.add(this.makeGridToken.apply(this, arguments));
        },

        /**
         * @protected
         * @param value
         * @param oldValue
         */
        updateBaseRoute : function(value, oldValue) {
            let routes = this.getRoutes() || {};

            if (oldValue) { // delete previously added routes
                Ext.Object.each(this.getGridRoutes(oldValue), function(key) {
                    delete routes[key];
                });
            }

            this.baseRoute = value;

            if (value) {
                Ext.apply(routes, this.getGridRoutes());
            }

            this.setRoutes(Ext.Object.isEmpty(routes) ? null : routes);

            if (criterion.Utils.routerRecognizeFor(Ext.History.getToken(), this).length) {
                this.needToReRoute = Ext.History.getToken();
            }
        },

        /**
         * @private
         */
        needToReRoute : null,

        /**
         * Trigger hash update if necessary. Needed when GridView created late by lazyitems.
         *
         * @private
         */
        reRoute : function() {
            // check if we need to reroute and token weren't changed
            if (Ext.History.getToken() === this.needToReRoute) {
                Ext.util.History.fireEvent('change', Ext.History.getToken()); // replaced private call Ext.route.Router.onStateChange(Ext.History.getToken());
            }

            this.needToReRoute = null;
        },

        init : function() {
            this.load = Ext.Function.createBuffered(this.load, 100, this);
            this.handleActivate = Ext.Function.createBuffered(this.handleActivate, 100, this);
            this.handleGridRoute = Ext.Function.createBuffered(this.handleGridRoute, 100, this);

            this.callParent(arguments);
        },

        /**
         * @protected
         * @param record
         * @returns {*}
         */
        addRecord : function(record) {
            return this.getView().getStore().add(record)[0];
        },

        /**
         * @protected
         */
        add : function() {
            let record = this.getEmptyRecord();

            if (!record) {
                return;
            }

            this.startEdit(this.addRecord(record), this.getEditor());
            this.updateGridToken(this.getNewEntityToken());
        },

        /**
         * @protected
         * @param record
         */
        edit : function(record) {
            this.startEdit(record, this.getEditor());
        },

        /**
         * @protected
         * @param record
         */
        remove : function(record) {
            let view = this.getView();

            view.getStore().remove(record);
            view.fireEvent('afterRemove', record);
        },

        handleRefreshClick : function() {
            this.load();
        },

        handleAddClick : function() {
            this.toggleAutoSync(false);

            if (this.getHandleRoute()) {
                this.updateGridToken(this.getNewEntityToken());
            } else {
                this.add();
            }
        },

        handleEditAction : function(record) {
            if (this.getHandleRoute()) {
                this.updateGridToken(record.getId());
            } else {
                this.edit(record);
            }

            this.toggleAutoSync(false);
        },

        handleRemoveAction : function(record, cmp, x, y, action, config, force) {
            let me = this,
                deleteTitle,
                customTitle = this.customDeleteMsg,
                recordTitleField = this.getRecordTitleField();

            record.underAction = true;

            if (this.getConfirmDelete() && !force) {
                if (customTitle) {
                    deleteTitle = customTitle;
                } else {
                    deleteTitle = record.get(recordTitleField) ?
                        Ext.String.format(i18n.gettext('Do you want to delete {0} record?'), record.get(recordTitleField))
                        :
                        i18n.gettext('Do you want to delete the record?');
                }

                criterion.Msg.confirmDelete({
                        title : i18n.gettext('Delete'),
                        message : deleteTitle
                    },
                    function(btn) {
                        if (btn === 'yes') {
                            me.remove(record);
                        }
                        record.underAction = false;
                    }
                );
            } else {
                this.remove(record);
                record.underAction = false;
            }
        },

        /**
         * @param record
         * @param grid
         */
        handleMoveUpAction : Ext.emptyFn,

        /**
         * @param record
         * @param grid
         */
        handleMoveDownAction : Ext.emptyFn,

        /**
         * @param grid
         * @param record
         * @param selModel
         */
        handleRowSelect : Ext.emptyFn,

        handleCancelEdit : function(rowEditing, context) {
            this.cancelEdit(context.record);
            this.toggleAutoSync(true);
        },

        handleBeforeEdit : function(editor, context) {
            if (this.editor) {
                this.handleEditAction(context.record);
                return false;
            }
            if (context.column && context.column.xtype) {
                return context.column.xtype !== 'criterion_actioncolumn';
            }
        },

        /**
         * @protected
         * @param grid
         * @param td
         * @param cellIndex
         * @param record
         * @param tr
         * @param rowIndex
         * @param e
         * @returns {boolean}
         */
        handleBeforeCellClick : function(grid, td, cellIndex, record, tr, rowIndex, e) {
            let cbModelClick = (grid.getSelectionModel() && grid.getSelectionModel().type === 'checkboxmodel' && cellIndex === 0),
                isExpanderClick = !!e.getTarget('.' + Ext.baseCSSPrefix + 'grid-row-expander'),
                preventEdit = e.position && e.position.column &&
                    (
                        e.position.column.xtype === 'criterion_actioncolumn' ||
                        e.position.column.xtype === 'widgetcolumn' ||
                        e.position.column.xtype === 'criterion_widgetcolumn' || !!e.position.column.preventEdit || isExpanderClick
                    ),
                canEditing = (!this.getViewModel() || this.getViewModel() && !this.getViewModel().get('preventEditing')),
                view = this.getView();

            if (!preventEdit && !cbModelClick && !record.underAction && this.getEditor() && canEditing) {
                this.handleEditAction(record);

                return false;
            } else {
                if (!preventEdit && !cbModelClick && this.getView().hasListener('editaction') && canEditing) {
                    view.fireEvent('editaction', record, e.position && e.position.column);

                    return false;
                } else {
                    return !preventEdit;
                }
            }
        },

        /**
         * @param argument  mixed - depends on editor. expect record.
         */
        handleAfterEdit : function(argument) {
            if (argument && argument.isModel && !argument.isValid()) {
                console && console.debug && console.debug('Saved argument isn\'t valid', argument.getValidation());
            }
            this.toggleAutoSync(true);
        },

        handleAfterSave : function() {
            this.getView().fireEvent('editorAfterSave');
            if (this.getReloadAfterEditorSave()) {
                this.load();
            }
        },

        handleAfterDelete : function() {
            this.getView().fireEvent('editorAfterDelete');
            if (this.getReloadAfterEditorDelete()) {
                this.load();
            }
        },

        handleActivate : function() {
            if (this.checkViewIsActive()) {
                if (this.getHandleRoute()) {
                    this.reRoute();
                }

                Ext.Function.defer(this.load, 50, this);
            }
        },

        handleShow : function() {
            if (this.checkViewIsActive() && this.getDeselectOnShow()) {
                this.clearSelections();
            }
        },

        clearSelections : function() {
            let silent = this.getClearSelectionSilent();
            this.getView().getSelectionModel().deselectAll(silent);
        },

        handleAfterRender : function() {
            if (this.checkViewIsActive()) {
                if (this.getHandleRoute()) {
                    this.reRoute();
                }
            }
        },

        /**
         * @protected
         * @param state
         */
        toggleAutoSync : function(state) {
            let store = this.getView().getStore();

            if (store.autoSync) {
                state ? store.resumeAutoSync(true) : store.suspendAutoSync();
            }
        }
    };

});

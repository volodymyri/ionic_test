Ext.define('criterion.data.Store', function() {

    /*
     * Ext.store.ProxyStore contains error.
     * It tries to call Ext.Error.warn instead Ext.log.warn
     */
    if (!Ext.Error.warn) {
        Ext.Error.warn = Ext.log.warn;
    }

    return {
        extend : 'Ext.data.Store',

        alias : 'store.criterion',

        requires : [
            'criterion.data.proxy.Rest'
        ],

        mixins : [
            'criterion.data.mixin.StorePromises'
        ],

        loadCodeData : function(handler, scope, params) {
            if (!Ext.isFunction(this.getModel())) {
                return;
            }

            var record = new (this.getModel());

            if (record.getCodeDataIds) {
                criterion.CodeDataManager.load(record.getCodeDataIds(), handler, scope || this, params);
            }
        },

        executeOperation : function(operation) {
            var additionalParams = operation.config && operation.config.additionalParams || null;
            this.loadCodeData(function() {
                if (operation && !operation.destroyed) {
                    operation.execute();
                }
            }, this, additionalParams);
        },

        /**
         * Loads the Store using its configured {@link #proxy}.
         * @param {Object} options (optional) config object. This is passed into the {@link Ext.data.operation.Operation Operation}
         * object that is created and then sent to the proxy's {@link Ext.data.proxy.Proxy#read} function
         *
         * @return {Ext.data.Store} this
         * @since 1.1.0
         */
        loadStore : function(options) {
            var me = this,
                proxy = me.getProxy(),
                loadTask = me.loadTask,
                operation = {
                    internalScope : me,
                    internalCallback : me.onProxyLoad
                }, filters, sorters, session;

            // Only add filtering and sorting options if those options are remote
            if (me.getRemoteFilter()) {
                filters = me.getFilters();
                if (filters.getCount()) {
                    operation.filters = filters.getRange();
                }
            }
            if (me.getRemoteSort()) {
                sorters = me.getSorters();
                if (sorters.getCount()) {
                    operation.sorters = sorters.getRange();
                }
            }
            Ext.apply(operation, options);
            operation.scope = operation.scope || me;
            if (!operation.recordCreator) {
                session = me.getSession();
                if (session) {
                    operation.recordCreator = session.recordCreator;
                }
            }
            me.lastOptions = operation;

            operation = proxy.createOperation('read', operation);

            if (me.fireEvent('beforeload', me, operation) !== false) {
                me.loading = true;
                if (loadTask) {
                    loadTask.cancel();
                    me.loadTask = null;
                }

                Ext.Function.createBuffered(me._callExecute, 10, me, [operation])();
            }

            return me;
        },

        _callExecute : function(operation) {
            this.executeOperation(operation);
        },

        /**
         * Loads data into the Store via the configured {@link #proxy}. This uses the Proxy to make an
         * asynchronous call to whatever storage backend the Proxy uses, automatically adding the retrieved
         * instances into the Store and calling an optional callback if required. Example usage:
         *
         *     store.load({
         *         scope: this,
         *         callback: function(records, operation, success) {
         *             // the {@link Ext.data.operation.Operation operation} object
         *             // contains all of the details of the load operation
         *             console.log(records);
         *         }
         *     });
         *
         * If the callback scope does not need to be set, a function can simply be passed:
         *
         *     store.load(function(records, operation, success) {
         *         console.log('loaded records');
         *     });
         *
         * @param {Object/Function} [options] config object, passed into the Ext.data.operation.Operation object before loading.
         * Additionally `addRecords: true` can be specified to add these records to the existing records, default is
         * to remove the Store's existing records first.
         */
        load : function(options) {
            var me = this,
                recordCreator = me.recordCreator,
                pageSize = me.getPageSize();

            if (typeof options === 'function') {
                options = {
                    callback : options
                };
            } else {
                options = Ext.apply({}, options);
            }

            // Only add grouping options if grouping is remote
            if (me.getRemoteSort() && !options.grouper && me.getGrouper()) {
                options.grouper = me.getGrouper();
            }

            if (pageSize || 'start' in options || 'limit' in options || 'page' in options) {
                options.page = options.page || me.currentPage;
                options.start = (options.start !== undefined) ? options.start : (options.page - 1) * pageSize;
                options.limit = options.limit || pageSize;
            }

            options.addRecords = options.addRecords || false;

            if (recordCreator) {
                options.recordCreator = recordCreator;
            }

            return this.loadStore(options);
        },

        /**
         * @private
         * Callback for any write Operation over the Proxy. Updates the Store's MixedCollection to reflect
         * the updates provided by the Proxy
         */
        onProxyWrite : function(operation) {
            var me = this;

            me.callParent(arguments);

            if (!operation.wasSuccessful()) {
                me.fireEvent('writeerror', me);
            }
        }
    };

});

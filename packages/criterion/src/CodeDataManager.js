/**
 * @singleton
 */
Ext.define('criterion.CodeDataManager', function() {

    let loadBuffer = [],
        cachedTables = [],
        debug = false;

    function executeQueuedPromises(doResolve, queueItems) {
        for (let i = 0; i < queueItems.length; i++) {
            Ext.callback(queueItems[i].fnArgs[1], queueItems[i].fnArgs[2]);
            doResolve ? queueItems[i].dfd.resolve() : queueItems[i].dfd.reject();
        }

        debug && console && console.debug('executeQueuedPromises', queueItems.length);

        queueItems = null;
    }

    return {
        requires : [
            'criterion.Consts',
            'criterion.store.CodeTables',
            'criterion.store.codeTable.Details'
        ],

        mixins : [
            'Ext.mixin.Observable'
        ],

        singleton : true,

        freezedFilters : [],
        codeTablesStore : null,

        constructor : function() {
            this.loadBuffer = Ext.Function.createBuffered(this.loadBuffer, 75, this);
            this.callParent(arguments);
        },

        /**
         * @private
         * @param codeTableName
         */
        addToCache : function(codeTableName) {
            debug && console && console.debug('addToCache ', codeTableName);

            if (cachedTables.indexOf(codeTableName) === -1) {
                cachedTables.push(codeTableName);
            }
        },

        removeFromCache : function(codeTableName) {
            Ext.Array.remove(cachedTables, codeTableName);
        },

        /**
         * @private
         * @param codeTableNames
         * @returns {*}
         */
        getNotCached : function(codeTableNames) {
            return Ext.Array.filter(codeTableNames, function(codeTableName) {
                return !Ext.Array.contains(cachedTables, codeTableName)
            })
        },

        loadCodeTables : function() {
            return this.getCodeTablesStore().loadWithPromise()
        },

        loadCodeTablesFromData : function(data) {
            return this.getCodeTablesStore().loadData(data);
        },

        getCodeTablesStore : function() {
            if (!this.codeTablesStore) {
                this.codeTablesStore = Ext.create('criterion.store.CodeTables');
            }
            return this.codeTablesStore;
        },

        getCodeTableIdByName : function(codeTableName) {
            let ctStore = this.getCodeTablesStore(),
                index = ctStore.findExact('name', codeTableName);

            return index !== -1 ? ctStore.getAt(index).get('id') : 0;
        },

        getCodeTableNameById : function(codeTableId) {
            let ctStore = this.getCodeTablesStore(),
                index = ctStore.findExact('id', codeTableId);

            return index !== -1 ? ctStore.getAt(index).get('name') : '';
        },

        getCodeTableById : function(codeTableId) {
            let ctStore = this.getCodeTablesStore(),
                index = ctStore.findExact('id', codeTableId);

            return index !== -1 ? ctStore.getAt(index) : null;
        },

        codeTablesStoreFreezeFilters : function() {
            let me = this;
            this.freezedFilters = [];
            this.getCodeTablesStore().getFilters().each(function(filter) {
                me.freezedFilters.push(filter);
            });
            this.getCodeTablesStore().clearFilter();
        },

        codeTablesStoreUnfreezeFilters : function() {
            this.freezedFilters && this.getCodeTablesStore().setFilters(this.freezedFilters);
        },

        getStore : function(codeTableCode) {
            let storeId = 'codeTable_' + codeTableCode,
                store;

            store = Ext.data.StoreManager.lookup(storeId);
            if (!store) {
                store = Ext.data.StoreManager.lookup({
                    type : 'criterion_code_table_details',
                    storeId : storeId,
                    codeTableId : codeTableCode
                });
            }

            return store;
        },

        loadBuffer : function() {
            let queuedTables = [],
                queuedItems = [],
                cachedItems = [],
                lArgs,
                i;

            /// todo handle different request params !

            for (i = 0; i < loadBuffer.length; i++) {
                let bufferItem = loadBuffer[i];

                if (bufferItem.fnArgs[3]) {
                    lArgs = bufferItem.fnArgs[3];
                }

                if (!bufferItem.processed) {
                    let itemCodeTables = Ext.Array.clean(bufferItem.fnArgs[0]),
                        notCachedTables = this.getNotCached(itemCodeTables);

                    debug && console && console.debug('bufferItem', i, 'itemCodeTables ', itemCodeTables);
                    debug && console && console.debug('bufferItem', i, 'notCachedTables ', notCachedTables);

                    if (notCachedTables.length) {
                        queuedTables = Ext.Array.merge(queuedTables, notCachedTables);
                        queuedItems.push(bufferItem);
                    } else {
                        cachedItems.push(bufferItem);
                    }

                    bufferItem.processed = true;
                }
            }

            debug && console && console.debug('loadBuffer ', loadBuffer.length);

            Ext.Array.each(Ext.Array.merge(queuedItems, cachedItems), function(item) {
                // remove all items from processed queue
                Ext.Array.remove(loadBuffer, item);
            });

            debug && console && console.debug('queuedItems ', queuedItems.length);
            debug && console && console.debug('cachedItems ', cachedItems.length);
            debug && console && console.debug('queuedTables ', queuedTables.length);

            if (queuedTables.length) {
                criterion.Api.loadCodeData(
                    queuedTables,
                    function(result) {
                        //<debug>
                        // for dev purposes
                        Ext.Array.each(Ext.Object.getKeys(criterion.consts.Api.OVERRIDE_CODETABLE_CFG), function(overCfgName) {
                            if (Ext.Array.contains(queuedTables, overCfgName)) {
                                result.push(criterion.consts.Api.OVERRIDE_CODETABLE_CFG[overCfgName]);
                            }
                        });
                        //</debug>

                        Ext.Array.each(result, function(codeTable) {
                            let store = this.getStore(codeTable.name),
                                sorters = store.getSorters();

                            // custom sorter
                            if (codeTable.name === criterion.consts.Dict.REVIEW_COMPETENCY_GROUP) {
                                sorters.removeAll();
                                sorters.add({
                                    direction : 'ASC',
                                    sorterFn : function(record1, record2) {
                                        let asInt = function(s) {
                                                let val = parseInt(String(s).replace(/,/g, ''), 10);
                                                return isNaN(val) ? 0 : val;
                                            },
                                            name1 = asInt(record1.data.attribute1),
                                            name2 = asInt(record2.data.attribute1);

                                        return name1 > name2 ? 1 : (name1 === name2) ? 0 : -1;
                                    }
                                });
                            }

                            store.loadData(codeTable.data);
                            this.addToCache(codeTable.name);
                        }, this);

                        executeQueuedPromises(true, queuedItems);
                    },
                    function() {
                        executeQueuedPromises(false, queuedItems);
                    },
                    this,
                    (Ext.isObject(lArgs) ? lArgs : {})
                );
            } else {
                executeQueuedPromises(true, queuedItems);
            }

            if (cachedItems.length) {
                executeQueuedPromises(true, cachedItems);
            }
        },

        /**
         * @param codeTableNames
         * @param handler
         * @param scope
         * @param {Object} params
         * @param {Number} params.employerId
         *
         * @returns {Ext.promise.Deferred.promise}
         */
        load : function(codeTableNames, handler, scope, params) {
            let dfd = Ext.create('Ext.promise.Deferred');

            debug && console && console.debug('load', codeTableNames.length, codeTableNames);

            loadBuffer.push({
                fnArgs : Array.prototype.slice.call(arguments, 0),
                dfd : dfd
            });

            this.loadBuffer();

            return dfd.promise;
        },

        loadByIds : function(ids, handler, scope, params) {
            let codeTableNames = [];

            ids = Ext.Array.clean(Ext.Array.unique(ids));
            if (ids.length) {
                Ext.each(ids, function(id) {
                    codeTableNames.push(this.getCodeTableNameById(id));
                }, this);
            }

            return this.load(codeTableNames, handler, scope, params);
        },

        /**
         * @param codeTableCode
         * @returns {*|Ext.Promise|Ext.promise.Promise|Promise<any>|PromiseLike<any>}
         */
        loadIfEmpty : function(codeTableCode) {
            let dfd = Ext.create('Ext.Deferred'),
                store = this.getStore(codeTableCode),
                codeTableCodes = Ext.isArray(codeTableCode) ? codeTableCode : [codeTableCode];

            if (store.isLoaded()) {
                dfd.resolve(store);
            } else {
                this.load(codeTableCodes).then(function() {
                    dfd.resolve(store);
                }, function() {
                    dfd.reject();
                })
            }

            return dfd.promise;
        },

        save : function(codeTableId, data, handler, scope) {
            let me = this,
                dfd = Ext.create('Ext.Deferred');

            if (typeof codeTableId === 'undefined') {
                console && console.error('codeTableId is not defined');
                return;
            }

            criterion.Api.saveCodeData(
                Ext.Object.merge(data || {}, {id : codeTableId}),
                function(response) {
                    let resp = (typeof response !== 'undefined' ? response.id : null);

                    me.load([codeTableId], function() {
                        Ext.callback(handler, scope, [resp]);
                        dfd.resolve(resp);
                    });
                },
                function() {
                    dfd.reject();
                }
            );

            return dfd.promise;
        },

        remove : function(id, codeTableId, handler, scope) {
            let me = this,
                dfd = Ext.create('Ext.Deferred');

            if (typeof codeTableId === 'undefined') {
                console && console.error('codeTableId is not defined');
                return;
            }

            criterion.Api.deleteCodeDataRecord(
                id,
                function() {
                    me.load([codeTableId], function() {
                        Ext.callback(handler, scope);
                        dfd.resolve();
                    });
                },
                function() {
                    dfd.reject();
                }
            );

            return dfd.promise;
        },

        getCodeDetailRecord : function(field, value, codeTableCode) {
            let store = this.getStore(codeTableCode),
                index;

            if (!store) {
                Ext.Logger.warn(['Code Table is not loaded', codeTableCode].join(' '));
                return null;
            }

            index = store.findExact(field, value);

            if (index !== -1) {
                return store.getAt(index);
            } else {
                //<debug>
                // console && console.warn(['Record is not found', field, value, codeTableCode].join(' '));
                //</debug>
                return null;
            }
        },

        getCodeDetailRecordStrict : function(field, value, codeTableCode) {
            let me = this,
                dfd = Ext.create('Ext.Deferred'),
                record = this.getCodeDetailRecord(field, value, codeTableCode);

            if (record) {
                dfd.resolve(record);
            } else {
                this.load([codeTableCode]).then(function() {
                    record = me.getCodeDetailRecord(field, value, codeTableCode);
                    record && dfd.resolve(record) || dfd.reject();
                })
            }

            return dfd.promise;
        },

        getValue : function(id, codeTableCode, field) {
            let codeDetailRecord = this.getCodeDetailRecord('id', id, codeTableCode);
            return codeDetailRecord ? codeDetailRecord.get(field || 'description') : null;
        },

        isEmptyStore : function(codeTableCode) {
            return !this.getStore(codeTableCode).count();
        }
    };

});

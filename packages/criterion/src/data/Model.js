Ext.define('criterion.data.Model', function() {

    return {
        extend : 'Ext.data.Model',

        requires : [
            'Ext.data.validator.*',
            'criterion.data.validator.*',
            'criterion.data.field.*',
            'criterion.data.field.CodeDataValue'
        ],

        /**
         * @property {Object} _loadParams
         * Temporarily saves loading parameters.
         * If model will be rejected while erasing - it helps us to restore load parameters.
         */
        _loadParams : null,

        /**
         * @property {Object} _shadow
         * Save model properties to _shadow required for resurrection after unsuccessful erasing.
         */
        _shadow : null,

        /**
         * Name of model according to server's meta_table
         */
        metaName : null,

        disableCaching : false,

        // todo move criterion.Utils.fieldsLocalCache and others related methods to separate class

        constructor() {
            this.callParent(arguments);

            let cachedName = this.getCacheName(),
                currentCached = !this.disableCaching && criterion.Utils.fieldsLocalCache && criterion.Utils.fieldsLocalCache.getItem(cachedName),
                me = this;

            if (currentCached) {
                Ext.defer(() => {
                    me._setFromLocalCache = true;
                    me.set(Ext.JSON.decode(currentCached));
                    delete me._setFromLocalCache;
                }, 1000);
            }

        },

        set(fieldName, newValue, options) {
            if (this.disableCaching || (Ext.isObject(newValue) && newValue.disableCaching) || (options && options.disableCaching)) {
                this.callParent(arguments);
                return;
            }

            let me = this,
                cachedName = this.getCacheName(),
                currentCached = criterion.Utils.fieldsLocalCache && criterion.Utils.fieldsLocalCache.getItem(cachedName),
                isReject = Ext.isObject(newValue) && Ext.Object.equals(newValue, this._rejectOptions);

            currentCached = currentCached ? Ext.JSON.decode(currentCached) : {};

            if (!this._ignoreCacheSet && !this._setFromLocalCache && criterion.Utils.fieldsLocalCache) {
                if (Ext.isObject(fieldName)) {
                    Ext.Object.each(fieldName, (key, value) => {
                        this.updateCached(key, value, currentCached, cachedName, isReject);
                    });
                } else {
                    Ext.defer(() => {
                        me.updateCached(fieldName, newValue, currentCached, cachedName, isReject);
                    }, 100);
                }
            }

            if (!this._ignoreCacheSet && this._setFromLocalCache && Ext.isObject(fieldName)) {
                Ext.Object.each(fieldName, (key, value) => {
                    if (this.fieldsMap[key] && this.fieldsMap[key].isDateField) {
                        fieldName[key] = Ext.Date.parse(value);
                    }

                    Ext.defer(() => {
                        let customField = me._customField || me.customFields && me.customFields[key];

                        if (customField) {
                            let fieldValue = fieldName['value'] || fieldName[key];

                            customField.setValue(
                                customField.getXType() === 'datefield' ? Ext.Date.parse(fieldValue) : fieldValue
                            );
                        } else {
                            me.set.call(me, fieldName, newValue, options);
                        }
                    }, 1000, me);
                });

            } else {
                this.callParent(arguments);
            }
        },

        updateCached(fieldName, value, currentCached, cachedName, isReject) {
            if (this.fieldsMap[fieldName] && (this.fieldsMap[fieldName].persist || this.fieldsMap[fieldName].caching)) {
                let fieldValue = this.get(fieldName),
                    isDates = this.isDateField && this.isDateField();

                if (isDates) {
                    if (!Ext.isDate(fieldValue)) {
                        fieldValue = Ext.Date.parse(fieldValue);
                    }

                    if (!Ext.isDate(value)) {
                        value = Ext.Date.parse(value);
                    }
                }

                if (
                    ((isDates ? !Ext.Date.isEqual(fieldValue, value) : fieldValue !== value) && !isReject) ||
                    (this.dirty && fieldValue === value && (this.modified && Ext.isDefined(this.modified[fieldName])))
                ) {
                    currentCached[fieldName] = value;
                    this.setToCache(cachedName, Ext.JSON.encode(currentCached));
                } else {
                    if (currentCached && currentCached[fieldName]) {
                        delete currentCached[fieldName];
                    }

                    if (!currentCached || Ext.Object.isEmpty(currentCached)) {
                        this.removeFromCache(cachedName);
                    } else {
                        this.setToCache(cachedName, Ext.JSON.encode(currentCached));
                    }
                }
            }
        },

        getCacheName() {
            let parentId;

            Ext.Object.each(this.associations, name => {
                let pid = this.get(name.replace('.', '') + 'Id');

                if (pid) {
                    parentId = pid;
                    return false;
                }
            });

            return `${parentId ? parentId + '-' : ''}${this.$className}-${this.phantom ? 'new' : ''}${this.getId()}`;
        },

        setToCache(cachedName, value) {
            criterion.Utils.fieldsLocalCache && criterion.Utils.fieldsLocalCache.setItem(cachedName, value);

            criterion.Utils.fieldsLocalCacheHolder && criterion.Utils.fieldsLocalCacheHolder.setItem(cachedName, Ext.Date.now());
        },

        removeFromCache(cachedName) {
            criterion.Utils.fieldsLocalCache && criterion.Utils.fieldsLocalCache.removeItem(cachedName);

            criterion.Utils.fieldsLocalCacheHolder && criterion.Utils.fieldsLocalCacheHolder.removeItem(cachedName)
        },

        saveWithPromise : function(params) {
            var dfd = Ext.create('Ext.Deferred');

            this.save({
                scope : dfd,
                success : dfd.resolve,
                params : params || {},
                failure : dfd.reject
            });

            return dfd.promise;
        },

        loadWithPromise : function(opts) {
            var dfd = Ext.create('Ext.Deferred'),
                args = Array.prototype.slice.call(arguments);

            args[0] = Ext.apply(args[0] || {}, {
                callback : function(rec, operation) {
                    // ignore operation.getRecords().length
                    if (operation && operation.wasSuccessful()) {
                        dfd.resolve(rec);
                    } else {
                        dfd.reject();
                    }
                }
            });

            this.load.apply(this, args);

            return dfd.promise;
        },

        eraseWithPromise : function(params) {
            var dfd = Ext.create('Ext.Deferred');

            this.erase({
                scope : dfd,
                success : dfd.resolve,
                failure : dfd.reject,
                params : params || {}
            });

            return dfd.promise;
        },

        /**
         * @param [noRecurse]
         * @returns {*}
         */
        getCodeDataFields : function(noRecurse) {
            var fields = [];

            if (!noRecurse) {
                Ext.Object.each(this.associations, function(roleName, association) {
                    if (association.cls) {
                        var rec = new association.cls;

                        if (Ext.isFunction(rec.getCodeDataFields)) {
                            fields = fields.concat(rec.getCodeDataFields(true))
                        }

                        rec = null;
                    }
                });
            }

            fields = Ext.Array.merge(fields, Ext.Array.filter(this.getFields(), function(field) {
                return field.codeDataId != null;
            }));

            return fields;
        },

        getCodeDataIds : function() {
            return Ext.Array.map(this.getCodeDataFields(), function(field) {
                return field.codeDataId;
            });
        },

        loadCodeData : function(handler, scope) {
            criterion.CodeDataManager.load(this.getCodeDataIds(), function() {
                Ext.callback(handler, scope || this, [this]);
            }, this);
        },

        executeOperation : function(operation) {
            this.loadCodeData(function() {
                operation.execute();
            });
        },

        /**
         * Load the model instance using the configured proxy.
         *
         *     Ext.define('MyApp.User', {
         *         extend: 'Ext.data.Model',
         *         fields: [
         *             {name: 'id', type: 'int'},
         *             {name: 'name', type: 'string'}
         *         ]
         *     });
         *
         *     var user = new MyApp.User();
         *     user.load({
         *         scope: this,
         *         failure: function(record, operation) {
         *             //do something if the load failed
         *         },
         *         success: function(record, operation) {
         *             //do something if the load succeeded
         *         },
         *         callback: function(record, operation, success) {
         *             //do something whether the load succeeded or failed
         *         }
         *     });
         *
         * @param {Object} [options] Config options for this load.
         * @param {Function} options.success A function to be called when the
         * model is loaded successfully.
         * The callback is passed the following parameters:
         * @param {Ext.data.Model} options.success.record The record.
         * @param {Ext.data.operation.Operation} options.success.operation The operation.
         *
         * @param {Function} options.failure A function to be called when the
         * model is unable to be loadedy.
         * The callback is passed the following parameters:
         * @param {Ext.data.Model} options.failure.record The record (`null` for a failure).
         * @param {Ext.data.operation.Operation} options.failure.operation The operation.
         *
         * @param {Function} options.callback A function to be called after a load,
         * whether it was successful or not.
         * The callback is passed the following parameters:
         * @param {Ext.data.Model} options.callback.record The record (`null` for a failure).
         * @param {Ext.data.operation.Operation} options.callback.operation The operation.
         * @param {Boolean} options.callback.success `true` if the operation was successful
         * and the model was loaded.
         *
         * @param {Object} options.scope The scope in which to execute the callback functions.
         *
         * @return {Ext.data.Operation} The operation object for loading this model.
         */
        load : function(options) {
            options = Ext.apply({}, options);

            var me = this,
                scope = options.scope || me,
                proxy = me.getProxy(),
                callback = options.callback,
                operation = me.loadOperation,
                id = me.getId(),
                extras,
                cachedName = this.getCacheName(),
                currentCached = criterion.Utils.fieldsLocalCache && criterion.Utils.fieldsLocalCache.getItem(cachedName);

            if (operation) {
                // Already loading, push any callbacks on and jump out
                extras = operation.extraCalls;
                if (!extras) {
                    extras = operation.extraCalls = [];
                }
                extras.push(options);
                return operation;
            }

            //<debug>
            if (me.phantom) {
                //Ext.Error.raise('Cannot load phantom model');
                this.loadCodeData(function() {
                    Ext.callback(callback, scope, [this, null, true]);
                });
                return;
            }
            //</debug>

            options.id = id;

            // Always set the recordCreator. If we have a session, we're already
            // part of said session, so we don't need to handle that.
            options.recordCreator = function(data, type, readOptions) {
                // Important to change this here, because we might be loading associations,
                // so we do not want this to propagate down. If we have a session, use that
                // so that we end up getting the same record. Otherwise, just remove it.
                var session = me.session;

                // Alexander Shipilov: Added to avoid js error.
                readOptions = readOptions || {};

                readOptions.recordCreator = session ? session.recordCreator : null;

                me._ignoreCacheSet = true;

                me.set(data, me._commitOptions);

                delete me._ignoreCacheSet;
                //<debug>
                // Do the id check after set since converters may have run
                if (!options.skipIdCheck && me.getId() !== id) { // skip id needed is special cases (search code for examples)
                    Ext.Error.raise('Invalid record id returned for ' + id + '@' + me.entityName);
                }
                //</debug>
                return me;
            };

            options.internalCallback = function(operation) {
                var success = operation.wasSuccessful() && operation.getRecords().length > 0,
                    op = me.loadOperation,
                    extras = op.extraCalls,
                    successFailArgs = [me, operation],
                    callbackArgs = [me, operation, success],
                    i, len;

                me.loadOperation = null;

                if (success) {
                    Ext.callback(options.success, scope, successFailArgs);
                } else {
                    Ext.callback(options.failure, scope, successFailArgs);
                }
                Ext.callback(callback, scope, callbackArgs);

                // Some code repetition here, however in a vast majority of cases
                // we'll only have a single callback, so optimize for that case rather
                // than setup arrays for all the callback options
                if (extras) {
                    for (i = 0, len = extras.length; i < len; ++i) {
                        options = extras[i];
                        if (success) {
                            Ext.callback(options.success, scope, successFailArgs);
                        } else {
                            Ext.callback(options.failure, scope, successFailArgs);
                        }
                        Ext.callback(options.callback, scope, callbackArgs);
                    }
                }
                me.callJoined('afterLoad');

                if (currentCached) {
                    me._setFromLocalCache = true;

                    me.set(Ext.JSON.decode(currentCached));

                    delete me._setFromLocalCache;
                }
            };
            delete options.callback;

            me.loadOperation = operation = proxy.createOperation('read', options);
            me._loadParams = operation.getParams();

            this.executeOperation(operation);

            return operation;
        },

        /**
         * Creates phantom copy of the current model instance.
         *
         * All toMany associations are generated as new to generate row in connection table in DB. WARN This logic might suit not every case.
         *
         * @returns {Ext.data.Model} Copy of current model
         */
        copyWithAssociations : function() {
            var associations = this.associations,
                copy = this.copy(null);

            for (var associationName in associations) {
                var associationCfg = associations[associationName],
                    association, associationStore;

                if (associationCfg.isMany) {
                    associationStore = this[associationName]();

                    associationStore.each(function(assoc) {
                        assoc.phantom = true;
                    });

                    copy[associationName]().add(associationStore.getRange());
                } else {
                    association = this[associationCfg.getterName]();

                    if (association) {
                        copy[associationCfg.setterName](association);
                    }
                }
            }

            return copy;
        },

        erase : function() {
            var me = this;

            if (!me.phantom && me.associations && !Ext.Object.isEmpty(me.associations)) {
                me._shadow = {
                    record : new me.self({id : me.getId()}),
                    //Allows found and save model`s store and bindings. If model will be rejected - it helps us to restore record in store and in viewModel.
                    store : me.store,
                    stub : Ext.Array.findBy(me.joined, function(obj) {
                        return Ext.getClassName(obj) === 'Ext.app.bind.Stub'
                    }),
                    storeIndex : me.store && me.store.indexOf(me)
                };
            }

            if (me.phantom) {
                me.removeFromCache(me.getCacheName());
            }

            this.callParent(arguments);
        },

        reject : function() {
            var me = this;

            //If model does not have _shadow property - will be rejected via parent class method.
            if (!me._shadow) {
                me.callParent(arguments)
            } else {
                var initialRecord = me._shadow.record,
                    store = me._shadow.store,
                    stub = me._shadow.stub;

                //Restoring record initial state
                initialRecord.load(Ext.apply({}, {
                    params : me._loadParams,
                    callback : function() {
                        store && store.insert(me._shadow.storeIndex, initialRecord);
                        stub && stub.owner && stub.owner.set && stub.owner.set(stub.name, initialRecord);
                    }
                }));
            }

            me.associations && Ext.iterate(me.associations, function(name) {
                let association;

                if (!Ext.isFunction(me[name])) {
                    return;
                }

                association = me[name]();

                if (association.isStore) {
                    association.rejectChanges();
                } else if (association.isModel) {
                    association.reject();
                }
            });

            me.removeFromCache(me.getCacheName());
        },

        /**
         * Descriptor hold security access to model's field. If no descriptor provided for the field then security is not applied.
         * Field-level security really make sense only for persistent fields, calculated and non-persistent fields
         * shouldn't be affected.
         *
         * @private
         * @type {Object}
         */
        securityDescriptor : null,

        getSecurityAccess : function(token) {
            return this.getSecurityDescriptor()[token];
        },

        getSecurityDescriptor : function() {
            return this.securityDescriptor || {};
        },

        setSecurityDescriptor : function(securityData) {
            var descriptor = {}, fields = {};

            Ext.Object.each(securityData, function(key, value) {
                if (Ext.isObject(value)) {
                    descriptor[key] = value;
                } else {
                    // support for legacy format; should be changed in scope of Auth 3.0
                    descriptor[key] = {
                        view : value,
                        edit : value
                    }
                }

            });

            this.securityDescriptor = descriptor;

            Ext.Object.each(descriptor, function(token, value) {
                var split = token.split('.');

                if (split.length != 2) { // sanity check
                    return;
                }

                var table = split[0],
                    field = split[1];

                fields[table] = fields[table] || {};
                fields[table][field] = value;
            });

            this.set('securityFields', fields);
        },

        /**
         * Returns field token meta_table.meta_field.
         * @param fieldName
         * @returns {String|null}
         */
        getFieldMeta : function(fieldName) {
            var field = Ext.Array.findBy(this.getFields(), function(field) {
                return field.name === fieldName
            });

            if (field && this.metaName) {
                return Ext.String.format('{0}.{1}', this.metaName, field.metaName || fieldName.toUnderscore());
            } else {
                return null;
            }
        },

        getAssociatedData : function(result, options) {
            var res;

            options && options.associatedForCommit && (this.$gatheringForCommit = true);

            res = this.callParent(arguments);

            delete this.$gatheringForCommit;

            return res;
        },

        updateAssociated : function(serverData) {
            var associations = this.associations,
                association, roleName, item;

            var commitSetOptions = {convert : true, commit : true};

            for (roleName in associations) {
                association = associations[roleName];
                item = association.getterName && Ext.isFunction(this[association.getterName]) && this[association.getterName]();

                if (!item) { // assuming that items should be already created
                    continue
                }

                var roleData = serverData[roleName];

                if (item.isStore) {
                    if (!roleData) { // support old code
                        return;
                    }

                    for (var i = 0; i < roleData.length; i++) {
                        var storeItem = item.getAt(i),
                            roleItemData = roleData[i];

                        if (roleItemData) {
                            storeItem.set(roleItemData, commitSetOptions);
                            storeItem.updateAssociated && storeItem.updateAssociated(roleItemData);
                        }
                    }
                } else if (item.isModel) {
                    if (roleData) {
                        item.set(roleData); // not sure why 2 operations..
                        item.set(roleData, commitSetOptions);
                        roleData && item.updateAssociated && item.updateAssociated(roleData);
                    }
                }
            }
        },

        statics : {

            identifier : false,

            /**
             * Asynchronously loads a model instance by id. Sample usage:
             *
             *     Ext.define('MyApp.User', {
             *         extend: 'Ext.data.Model',
             *         fields: [
             *             {name: 'id', type: 'int'},
             *             {name: 'name', type: 'string'}
             *         ]
             *     });
             *
             *     MyApp.User.load(10, {
             *         scope: this,
             *         failure: function(record, operation) {
             *             //do something if the load failed
             *         },
             *         success: function(record, operation) {
             *             //do something if the load succeeded
             *         },
             *         callback: function(record, operation, success) {
             *             //do something whether the load succeeded or failed
             *         }
             *     });
             *
             * @param {Number/String} id The id of the model to load
             * @param {Object} [options] Config options for this load.
             * @param {Function} options.success A function to be called when the
             * model is loaded successfully.
             * The callback is passed the following parameters:
             * @param {Ext.data.Model} options.success.record The record.
             * @param {Ext.data.operation.Operation} options.success.operation The operation.
             *
             * @param {Function} options.failure A function to be called when the
             * model is unable to be loadedy.
             * The callback is passed the following parameters:
             * @param {Ext.data.Model} options.failure.record The record (`null` for a failure).
             * @param {Ext.data.operation.Operation} options.failure.operation The operation.
             *
             * @param {Function} options.callback A function to be called after a load,
             * whether it was successful or not.
             * The callback is passed the following parameters:
             * @param {Ext.data.Model} options.callback.record The record (`null` for a failure).
             * @param {Ext.data.operation.Operation} options.callback.operation The operation.
             * @param {Boolean} options.callback.success `true` if the operation was successful
             * and the model was loaded.
             *
             * @param {Object} options.scope The scope in which to execute the callback functions.
             *
             * @param {Ext.data.Session} session The session for this record.
             *
             * @return {Ext.data.Model} The newly created model. Note that the model will (probably) still
             * be loading once it is returned from this method. To do any post-processing on the data, the
             * appropriate place to do see is in the callback.
             *
             * @static
             * @inheritable
             */
            load : function(id, options, session) {
                var rec = new this({
                    id : id
                }, session);

                rec.load(options);
                return rec;
            },

            loadCodeData : function(handler, scope) {
                var rec = new this();

                rec.loadCodeData(handler, scope);
            }
        },

        inheritableStatics : {
            loadWithPromise : function(id, options, session) {
                var rec = new this({
                    id : id
                }, session);

                return rec.loadWithPromise(options)
            }
        }
    };

});

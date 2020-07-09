Ext.define('criterion.controller.CustomFields', function() {

    return {
        alias : 'controller.criterion_customfields',

        extend : 'criterion.app.ViewController',

        requires : [
            'criterion.store.customField.Values'
        ],

        listen : {
            controller : {
                '*' : {
                    possibleChangesInCustomFields : 'handlePossibleChangesInCustomFields',
                    beforePossibleChangesInCustomFields : 'handleBeforePossibleChangesInCustomFields'
                }
            }
        },

        entityId : null,

        save : function(entityId, callback, scope) {
            var view = this.getView(),
                dfd = Ext.create('Ext.Deferred'),
                store = view.getStore(),
                params = {
                    entityTypeCd : view.getEntityTypeCd(),
                    employerId : criterion.Api.getEmployerId()
                };

            view.updateStore();
            store.setEntityId(Ext.isNumeric(entityId) ? entityId : (Ext.isArray(entityId) ? entityId[0] : entityId));

            if (store.needsSync) {
                if (view.getEntityTypeCode() === 'FORM') {
                    params.customFormId = entityId[1];
                }
                store.sync({
                    params : params,
                    callback : function() {
                        Ext.callback(callback, scope);
                        dfd.resolve();
                    }
                });
            } else {
                Ext.callback(callback, scope);
                dfd.resolve();
            }

            return dfd.promise;
        },

        load : function(entityId, callback, data) {
            var dfd = Ext.create('Ext.Deferred'),
                me = this;

            this._load(entityId, function() {
                Ext.isFunction(callback) ? callback.call(me) : null;
                dfd.resolve();
            }, data);

            return dfd.promise;
        },

        _load : function(entityId, callback, data) {
            if (criterion.CodeDataManager.isEmptyStore(criterion.consts.Dict.DATA_TYPE)) {
                criterion.CodeDataManager.load([criterion.consts.Dict.DATA_TYPE], function() {
                    this.load(entityId, callback, data);
                }, this);
                return;
            }

            var view = this.getView(),
                fieldsContainer = view.getFieldsContainer(),
                me = this,
                entityTypeCd = view.getEntityTypeCd(),
                params = {
                    entityTypeCd : entityTypeCd,
                    employerId : criterion.Api.getEmployerId()
                },
                afterLoad = function(values) {
                    var entId = Ext.isNumeric(entityId) ? entityId : (Ext.isArray(entityId) ? entityId[0] : entityId);

                    if (entityId && entId && entId > 0) {
                        me.entityId = Ext.isNumeric(entityId) ? entityId : (Ext.isArray(entityId) ? entityId[0] : entityId);
                        params.entityId = Ext.isNumeric(entityId) ? entityId : (Ext.isArray(entityId) ? entityId[0] : entityId);

                        if (values) {
                            view.getStore().loadData(values);
                            Ext.isFunction(callback) ? callback.call(this) : null;
                        } else {
                            view.getStore().load({
                                params : params,
                                callback : function() {
                                    Ext.isFunction(callback) ? callback.call(this) : null;
                                }
                            });
                        }
                    } else {
                        view.bindStore(Ext.create('criterion.store.customField.Values'));
                        Ext.isFunction(callback) ? callback.call(this) : null;
                    }
                };

            if (!fieldsContainer) {
                return; // this is error state
            }

            if (fieldsContainer.getEntityTypeCode() === 'FORM') {
                params.customFormId = entityId[1];
            }

            if (entityTypeCd) {
                if (data) {
                    fieldsContainer.getStore().loadData(data);
                    afterLoad(Ext.Array.map(data, function(value) {
                        var customValue = value['customValue'] || {
                            customFieldId : value['id'],
                            value : null
                        };

                        delete value['customValue'];

                        customValue = Ext.apply(customValue, {
                            customField : value
                        });

                        return customValue;
                    }));
                } else {
                    fieldsContainer.getStore().load({
                        params : params,
                        callback : function() {
                            afterLoad();
                        }
                    });
                }
            } else {
                Ext.isFunction(callback) ? callback.call(this) : null;
            }
        },

        getChanges : function(entityId) {
            var view = this.getView(),
                store = this.getView().getStore();

            view.updateStore();
            entityId && store.setEntityId(Ext.isNumeric(entityId) ? entityId : (Ext.isArray(entityId) ? entityId[0] : entityId || null));

            return {
                modifiedCustomValues : store.getModifiedRecords(),
                removedCustomValues : store.getRemovedRecords()
            }
        },

        loadChanges : function(data, onlyChanges, delegatedByEmployeeId) {
            if (criterion.CodeDataManager.isEmptyStore(criterion.consts.Dict.DATA_TYPE)) {
                criterion.CodeDataManager.load([criterion.consts.Dict.DATA_TYPE], function() {
                    this.loadChanges(data, onlyChanges);
                }, this);
                return;
            }

            var view = this.getView(),
                fieldsContainer = view.getFieldsContainer(),
                fieldsStore = fieldsContainer.getStore(),
                entityTypeCd = view.getEntityTypeCd(),
                params = Ext.Object.merge(
                    {
                        entityTypeCd : entityTypeCd,
                        employerId : criterion.Api.getEmployerId()
                    },
                    (delegatedByEmployeeId ? {delegatedByEmployeeId : delegatedByEmployeeId} : {})
                );

            if (!fieldsContainer) {
                return; // this is error state
            }

            fieldsStore.clearFilter();
            onlyChanges && fieldsStore.filter({
                property : 'id',
                value : Ext.Array.pluck(data, 'customFieldId'),
                operator : 'in',
                exactMatch : true
            });

            if (fieldsStore.isLoaded()) {
                fieldsStore.loadData(fieldsStore.getRange());
                view.getStore().loadData(data);
            } else if (entityTypeCd) {
                fieldsStore.load({
                    params : params,
                    callback : function() {
                        view.getStore().loadData(data);
                    }
                });
            }
        },

        copyFromExist : function(entityId) {
            var view = this.getView(),
                entityTypeCd = view.getEntityTypeCd(),
                valuesHostStore = Ext.create('criterion.store.customField.Values'),
                params = {
                    entityTypeCd : entityTypeCd,
                    employerId : criterion.Api.getEmployerId(),
                    entityId : entityId
                };

            valuesHostStore.loadWithPromise({
                params : params
            }).then(function(recs) {
                Ext.Array.each(recs, function(rec) {
                    view.setItemRecord(view.getItemByRecord(rec), rec);
                });
            });
        },

        handlePossibleChangesInCustomFields : function() {
            var view = this.getView();

            if (this.checkViewIsActive()) {
                this.load(this.entityId, function() {
                    view.setLoading(false, null);
                    view.focus();
                });
            }
        },

        handleBeforePossibleChangesInCustomFields : function() {
            if (this.checkViewIsActive()) {
                this.getView().setLoading(true, null);
            }
        },

        handleRefreshClick : function() {
            this.load();
        },

        handleShow : function() {
            if (this.checkViewIsActive()) {
                this.load(this.entityId);
            }
        }
    };

});

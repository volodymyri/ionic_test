Ext.define('criterion.data.writer.Json', function() {

    return {

        alias : [
            'writer.criterion_json'
        ],

        extend : 'Ext.data.writer.Json',

        expandData : true,

        writeAllFields : false,

        /**
         * Method implements POST,PUT and DELETE for nested records (hasMany and hasOne associations).
         *
         * @param record
         * @param operation
         * @returns {*|Object}
         */
        getRecordData : function(record, operation) {
            let me = this,
                data;

            data = me.callParent(arguments);

            if (operation.isCreateOperation || operation.isUpdateOperation) {
                data = this._processDeepAssociations(record, data);
            }

            return data;
        },

        _processDeepAssociations(record, levelData) {
            let me = this,
                associations = record.associations,
                association, roleName, item, associationKey;

            for (roleName in associations) {
                association = associations[roleName];
                // association.role is association key for configuration with associatedName
                associationKey = association.associationKey || association.role;

                if (associationKey.indexOf('.') !== -1) {
                    // blocking collect invert associations. example "employer.ShiftGroup"
                    continue;
                }

                item = association.getterName && Ext.isFunction(record[association.getterName]) && record[association.getterName]();

                if (!item) {
                    continue;
                }

                if (item.isStore) {
                    levelData[associationKey] = [];

                    Ext.Array.each(item.getModifiedRecords(), childRecord => {
                        let opts = {
                            serialize : true,
                            associated : true,
                            associatedForCommit : true,
                            persist : true,
                            critical : true
                        }, childData;

                        if (!childRecord.phantom) {
                            opts.changes = true;
                        }

                        childData = me._processDeepAssociations(childRecord, childRecord.getData(opts));

                        if (childRecord.phantom) {
                            delete childData[me._getIdPropertyName(childRecord)];
                        } else {
                            childData[me._getIdPropertyName(childRecord)] = childRecord.getId();
                        }

                        levelData[associationKey].push(childData);
                    });

                    Ext.Array.each(item.getRemovedRecords(), childRecord => {
                        let childData = me._processDeepAssociations(childRecord, {});

                        childData[me._getIdPropertyName(childRecord)] = childRecord.getId();
                        childData['$delete'] = true;

                        levelData[associationKey].push(childData);
                    });

                    if (!levelData[associationKey].length) {
                        delete levelData[associationKey];
                    } else {
                        record.dirty = true;
                    }
                } else if (item.isModel) {
                    if (item.dirty || item.phantom) {
                        levelData[associationKey] = item.getData({
                            serialize : true,
                            persist : true,
                            critical : true
                        });

                        if (item.phantom) {
                            delete levelData[associationKey][me._getIdPropertyName(item)];
                        }

                        record.dirty = true;
                    }
                }
            }

            return levelData;
        },

        _getIdPropertyName(record) {
            let o = record.getIdProperty();

            return Ext.isObject(o) ? o.name : o;
        }
    };

});



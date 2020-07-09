Ext.define('criterion.overrides.data.operation.Operation', {

    override : 'Ext.data.operation.Operation',

    doProcess : function(resultSet, request, response) {
        var me = this,
            commitSetOptions = me._commitSetOptions,
            clientRecords = me.getRecords(),
            clientLen = clientRecords.length,
            clientIdProperty = clientRecords[0].clientIdProperty,
            serverRecords = resultSet.getRecords(), // a data array, not records yet
            serverLen = serverRecords ? serverRecords.length : 0,
            clientMap, serverRecord, clientRecord, i;

        if (serverLen && clientIdProperty) {
            // Linear pass over clientRecords to map them by their idProperty
            clientMap = Ext.Array.toValueMap(clientRecords, 'id');

            // Linear pass over serverRecords to match them by clientIdProperty to the
            // corresponding clientRecord (if one exists).
            for (i = 0; i < serverLen; ++i) {
                serverRecord = serverRecords[i];
                clientRecord = clientMap[serverRecord[clientIdProperty]];

                if (clientRecord) {
                    // Remove this one so we don't commit() on it next
                    delete clientMap[clientRecord.id];
                    // Remove the clientIdProperty value since we don't want to store it
                    delete serverRecord[clientIdProperty];

                    clientRecord.set(serverRecord, commitSetOptions); // set & commit
                }
                //<debug>
                else {
                    Ext.log.warn('Ignoring server record: ' + Ext.encode(serverRecord));
                }
                //</debug>
            }

            // Linear pass over any remaining client records.
            for (i in clientMap) {
                clientMap[i].commit();
            }
        }
        else {
            // Either no serverRecords or no clientIdProperty, so index correspondence is
            // all we have to go on. If there is no serverRecord at a given index we just
            // commit() the record.
            for (i = 0; i < clientLen; ++i) {
                clientRecord = clientRecords[i];

                if (serverLen === 0 || !(serverRecord = serverRecords[i])) {
                    // once i > serverLen then serverRecords[i] will be undefined...
                    clientRecord.commit();
                } else {
                    this.updateAssociated(clientRecord, serverRecord); // <- changed (added)
                    clientRecord.set(serverRecord, commitSetOptions);
                }
            }
        }
    },

    updateAssociated : function(record, data) {
        if (!this.isCreateOperation) {
            return
        }

        record.updateAssociated && record.updateAssociated(data);
    }

});

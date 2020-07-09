Ext.define('criterion.overrides.data.Store', {

    override : 'Ext.data.Store',

    getDataAsArray : function(serialize, includeRemoved) {
        var arr = [];

        Ext.Array.each(this.getRange(), function(record) {
            arr.push(record.getData({serialize : !!serialize}));
        });

        if (includeRemoved) {
            Ext.Array.each(this.getRemovedRecords(), function(record) {
                var data = {};

                data[record.getIdProperty()] = record.getId();
                data['$delete'] = true;

                arr.push(data);
            });
        }

        return arr;
    },
    
    needSync : function() {
        return !!(this.getModifiedRecords().length || this.getRemovedRecords().length)
    },

    /**
     * Copy records to destination store, including removed records.
     * @param destStore - destinationStore
     * @param setPhantom - if true then records will be cloned without ids
     */
    cloneToStore : function(destStore, setPhantom) {
        if (setPhantom === true) {
            Ext.Array.each(this.getRange(), function(record) {
                destStore.add(record.copy(null));
            });
        } else {
            destStore.add(this.getRange());

            Ext.Array.each(this.getRemovedRecords(), function(removedRecord) {
                destStore.remove(destStore.add(removedRecord));
            });
        }
    }

});

Ext.define('criterion.overrides.data.Role', {

    override : 'Ext.data.schema.Role',

    storeConfig : {
        type : 'criterion',
        autoLoad : false,
        autoSync : false
    },

    /**
     * Will include association's data into POST, PUT and DELETE requests.
     */
    commitUpdates : false,

    /**
     * @param rec
     * @returns {*}
     */
    getAssociatedItem: function(rec) {
        if (!this.commitUpdates && rec.$gatheringForCommit) {
            return null;
        } else {
            return this.callParent(arguments);
        }
    }

});
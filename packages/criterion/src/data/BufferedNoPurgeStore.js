Ext.define('criterion.data.BufferedNoPurgeStore', function() {

    return {
        extend : 'criterion.data.BufferedStore',

        alias : 'store.criterion_buffered_no_purge',

        autoLoad : false,

        autoSync : false,

        pageSize : criterion.Consts.PAGE_SIZE.BUFFERED_STORE_DEFAULT,

        purgePageCount : 0,

        leadingBufferZone : criterion.Consts.BUFFERED_STORE.DEFAULT_LEADING_BUFFER_ZONE,

        trailingBufferZone : 0,

        /*
            As store configured to not purge loaded pages, we can implement each, count to be compatible with check box selection model etc.
         */
        each : function(fn, scope) {
            let data = this.data;
            data && data.forEach(fn, scope);
        },

        count : function() {
            return this.getTotalCount();
        }

    };

});

Ext.define('criterion.store.LoadProtectedStore', function() {

    return {
        extend : 'criterion.store.AbstractStore',

        config : {
            protectPrematureLoad : true
        },

        constructor : function() {
            var me = this;

            me.callParent(arguments);
            me.on('load', function() {
                me.setProtectPrematureLoad(false)
            }, me, {single : true});
        },

        onSorterEndUpdate : function() {
            if (!this.getRemoteSort() || !this.getProtectPrematureLoad()) {
                this.callParent(arguments)
            }
        },

        onFilterEndUpdate : function() {
            if (!this.getRemoteFilter() || !this.getProtectPrematureLoad()) {
                this.callParent(arguments)
            }
        }
    };

});

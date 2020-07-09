Ext.define('criterion.model.security.Abstract', function() {

    return {
        extend : 'criterion.model.Abstract',

        requires : [
            'criterion.data.field.StatusBit'
        ],

        /**
         * Needs to be overriden in subclasses!
         * Should return byte string '1010', '100', etc
         */
        serializeAccessLevelFn : Ext.emptyFn,

        getAccessLevel : function() {
            return this.getData({serialize : true})['accessLevel'];
        },

        fields : [
            // IMPORTANT - do not read from this field directly, it will be out of sync!
            // use record.getAccessLevel() instead
            {
                name : 'accessLevel',
                type : 'int',
                defaultValue : '0000',
                convert : function(value) {
                    return parseInt(value, 2)
                },
                serialize : function(value, record) {
                    return record.serializeAccessLevelFn.apply(record, arguments);
                }
            }
        ]
    };
});

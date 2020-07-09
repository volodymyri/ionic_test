Ext.define('criterion.data.field.Json', function() {

    return {
        alias : 'data.field.criterion_json',

        extend : 'Ext.data.field.String',

        convert : function(value) {
            return Ext.decode(value, true);
        },

        serialize : function(value) {
            return Ext.encode(value);
        }
    };

});

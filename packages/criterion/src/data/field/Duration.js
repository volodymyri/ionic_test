Ext.define('criterion.data.field.Duration', function() {

    return {

        alias : [
            'data.field.criterion_duration',
            'data.field.duration',
            'data.field.dur'
        ],

        extend : 'Ext.data.field.Number',

        convert : function(v, record) {
            if (!v) {
                return
            }

            if (Ext.isNumeric(v)) {
                return Ext.Number.parseFloat(v)
            } else {
                return Ext.Number.parseFloat(criterion.Utils.durationToHours(v))
            }
        }
    };

});

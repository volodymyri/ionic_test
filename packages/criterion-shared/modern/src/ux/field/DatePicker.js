Ext.define('criterion.ux.field.DatePicker', function() {

    return {

        alias : 'widget.criterion_date_picker_field',

        extend : 'Ext.field.DatePicker',

        applyValue : function(value, oldValue) {
            if (!Ext.isDate(value)) {
                if (value) {
                    value = new Date(value); // <- changed
                } else {
                    value = null;
                }
            }

            // The same date value may not be the same reference, so compare them by time.
            // If we have dates for both, then compare the time. If they're the same we
            // don't need to do anything.
            if (value && oldValue && value.getTime() === oldValue.getTime()) {
                value = undefined;
            }

            return value;
        }
    };

});

/**
 * A ratings picker (extended)
 */
Ext.define('criterion.ux.rating.Picker', {
    extend : 'Ext.ux.rating.Picker',
    xtype : 'criterion_rating',

    cachedConfig : {
        /**
         * for readOnly state
         */
        forViewOnly : false
    },

    onClick : function(event) {
        if (this.getForViewOnly()) {
            return;
        }

        var value = this.valueFromEvent(event);
        this.setValue(value);
        this.fireEvent('afterClick');
    },

    updateForViewOnly : function(value) {
        this.updateTrackOver(!value);
    }
});

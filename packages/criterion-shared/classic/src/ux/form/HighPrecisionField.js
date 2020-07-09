Ext.define('criterion.ux.form.HighPrecisionField', {

    extend : 'Ext.form.field.Number',

    alias : 'widget.criterion_form_high_precision_field',

    highPrecision : 20,

    defaultDecimalPrecision : 0,

    highPrecisionValue : null,
    namePrecision : 'currencyRatePrecision',

    initComponent : function() {
        this.defaultDecimalPrecision = Ext.util.Format[this.namePrecision];
        this.decimalPrecision = this.defaultDecimalPrecision;

        Ext.GlobalEvents.on('globalFormatChange', function() {
            this.defaultDecimalPrecision = Ext.util.Format[this.namePrecision];
            this.decimalPrecision = this.defaultDecimalPrecision;
        }, this);

        this.callParent(arguments);
    },

    setValue : function(value, highPrecisionValue) {
        this.highPrecisionValue = value;
        return this.callParent(arguments);
    },

    getValue : function(defaultMethod) {
        return this.highPrecisionValue && !defaultMethod ? this.highPrecisionValue : this.callParent(arguments);
    },

    onFocus : function() {
        this.decimalPrecision = this.highPrecision;

        if (this.highPrecisionValue) {
            this.setValue(this.highPrecisionValue);
        }

        this.callParent(arguments);
    },

    onBlur : function() {
        var value = this.rawToValue(this.getRawValue()),
            highPrecisionValue = this.getValue(true);

        this.decimalPrecision = this.defaultDecimalPrecision;

        this.setValue(value, highPrecisionValue);

        this.superclass.superclass.onBlur.apply(this, arguments); // skip Ext.form.field.Number as 'setValue' is extended but is used in parent
    }
});

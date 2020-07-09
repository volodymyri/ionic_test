Ext.define('criterion.ux.form.PercentagePrecisionField', {

    extend : 'Ext.form.field.Number',

    alias : 'widget.criterion_percentage_precision_field',

    /**
     * False to ignore global formatting.
     */
    useGlobalFormat : true,

    initComponent() {
        this.useGlobalFormat && this.updateFormatFromGlobal();

        this.callParent(arguments);

        Ext.on('globalFormatChange', function() {
            if (this.useGlobalFormat) {
                this.updateFormatFromGlobal();
            }
        }, this);
    },

    /**
     * @private
     */
    updateFormatFromGlobal() {
        this.decimalSeparator = Ext.util.Format.decimalSeparator;
        this.decimalPrecision = Ext.util.Format.percentagePrecision;
    }

});

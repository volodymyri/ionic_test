Ext.define('criterion.ux.form.PercentageField', {

    extend : 'Ext.form.field.Number',

    alias : 'widget.criterion_percentagefield',

    allowExponential : false,

    minValue : 0,

    allowDecimals : true,

    decimalPrecision : 4,

    baseChars : '0123456789%',

    hiddenValue : null,
    hasSign : false,

    config : {
        /**
         * @cfg {Boolean} fractionInput
         * If true we treat typed number as fraction and as actual percent value otherwise.
         * (defaults to true)
         */
        fractionInput : true
    },

    setValue : function(value) {
        var repeatFn = function(str, n) {
            return new Array(n + 1).join(str);
        };

        var formatString = '0.' + repeatFn('#', this.decimalPrecision > 2 ? this.decimalPrecision - 2 : this.decimalPrecision),
            bind, valueBind, rawValue;

        if (this.hasFocus) {
            bind = this.getBind();
            valueBind = bind && bind.value;
            if (valueBind && valueBind.syncing && value === this.value) {
                return this;
            }
        }

        this.callParent([value]);

        this.hiddenValue = this.value;

        if (this.allowBlank && (value === null || value === undefined)) {
            rawValue = null;
        } else {
            rawValue = Ext.util.Format.number(this.getFractionInput() ? this.value * 100 : this.value, formatString) + Ext.util.Format.percentSign;
        }

        this.setRawValue(rawValue);
    },

    getValue : function() {
        if (this.hasFocus && !this.bluring) {
            this.hiddenValue = this.callParent(arguments);
        }

        return this.hiddenValue
    },

    onFocus : function() {
        var value = this.hiddenValue;

        if (this.hasSign) {
            value = value * 100 + '%'
        }

        this.setRawValue(value);

        this.callParent(arguments);
    },

    onBlur : function() {
        var rawValue = this.getRawValue(),
            value = this.rawToValue(rawValue),
            signIndex = rawValue.indexOf('%');

        this.hasSign = signIndex !== -1 && signIndex + 1 == rawValue.length;

        if (this.hasSign) {
            value = value / 100
        }

        !Ext.isEmpty(value) && this.setRawValue(value);

        this.callParent(arguments);
    },

    beforeBlur : function() {
        this.bluring = true;

        this.callParent(arguments);
    },

    postBlur : function() {
        this.bluring = false;

        this.callParent(arguments);
    },

    getErrors : function() {
        var value = this.processRawValue(this.valueToRaw(this.getValue()));

        if (value && value.indexOf('%') + 1 == value.length) {
            value = value / 100
        }

        return this.callParent([value]);
    }
});

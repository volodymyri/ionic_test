Ext.define('criterion.ux.field.CurrencyField', function() {

    return {

        alias : 'widget.criterion_field_currency_field',

        extend : 'Ext.field.Text',

        currencySymbol : '$',

        allowDecimals : true,
        /**
         * False to ignore global formatting.
         */
        useGlobalFormat : true,

        /**
         * True to use currency rate precision as decimal precision.
         */
        isRatePrecision : false,

        /**
         * @private
         */
        isCurrency : true,

        currencySymbolPos : null,

        useThousandSeparator : true,
        thousandSeparator : null,
        alwaysDisplayDecimals : true,

        allowExponential : false,

        rawValue : null,

        config : {
            currencySeparator : '',
            isFocused : false
        },

        constructor : function() {
            this.useGlobalFormat && this.updateFormatFromGlobal();

            this.isCurrency = !Ext.isEmpty(this.currencySymbol);

            this.callParent(arguments);

            Ext.on('globalFormatChange', function() {
                if (this.useGlobalFormat) {
                    var currValue = this._processRawValue(this.getValue());
                    this.updateFormatFromGlobal();
                    this.setValue(currValue);
                }
            }, this);
        },

        upValue : function() {
            var currValue = this._processRawValue(this.getValue());

            this.setValue(currValue);
        },

        /**
         * @private
         */
        updateFormatFromGlobal : function() {
            this.currencySymbol = Ext.util.Format.currencySign;
            this.thousandSeparator = Ext.util.Format.thousandSeparator;
            this.decimalSeparator = Ext.util.Format.decimalSeparator;
            this.decimalPrecision = this.isRatePrecision ? Ext.util.Format.currencyRatePrecision : Ext.util.Format.currencyPrecision;
            this.currencySymbolPos = Ext.util.Format.currencyAtEnd ? 'right' : 'left';
        },

        setValue : function(value) {
            var val,
                bind = this.getBind(),
                stub = bind && bind.value && bind.value.stub;

            this.rawValue = this.removeFormat(value);

            val = !this.getIsFocused() || this.isDisabled() || this.getReadOnly() ? this.getFormattedValue(this._processRawValue(value)) : this.rawValue;

            if (stub && stub.owner && stub.owner.set) {
                stub.owner.set(stub.path, this.rawValue);
            }

            this.callParent([val]);
        },

        getValue : function() {
            return this.rawValue;
        },

        /**
         * getFormattedValue
         */
        getFormattedValue : function(value) {
            if (Ext.isEmpty(value) || !this.hasFormat()) {
                return value;
            } else {
                var neg;

                if (!Ext.isNumber(value) && Ext.isNumeric(value)) {
                    value = Ext.Number.parseFloat(this.removeFormat(value));
                }

                value = (neg = value < 0) ? value * -1 : value;
                value = this.allowDecimals && this.alwaysDisplayDecimals ? value.toFixed(this.decimalPrecision) : value;

                if (this.useThousandSeparator) {
                    if (this.useThousandSeparator && Ext.isEmpty(this.thousandSeparator)) {
                        console && console.error('NumberFormatException: invalid thousandSeparator, property must has a valid character.');
                        return '';
                    }
                    if (this.thousandSeparator === this.decimalSeparator) {
                        console && console.error('NumberFormatException: invalid thousandSeparator, thousand separator must be different from decimalSeparator.');
                        return '';
                    }

                    value = value.toString();

                    var ps = value.split('.');
                    ps[1] = ps[1] ? ps[1] : null;

                    var whole = ps[0];

                    var r = /(\d+)(\d{3})/;

                    var ts = this.thousandSeparator;

                    while (r.test(whole)) {
                        whole = whole.replace(r, '$1' + ts + '$2');
                    }

                    value = whole + (ps[1] ? this.decimalSeparator + ps[1] : '');
                }

                var position1 = this.isCurrency ? this.currencySymbol + this.getCurrencySeparator() : '';
                var position2 = value;

                if (this.currencySymbolPos === 'right') {
                    position1 = value;
                    position2 = this.isCurrency ? this.getCurrencySeparator() + this.currencySymbol : '';
                }

                return Ext.String.format('{0}{1}{2}', (neg ? '-' : ''), position1, position2);
            }
        },

        /**
         * overrides parseValue to remove the format applied by this class
         */
        parseValue : function(value) {
            //Replace the currency symbol and thousand separator
            return this.callParent([this.removeFormat(value)]);
        },

        /**
         * Remove only the format added by this class to let the superclass validate with it's rules.
         * @param {Object} value
         */
        removeFormat : function(value) {
            if (Ext.isEmpty(value)) {
                return '';
            } else if (!this.hasFormat()) {
                return value;
            } else {
                value = Ext.String.trim(value.toString().replace(this.currencySymbol, ''));

                value = this.useThousandSeparator ? value.replace(new RegExp('[' + this.thousandSeparator + ']', 'g'), '') : value;
                return value;
            }
        },

        hasFormat : function() {
            return this.decimalSeparator !== '.' || (this.useThousandSeparator && this.getValue() != null) || !Ext.isEmpty(this.currencySymbol) || this.alwaysDisplayDecimals;
        },

        _processRawValue : function(value) {
            return this.removeFormat(value);
        },

        onFocus : function() {
            this.setIsFocused(true);

            this.setValue(this.rawValue);
            this.callParent(arguments);
        },

        onBlur : function() {
            this.setIsFocused(false);

            this.setValue(this.rawValue);
            this.callParent(arguments);
        }
    };

});

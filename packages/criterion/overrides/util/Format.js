Ext.define('criterion.overrides.util.Format', {

    override : 'Ext.util.Format',

    currencyRatePrecision : 2,
    percentagePrecision : 2,
    hoursPrecision : 5,

    /**
     * Converts dot-separated name to path.
     */
    toPath : function(nameIn) {
        let path = nameIn.split(/\./),
            name = path.pop();

        path.push(Ext.String.uncapitalize(name));

        return path.join('/');
    },

    percent : function(value, formatString) {
        let employerFormat = '0.' + Ext.String.repeat('#', this.percentagePrecision);

        return this.number(value * 100, formatString || employerFormat) + this.percentSign;
    },

    percentNumber : function(v, formatString) {
        return this.number(v, formatString) + this.percentSign;
    },

    criterionFileSize : function(size) {
        const kbSize = 1024;

        if (typeof size === 'undefined') {
            return '';
        }

        size = (!size || size > kbSize) ? size : kbSize;

        return (this.number(size / kbSize, '0,000')) + ' KB';
    },

    date : function(value, format) {
        if ((!format || format === criterion.consts.Api.DATE_FORMAT_US) && (/^\d{4}\.\d{2}\.\d{2}$/).test(value)) {
            value = value.replace(/\./g, '-');
        }

        if (value && !Ext.isDate(value)) {
            value = Ext.Date.parse(value, format || criterion.consts.Api.DATE_FORMAT_ISO)
        }
        return this.callParent([value, format])
    },

    predefinedPrecision : function(v, precision) {
        let format = ",0",
            decimals = precision,
            i = 0;

        format += (decimals > 0 ? '.' : '');
        for (; i < decimals; i++) {
            format += '0';
        }

        return this.number(v, format);
    },

    employerAmountPrecision : function(v) {
        return this.predefinedPrecision(v, this.amountPrecision);
    },

    employerAmountPrecisionRenderer : function() {
        let me = this;

        return function(v) {
            return me.employerAmountPrecision(v);
        };
    },

    employerRatePrecision : function(v) {
        return this.predefinedPrecision(v, this.currencyRatePrecision);
    },

    employerHoursPrecision : function(v) {
        return this.predefinedPrecision(v, this.hoursPrecision);
    },

    decamelize : function(value, separator = '_') {
        return String(value)
            .replace(/([a-z\d])([A-Z])/g, '$1' + separator + '$2')
            .replace(/([A-Z]+)([A-Z][a-z\d]+)/g, '$1' + separator + '$2')
            .toLowerCase();
    },

    wordsToUnderscored : function(value) {
        return Ext.String.splitWords(String(value).toLowerCase()).join('_');
    }
});

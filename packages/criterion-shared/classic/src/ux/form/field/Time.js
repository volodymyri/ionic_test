Ext.define('criterion.ux.form.field.Time', {

    extend : 'Ext.form.field.Picker',

    alias : 'widget.criterion_time_field',

    requires : [
        'criterion.ux.picker.Time'
    ],

    format : 'g:i A',
    triggerCls : Ext.baseCSSPrefix + 'form-trigger-clock',
    pickerOffset : [0, 8],

    initDate: '1/1/2008',
    initDateFormat: 'j/n/Y',

    renderConfig : {
        /**
         * @cfg {Boolean} editable
         * False to prevent the user from typing text directly into the field; the field can only have its value set via
         * selecting a value from the picker. In this state, the picker can also be opened by clicking directly on the input
         * field itself.
         */
        editable : false
    },

    createPicker : function() {
        var me = this;

        return new criterion.ux.picker.Time({
            id : me.id + '-picker',
            pickerField : me,
            floating : true,
            preventRefocus : true,
            hidden : true,
            format : me.format,
            listeners : {
                scope : me,
                select : me.onSelect,
                tabout : me.onTabOut
            },
            startTimeThreshold : me.startTimeThreshold,
            keyNavConfig : {
                esc : function() {
                    me.inputEl.focus();
                    me.collapse();
                }
            }
        });
    },

    onSelect : function(m, d) {
        var me = this;

        me.setValue(d);
        me.rawTime = d;
        me.fireEvent('select', me, d);
        me.onTabOut(m);
    },

    onTabOut : function(picker) {
        this.inputEl.focus();
        this.collapse();
    },

    onExpand : function() {
        this.picker.setValue(this.rawTime || Ext.Date.parse('00:00', 'H:i'));
    },

    /**
     * @private
     */
    onBlur : function(e) {
        var me = this,
            v = me.rawToValue(me.getRawValue());

        if (v === '' || Ext.isDate(v)) {
            me.setValue(v);
        }
        me.callParent([e]);
    },

    formatDate : function(items) {
        var formatted = [],
            i, len;

        items = Ext.Array.from(items);

        for (i = 0, len = items.length; i < len; i++) {
            formatted.push(Ext.form.field.Date.prototype.formatDate.call(this, items[i]));
        }

        return formatted.join(this.delimiter);
    },

    /**
     * @private
     * Parses an input value into a valid Date object.
     * @param {String/Date} value
     */
    parseDate : function(value) {
        var me = this,
            val = value,
            altFormats = me.altFormats,
            altFormatsArray = me.altFormatsArray,
            i = 0,
            len;

        if (value && !Ext.isDate(value)) {
            val = me.safeParse(value, me.format);

            if (!val && altFormats) {
                altFormatsArray = altFormatsArray || altFormats.split('|');
                len = altFormatsArray.length;
                for (; i < len && !val; ++i) {
                    val = me.safeParse(value, altFormatsArray[i]);
                }
            }
        }

        // If configured to snap, snap resulting parsed Date to the closest increment.
        if (val && me.snapToIncrement) {
            val = new Date(Ext.Number.snap(val.getTime(), me.increment * 60 * 1000));
        }
        return val;
    },

    safeParse : function(value, format) {
        var me = this,
            utilDate = Ext.Date,
            parsedDate,
            result = null;

        if (utilDate.formatContainsDateInfo(format)) {
            // assume we've been given a full date
            result = utilDate.parse(value, format);
        } else {
            // Use our initial safe date
            parsedDate = utilDate.parse(me.initDate + ' ' + value, me.initDateFormat + ' ' + format);
            if (parsedDate) {
                result = parsedDate;
            }
        }
        return result;
    },

    /**
     * @private
     */
    getSubmitValue : function() {
        var me = this,
            format = me.submitFormat || me.format,
            value = me.getValue();

        return value ? Ext.Date.format(value, format) : null;
    },

    valueToRaw : function(value) {
        return this.formatDate(this.parseDate(value));
    },

    getValue : function() {
        return this.rawTime || null;
    },

    setRawValue : function(value) {
        var me = this;

        me.callParent([value]);

        me.rawTime = Ext.isDate(value) ? value : me.rawToValue(value);
        me.rawTimeText = this.formatDate(value);
    },

    rawToValue : function(raw) {
        return Ext.isString(raw) ? Ext.Date.parse(raw, this.format) : Ext.Date.parse('00:00', 'H:i');
    },

    setStartTime : function(startTimeThreshold) {
        this.startTimeThreshold = startTimeThreshold;
    }
});

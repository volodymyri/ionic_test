Ext.define('criterion.ux.field.Time', function() {

    return {

        alias : 'widget.criterion_timefield',

        extend : 'criterion.ux.field.Combobox',

        config : {
            /*
             * @private
             * @override
             * This class creates its own store based upon time range and increment configuration.
             */
            store : true
        },

        statics : {
            /**
             * @private
             * Creates the internal {@link Ext.data.Store} that contains the available times. The store
             * is loaded with all possible times, and it is later filtered to hide those times outside
             * the minValue/maxValue.
             */
            createStore : function(format, increment, displayFormat) {
                let dateUtil = Ext.Date,
                    clearTime = dateUtil.clearTime,
                    times = [],
                    min = clearTime(new Date()),
                    max = dateUtil.add(clearTime(new Date()), 'mi', (24 * 60) - 1),
                    modelType = Ext.define(null, {
                        extend : 'Ext.data.Model',
                        fields : ['disp', 'date', 'ts']
                    });

                while (min <= max) {
                    times.push({
                        disp : dateUtil.dateFormat(min, displayFormat),
                        date : dateUtil.dateFormat(min, format),
                        ts : +min
                    });
                    min = dateUtil.add(min, 'mi', increment);
                }

                return new Ext.data.Store({
                    model : modelType,
                    data : times,
                    sorters : [
                        {
                            property : 'ts',
                            direction : 'ASC'
                        }
                    ]
                });
            }
        },

        classCls : 'criterion-timefield',

        increment : 15,

        format : 'g:i A',
        innerValueFormat : 'H:i',
        displayFormat : 'g:i A',

        displayField : 'disp',
        valueField : 'date',

        initDate : [2008, 0, 1],

        applyStore : function(store) {
            if (store === true) {
                store = criterion.ux.field.Time.createStore(this.innerValueFormat, this.increment, this.displayFormat);
            }

            return store;
        },

        setValue : function(value) {
            if (Ext.isDate(value)) {
                value = Ext.Date.dateFormat(value, this.innerValueFormat);
            }

            this._checkValuePresentInStore(value);

            this.callParent([value]);
        },

        _checkValuePresentInStore : function(value) {
            let store = this.getStore(),
                date,
                val = Ext.isObject(value) ? value.value : value;

            if (val && !store.findRecord('date', val)) {
                date = Ext.Date.parse(val, this.innerValueFormat);
                store.suspendEvents(false);
                store.add({
                    disp : Ext.Date.dateFormat(date, this.displayFormat),
                    date : Ext.Date.dateFormat(date, this.innerValueFormat),
                    ts : +date
                });
                store.resumeEvents();
            }
        },

        validate : function(skipLazy) {
            let res = this.callParent(arguments),
                value = this.getValue();

            if (!this.allowBlank && !value && !this.getDisabled()) {
                this.setError([i18n.gettext('Must be present')]);

                return false;
            }

            return res;
        },

        setIncrement(value) {
            this.increment = parseInt(value, 10) || 1;

            this.setStore(true);
        }
    };

});

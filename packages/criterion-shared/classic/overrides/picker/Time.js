Ext.define('criterion.overrides.picker.Time', {

    override : 'Ext.picker.Time',

    showNextMidnight : false,

    initComponent : function() {
        var me = this,
            dateUtil = Ext.Date,
            initDate = me.initDate,
            parentCmp = me.up();

        me.callParent();

        me.showNextMidnight = parentCmp.showNextMidnight;

        // Set up absolute min and max for the entire day
        me.absMin = new Date(initDate[0], initDate[1], initDate[2]);
        me.absMax = dateUtil.add(new Date(initDate[0], initDate[1], initDate[2]), 'mi', me.showNextMidnight ? 24 * 60 : ((24 * 60) - 1));

        // Updates the range filter's filterFn according to our configured min and max
        me.updateList();
    },

    updateList : function() {
        var me = this,
            min = me.showNextMidnight ? (me.minValue || me.absMin) : me.normalizeDate(me.minValue || me.absMin), // <-- changed
            max = me.showNextMidnight ? (me.maxValue || me.absMax) : me.normalizeDate(me.maxValue || me.absMax),
            filters = me.getStore().getFilters(),
            filter = me.rangeFilter;

        filters.beginUpdate();

        if (filter) {
            filters.remove(filter);
        }

        filter = me.rangeFilter = new Ext.util.Filter({
            filterFn : function(record) {
                var date = record.get('date');
                return date >= min && date <= max;
            }
        });

        filters.add(filter);
        filters.endUpdate();
    },

    statics : {
        /**
         * @private
         * Creates the internal {@link Ext.data.Store} that contains the available times. The store
         * is loaded with all possible times, and it is later filtered to hide those times outside
         * the minValue/maxValue.
         */
        createStore : function(format, increment, showNextMidnight) {
            var dateUtil = Ext.Date,
                initDate = this.prototype.initDate,
                clearTime = dateUtil.clearTime,
                times = [],
                min, max;

            min = clearTime(new Date(initDate[0], initDate[1], initDate[2]));
            max = dateUtil.add(
                clearTime(new Date(initDate[0], initDate[1], initDate[2])), 'mi', showNextMidnight ? 25 * 60 : ((24 * 60) - 1) // <- changed
            );

            while (min <= max) {
                times.push({
                    disp : dateUtil.dateFormat(min, format),
                    date : min
                });
                min = dateUtil.add(min, 'mi', increment);
            }

            return new Ext.data.Store({
                model : Ext.picker.Time.prototype.modelType,
                data : times
            });
        }
    }
});

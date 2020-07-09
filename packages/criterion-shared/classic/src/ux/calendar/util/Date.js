Ext.define('criterion.ux.calendar.util.Date', {
    
    singleton: true,
    
    diffDays: function(start, end) {
        var day = 1000 * 60 * 60 * 24,
            clear = Ext.Date.clearTime,
            diff = clear(end, true).getTime() - clear(start, true).getTime();
        
        return Math.ceil(diff / day);
    },

    copyTime: function(fromDt, toDt) {
        var dt = Ext.Date.clone(toDt);
        dt.setHours(
            fromDt.getHours(),
            fromDt.getMinutes(),
            fromDt.getSeconds(),
            fromDt.getMilliseconds());

        return dt;
    },

    compare: function(dt1, dt2, precise) {
        if (precise !== true) {
            dt1 = Ext.Date.clone(dt1);
            dt1.setMilliseconds(0);
            dt2 = Ext.Date.clone(dt2);
            dt2.setMilliseconds(0);
        }
        return dt2.getTime() - dt1.getTime();
    },
    
    isMidnight: function(dt) {
        return dt.getHours() === 0 &&
               dt.getMinutes() === 0 &&
               dt.getSeconds() === 0 && 
               dt.getMilliseconds() === 0;    
    },

    // private helper fn
    maxOrMin: function(max) {
        var dt = (max ? 0: Number.MAX_VALUE),
        i = 0,
        args = arguments[1],
        ln = args.length;
        for (; i < ln; i++) {
            dt = Math[max ? 'max': 'min'](dt, args[i].getTime());
        }
        return new Date(dt);
    },

    max: function() {
        return this.maxOrMin.apply(this, [true, arguments]);
    },

    min: function() {
        return this.maxOrMin.apply(this, [false, arguments]);
    },
    
    today: function() {
        return Ext.Date.clearTime(new Date());
    },

    _add : function(date, interval, value) {
        var utilDate = Ext.Date,
            d = utilDate.clone(date),
            base = 0,
            day, decimalValue;

        if (!interval || value === 0) {
            return d;
        }

        decimalValue = value - parseInt(value, 10);
        value = parseInt(value, 10);

        if (value) {
            switch (interval.toLowerCase()) {
                // See EXTJSIV-7418. We use setTime() here to deal with issues related to
                // the switchover that occurs when changing to daylight savings and vice
                // versa. setTime() handles this correctly where setHour/Minute/Second/Millisecond
                // do not. Let's assume the DST change occurs at 2am and we're incrementing using add
                // for 15 minutes at time. When entering DST, we should see:
                // 01:30am
                // 01:45am
                // 03:00am // skip 2am because the hour does not exist
                // ...
                // Similarly, leaving DST, we should see:
                // 01:30am
                // 01:45am
                // 01:00am // repeat 1am because that's the change over
                // 01:30am
                // 01:45am
                // 02:00am
                // ....
                //
                case utilDate.MILLI:
                    d.setTime(d.getTime() + value);
                    break;
                case utilDate.SECOND:
                    d.setTime(d.getTime() + value * 1000);
                    break;
                case utilDate.MINUTE:
                    d.setTime(d.getTime() + value * 60 * 1000);
                    break;
                case utilDate.HOUR:
                    d.setTime(d.getTime() + value * 60 * 60 * 1000);
                    break;
                case utilDate.DAY:
                    d.setDate(d.getDate() + value);
                    break;
                case utilDate.MONTH:
                    day = date.getDate();
                    if (day > 28) {
                        day = Math.min(day, utilDate.getLastDateOfMonth(utilDate.add(utilDate.getFirstDateOfMonth(date), utilDate.MONTH, value)).getDate());
                    }
                    d.setDate(day);
                    d.setMonth(date.getMonth() + value);
                    break;
                case utilDate.YEAR:
                    day = date.getDate();
                    if (day > 28) {
                        day = Math.min(day, utilDate.getLastDateOfMonth(utilDate.add(utilDate.getFirstDateOfMonth(date), utilDate.YEAR, value)).getDate());
                    }
                    d.setDate(day);
                    d.setFullYear(date.getFullYear() + value);
                    break;
            }
        }

        if (decimalValue) {
            switch (interval.toLowerCase()) {
                case utilDate.MILLI:
                    base = 1;
                    break;
                case utilDate.SECOND:
                    base = 1000;
                    break;
                case utilDate.MINUTE:
                    base = 1000 * 60;
                    break;
                case utilDate.HOUR:
                    base = 1000 * 60 * 60;
                    break;
                case utilDate.DAY:
                    base = 1000 * 60 * 60 * 24;
                    break;

                case utilDate.MONTH:
                    day = utilDate.getDaysInMonth(d);
                    base = 1000 * 60 * 60 * 24 * day;
                    break;

                case utilDate.YEAR:
                    day = (utilDate.isLeapYear(d) ? 366 : 365);
                    base = 1000 * 60 * 60 * 24 * day;
                    break;
            }
            if (base) {
                d.setTime(d.getTime() + base * decimalValue);
            }
        }

        return d;
    },

    /**
     * Adds time to the specified date and returns a new Date instance as the result (does not
     * alter the original date object). Time can be specified in any combination of milliseconds
     * to years, and the function automatically takes leap years and daylight savings into account.
     * Some syntax examples:<code><pre>
var now = new Date();

// Add 24 hours to the current date/time:
var tomorrow = Extensible.Date.add(now, { days: 1 });

// More complex, returning a date only with no time value:
var futureDate = Extensible.Date.add(now, {
    weeks: 1,
    days: 5,
    minutes: 30,
    clearTime: true
});
</pre></code>
     * @param {Date} dt The starting date to which to add time
     * @param {Object} o A config object that can contain one or more of the following
     * properties, each with an integer value:
     * 
     * - millis
     * - seconds
     * - minutes
     * - hours
     * - days
     * - weeks
     * - months
     * - years
     * 
     * You can also optionally include the property "clearTime: true" which will perform all of the
     * date addition first, then clear the time value of the final date before returning it.
     * @return {Date} A new date instance containing the resulting date/time value
     */
    add : function(dt, o) {
        if (!o) {
            return dt;
        }
        var ExtDate = Ext.Date,
            dateAdd = this._add,
            newDt = ExtDate.clone(dt);
        
        if (o.years) {
            newDt = dateAdd(newDt, ExtDate.YEAR, o.years);
        }
        if (o.months) {
            newDt = dateAdd(newDt, ExtDate.MONTH, o.months);
        }
        if (o.weeks) {
            o.days = (o.days || 0) + (o.weeks * 7);
        }
        if (o.days) {
            newDt = dateAdd(newDt, ExtDate.DAY, o.days);
        }
        if (o.hours) {
            newDt = dateAdd(newDt, ExtDate.HOUR, o.hours);
        }
        if (o.minutes) {
            newDt = dateAdd(newDt, ExtDate.MINUTE, o.minutes);
        }
        if (o.seconds) {
            newDt = dateAdd(newDt, ExtDate.SECOND, o.seconds);
        }
        if (o.millis) {
            newDt = dateAdd(newDt, ExtDate.MILLI, o.millis);
        }
         
        return o.clearTime ? ExtDate.clearTime(newDt) : newDt;
    }
});

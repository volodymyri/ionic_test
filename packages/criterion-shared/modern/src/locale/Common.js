Ext.define('criterion.locale.Common', function() {
    Ext.onReady(function() {
        if (Ext.data && Ext.data.Types) {
            Ext.data.Types.stripRe = /[\$,%]/g;
        }

        if (Ext.Date) {
            Ext.Date.monthNames = criterion.Consts.MONTHS_ARRAY;

            Ext.Date.getShortMonthName = function(month) {
                return Ext.Date.monthNames[month].substring(0, 3);
            };

            Ext.Date.monthNumbers = criterion.Consts.MONTHS_SHORT_NUMBERS;

            Ext.Date.getMonthNumber = function(name) {
                return Ext.Date.monthNumbers[name.substring(0, 1).toUpperCase() + name.substring(1, 3).toLowerCase()];
            };

            Ext.Date.dayNames = criterion.Consts.DAYS_OF_WEEK_ARRAY;

            Ext.Date.getShortDayName = function(day) {
                return Ext.Date.dayNames[day].substring(0, 3);
            };

            Ext.Date.parseCodes.S.s = "(?:st|nd|rd|th)";
        }

        if (Ext.util && Ext.util.Format) {
            Ext.apply(Ext.util.Format, {
                thousandSeparator : ',',
                decimalSeparator : '.',
                currencySign : '$',
                dateFormat : 'm/d/Y'
            });
        }
    });

    Ext.apply(Ext.util.Format, {

        minutesToLongString : function(minutes) {
            if (!minutes) {
                return
            }

            var duration = criterion.Utils.minutesToDuration(minutes);

            return criterion.Utils.durationToLongString(duration);
        },

        minutesToShortString : function(minutes) {
            if (!minutes) {
                return
            }
            var duration = criterion.Utils.minutesToDuration(minutes);

            return criterion.Utils.durationToShortString(duration);
        },

        hoursToLongString : function(hrs) {
            if (!hrs) {
                return
            }
            var duration = criterion.Utils.hoursToDuration(hrs);

            return criterion.Utils.durationToLongString(duration);
        },

        hoursToShortString : function(hrs) {
            if (!hrs) {
                return
            }
            var duration = criterion.Utils.hoursToDuration(hrs);

            return criterion.Utils.durationToShortString(duration);
        },

        minutesToTimeString : function(minutes) {
            if (!minutes) {
                minutes = 0;
            }

            return criterion.Utils.minutesToTimeStr(minutes);
        },

        gettext : function(text) {
            return text && i18n.gettext && i18n.gettext(text);
        }
    });

    return {};
});

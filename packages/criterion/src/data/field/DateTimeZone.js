Ext.define('criterion.data.field.DateTimeZone', function() {

    return {
        alias : 'data.field.criterion_date_timezone',

        extend : 'Ext.data.field.Date',

        depends : ['timezoneCd'], // warning! this field should be presented

        dateFormat : criterion.consts.Api.DATE_TIME_FORMAT,

        tzStorageIndex : 'tz',

        getTimezoneCode : function(record) {
            var timezoneCd = record.get('timezoneCd'),
                timezoneRec = timezoneCd ? criterion.CodeDataManager.getCodeDetailRecord('id', timezoneCd, criterion.consts.Dict.TIME_ZONE) : null,
                tzRE = /\((UTC([-+]\d+:\d+)*)\)/,
                tzDescription = timezoneRec && timezoneRec.get('description'),
                res,
                tzCode;

            if (timezoneRec && tzDescription) {
                res = tzRE.exec(tzDescription);
                tzCode = res && res[1];
            }

            return tzCode;
        },

        convert : function(v, record) {
            var parsedV,
                timezoneCode = this.getTimezoneCode(record);

            if (!record[this.tzStorageIndex]) {
                record[this.tzStorageIndex] = {};
            }

            if (!v) {
                return null;
            }

            if (Ext.isString(v)) {
                record[this.tzStorageIndex][this.name + '_val'] = v;
            }

            if (v instanceof Date) {
                if (
                    (this.compare(v, record[this.tzStorageIndex][this.name + '_lastParsed']) === 0 && record[this.tzStorageIndex][this.name + '_lastTz'] === timezoneCode)
                    ||
                    !record[this.tzStorageIndex][this.name + '_val']
                ) {
                    return v;
                }

                v = record[this.tzStorageIndex][this.name + '_val'];
            }

            parsedV = criterion.Utils.parseDateWithTimezone(v, this.dateFormat, timezoneCode);

            record[this.tzStorageIndex][this.name + '_lastTz'] = timezoneCode;
            record[this.tzStorageIndex][this.name + '_lastParsed'] = parsedV;

            return parsedV
        },

         serialize : function(value, record) {
             var result,
                 timezoneCode = this.getTimezoneCode(record);

             result = this.callParent(arguments);

             return result ? (result.substr(0, 19) + (timezoneCode ? criterion.Utils.getTimezoneOffsetStr(timezoneCode) : '')) : null;
         }
    };

});

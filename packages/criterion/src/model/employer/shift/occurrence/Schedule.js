Ext.define('criterion.model.employer.shift.occurrence.Schedule', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_SHIFT_OCCURRENCE_SCHEDULE
        },

        fields : [
            {
                name : 'name',
                type : 'string'
            },
            {
                name : 'shiftId',
                type : 'integer'
            },
            {
                name : 'positionId',
                type : 'integer'
            },
            {
                name : 'numberRequired',
                type : 'integer'
            },
            {
                name : 'employerWorkLocationId',
                type : 'integer'
            },
            {
                name : 'areaId',
                type : 'integer'
            },
            {
                type : 'criterion_timezone',
                name : 'timezoneCd'
            },
            {
                name : 'startTimestamp',
                type : 'date',
                dateFormat : criterion.consts.Api.RAW_DATE_TIME_FORMAT
            },
            {
                name : 'endTimestamp',
                type : 'date',
                dateFormat : criterion.consts.Api.RAW_DATE_TIME_FORMAT
            },

            {
                name : 'startDate',
                type : 'string',
                persist : false,
                calculate : data => Ext.Date.format(data.startTimestamp, criterion.consts.Api.DATE_FORMAT)
            },

            {
                name : 'recurring',
                type : 'boolean',
                persist : false,
                convert : function(v, rec) {
                    if (typeof v === 'undefined') {
                        return !!rec.get('recurringEndDate');
                    } else {
                        return v;
                    }
                }
            },
            {
                name : 'recurringEndDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT,
                critical : true
            },
            {
                name : 'positionTitle',
                type : 'string'
            },
            {
                name : 'locationName',
                type : 'string'
            },
            {
                name : 'timezoneCd',
                type : 'criterion_codedata',
                codeDataId : criterion.consts.Dict.TIME_ZONE
            },
            {
                name : 'areaName',
                type : 'string'
            }
        ]
    };
});
